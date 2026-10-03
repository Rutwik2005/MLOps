import os
import boto3
import pandas as pd
import mlflow
import mlflow.sklearn
import mlflow.xgboost
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
import io

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "admin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "password")

s3_client = boto3.client(
    "s3",
    endpoint_url=f"http://{MINIO_ENDPOINT}",
    aws_access_key_id=MINIO_ACCESS_KEY,
    aws_secret_access_key=MINIO_SECRET_KEY
)

def init_minio():
    try:
        s3_client.head_bucket(Bucket='datasets')
    except Exception:
        s3_client.create_bucket(Bucket='datasets')
    try:
        s3_client.head_bucket(Bucket='mlflow-artifacts')
    except Exception:
        s3_client.create_bucket(Bucket='mlflow-artifacts')

def upload_dataset(file_obj, filename):
    s3_client.upload_fileobj(file_obj, 'datasets', filename)
    return f"s3://datasets/{filename}"

def download_dataset(filename):
    obj = s3_client.get_object(Bucket='datasets', Key=filename)
    df = pd.read_csv(io.BytesIO(obj['Body'].read()))
    return df

def train_model(dataset_filename: str, target_column: str, algorithm: str):
    df = download_dataset(dataset_filename)
    
    # Basic preprocessing
    df = df.dropna() # handle missing basically
    
    X = df.drop(columns=[target_column])
    
    # Drop identifier columns (where all values are unique)
    identifiers = [col for col in X.columns if X[col].nunique() == len(X) and str(X[col].dtype) in ['object', 'int64']]
    if identifiers:
        X = X.drop(columns=identifiers)
        
    original_features = []
    for col in X.columns:
        col_type = str(X[col].dtype)
        feature_type = "string"
        options = []
        if "int" in col_type or "float" in col_type:
            feature_type = "number"
        elif "bool" in col_type:
            feature_type = "boolean"
        elif "object" in col_type or "category" in col_type:
            feature_type = "categorical"
            options = X[col].dropna().unique().tolist()
            
        original_features.append({
            "name": col,
            "type": feature_type,
            "required": True,
            "options": options
        })
        
    explicit_schema = {
        "target_column": target_column,
        "features": original_features
    }
    
    # Encode categoricals basically
    X_dummies = pd.get_dummies(X)
    y = df[target_column]
    
    X_train, X_test, y_train, y_test = train_test_split(X_dummies, y, test_size=0.2, random_state=42)
    
    if algorithm == "Logistic Regression":
        model = LogisticRegression(max_iter=1000)
    elif algorithm == "Random Forest":
        model = RandomForestClassifier()
    elif algorithm == "XGBoost":
        model = XGBClassifier(use_label_encoder=False, eval_metric="logloss")
    else:
        raise ValueError("Unsupported algorithm")

    # Set up MLflow
    mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000"))
    mlflow.set_experiment("MVP_Experiment")
    
    with mlflow.start_run() as run:
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        acc = accuracy_score(y_test, preds)
        
        mlflow.log_param("algorithm", algorithm)
        mlflow.log_metric("accuracy", acc)
        
        if algorithm == "XGBoost":
            mlflow.xgboost.log_model(model, "model")
        else:
            mlflow.sklearn.log_model(model, "model")
            
        mlflow.log_dict(explicit_schema, "explicit_schema.json")
            
        return acc, run.info.run_id

def load_mlflow_model(run_id: str):
    mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000"))
    return mlflow.pyfunc.load_model(f"runs:/{run_id}/model")
