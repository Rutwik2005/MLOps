from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import pandas as pd

from models import (
    SessionLocal, User, Dataset, Experiment, RegisteredModel, Deployment,
    UserCreate, DatasetCreate, ExperimentCreate, ModelRegister, DeploymentCreate, PredictionRequest
)
from ml_utils import init_minio, upload_dataset, train_model, load_mlflow_model

# Constants
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

app = FastAPI(title="MLOps MVP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global in-memory deployed models
deployed_models = {}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def startup_event():
    init_minio()

# Auth Utils
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401)
    except JWTError:
        raise HTTPException(status_code=401)
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401)
    return user

# Auth Routes
@app.post("/api/v1/auth/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

@app.post("/api/v1/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# Dataset Routes
@app.post("/api/v1/datasets")
def create_dataset(
    name: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Upload to MinIO
    filename = f"{datetime.utcnow().timestamp()}_{file.filename}"
    s3_path = upload_dataset(file.file, filename)
    
    dataset = Dataset(name=name, description=description, file_path=filename)
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    return {"success": True, "dataset": dataset}

@app.get("/api/v1/datasets")
def get_datasets(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Dataset).all()

# Training Routes
@app.post("/api/v1/training/jobs")
def start_training(req: ExperimentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    dataset = db.query(Dataset).filter(Dataset.id == req.dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    acc, run_id = train_model(dataset.file_path, req.target_column, req.algorithm)
    
    exp = Experiment(name=f"{dataset.name}_{req.algorithm}", dataset_id=dataset.id, algorithm=req.algorithm, accuracy=acc, run_id=run_id)
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return {"success": True, "experiment": exp}

@app.get("/api/v1/experiments")
def get_experiments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Experiment).all()

# Model Registry
@app.post("/api/v1/models")
def register_model(req: ModelRegister, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    exp = db.query(Experiment).filter(Experiment.id == req.experiment_id).first()
    model = RegisteredModel(name=req.name, experiment_id=req.experiment_id, version="v1")
    db.add(model)
    db.commit()
    db.refresh(model)
    return {"success": True, "model": model}

@app.get("/api/v1/models")
def get_models(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(RegisteredModel).all()

# Deployment
@app.post("/api/v1/models/{model_id}/deploy")
def deploy_model(model_id: int, req: DeploymentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    model_record = db.query(RegisteredModel).filter(RegisteredModel.id == model_id).first()
    if not model_record:
        raise HTTPException(status_code=404, detail="Model not found")
    
    exp = db.query(Experiment).filter(Experiment.id == model_record.experiment_id).first()
    
    # Load model into memory dynamically
    try:
        loaded_model = load_mlflow_model(exp.run_id)
        deployed_models[req.name] = loaded_model
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    deployment = Deployment(name=req.name, model_id=model_id, endpoint=f"/api/v1/predict/{req.name}")
    db.add(deployment)
    db.commit()
    db.refresh(deployment)
    
    return {"success": True, "deployment": deployment}

@app.get("/api/v1/deployments")
def get_deployments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Deployment).all()

# Prediction
@app.post("/api/v1/predict/{deployment_name}")
def predict(deployment_name: str, req: PredictionRequest):
    if deployment_name not in deployed_models:
        raise HTTPException(status_code=404, detail="Deployment not found or model not loaded in memory")
    
    model = deployed_models[deployment_name]
    df = pd.DataFrame([req.features])
    
    prediction = model.predict(df)
    
    return {
        "prediction": prediction[0].item() if hasattr(prediction[0], 'item') else prediction[0],
        "deployment": deployment_name
    }
