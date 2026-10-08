# 🚀 Nexus MLOps Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MLflow](https://img.shields.io/badge/MLflow-0194E2?style=for-the-badge&logo=mlflow&logoColor=white)](https://mlflow.org/)
[![MinIO](https://img.shields.io/badge/MinIO-C72C48?style=for-the-badge&logo=minio&logoColor=white)](https://min.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Python](https://img.shields.io/badge/Python_3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

Nexus MLOps is an end-to-end machine learning operations platform built as a B.Tech CSE major project to manage the core ML lifecycle. It provides an integrated system for **CSV dataset ingestion & MinIO object storage**, **tabular model training & MLflow experiment tracking**, **application model registry cataloging**, **in-memory model serving via FastAPI**, and **schema-driven real-time REST inference**, supporting deployment with both **Docker Compose** and **Kubernetes (Minikube)**.

---

## 📑 Table of Contents

- [Core Implemented Workflow](#-core-implemented-workflow)
- [System Architecture](#-system-architecture)
- [Implemented Features & Capabilities](#-implemented-features--capabilities)
  - [Authentication & Session Handling](#-authentication--session-handling)
  - [Dataset Management & Training Pipeline](#-dataset-management--training-pipeline)
  - [Model Registry & Serving Architecture](#-model-registry--serving-architecture)
  - [Dynamic Prediction & Schema Alignment](#-dynamic-prediction--schema-alignment)
- [Service Topology & Endpoints](#-service-topology--endpoints)
- [Deployment: Docker Compose](#-deployment-docker-compose)
- [Deployment: Kubernetes (Minikube)](#-deployment-kubernetes-minikube)
- [Manual Local Development](#-manual-local-development)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Project Directory Structure](#-project-directory-structure)
- [Current Limitations & Future Work](#-current-limitations--future-work)
- [Troubleshooting & FAQ](#-troubleshooting--faq)
- [License](#-license)

---

## 🔄 Core Implemented Workflow

The platform connects each phase of the machine learning lifecycle through a structured pipeline:

```text
Register / Login
  └──> Upload CSV Dataset (MinIO S3 storage + PostgreSQL metadata)
        └──> Select Target Column + Training Algorithm (Logistic Regression / Random Forest / XGBoost)
              └──> Train Model & Track Experiment (MLflow parameters, accuracy, model artifact, explicit schema)
                    └──> Register Model in Catalog (PostgreSQL model record linked to experiment run)
                          └──> Deploy Model (Load MLflow artifact into FastAPI serving memory)
                                └──> Retrieve Deployment Schema (/schema endpoint)
                                      └──> Dynamic UI Form / REST API Prediction (/predict/{name})
```

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Client & Presentation Layer"]
        UI["React 19 + TypeScript + Vite SPA\n(Served via Nginx on Port 80 / Dev Port 5173)"]
    end

    subgraph Backend["API & Serving Layer"]
        API["FastAPI Backend Server\n(Port 8000)\nIn-memory Deployed Model Registry"]
    end

    subgraph Storage["Storage & Metadata Layer"]
        DB[("PostgreSQL 15 Database\n(Port 5432)\nUsers, Datasets, Experiments, Models, Deployments")]
        MINIO[("MinIO Object Storage (S3 API: 9000 / Console: 9001)\nBuckets: datasets, mlflow-artifacts")]
    end

    subgraph MLOps["Tracking & Engine Layer"]
        MLFLOW["MLflow Tracking Server (Port 5000)\nArtifacts logged to s3://mlflow-artifacts"]
        ENGINES["Scikit-Learn & XGBoost\nModel Training & PyFunc Inference Runtime"]
    end

    UI -->|HTTP REST + Bearer JWT| API
    API -->|App Metadata & Tables| DB
    API -->|Multipart CSV Uploads| MINIO
    API -->|Run Metrics & Schema Artifacts| MLFLOW
    MLFLOW -->|Backend Store URI| DB
    MLFLOW -->|Default Artifact Root (S3)| MINIO
    API -->|Load MLflow Model on Deploy/Predict| ENGINES
```

---

## ✨ Implemented Features & Capabilities

### 🔐 Authentication & Session Handling
- **JWT Authentication**: User login generates standard Bearer JSON Web Tokens signed with HMAC-SHA256 (`HS256`).
- **Password Security**: Passwords are saved with salted `bcrypt` hashes via PassLib.
- **Route Protection**: FastAPI dependencies (`get_current_user`) validate JWT signatures and database user existence on protected routes.
- **Instance Session Invalidation**: The backend process generates a unique `BACKEND_SESSION_ID` (UUID) upon startup. The frontend checks `/api/v1/auth/session` on load; if the backend process has restarted, outdated client sessions are automatically invalidated to prevent stale in-memory state.
- *Note:* Refresh tokens, third-party OAuth providers, and Redis session stores are intentionally omitted in this implementation.

### 📊 Dataset Management & Training Pipeline
- **Dataset Storage**: CSV files uploaded via multipart form data are stored directly in the MinIO `datasets` S3 bucket with timestamp prefixes to prevent collisions.
- **Metadata Cataloging**: Dataset name, description, object storage path, and upload timestamp are persisted in PostgreSQL (`app_datasets` table).
- **Supported Algorithms**:
  - **Logistic Regression** (`sklearn.linear_model.LogisticRegression`, `max_iter=1000`)
  - **Random Forest** (`sklearn.ensemble.RandomForestClassifier`)
  - **XGBoost** (`xgboost.XGBClassifier`, `eval_metric="logloss"`)
- **Automated Preprocessing**:
  - Rows with missing values (`NaN`) are dropped during training.
  - Common non-predictive identifier columns (e.g. `id`, `index`, `uuid`, `*_id`, or high-cardinality unique text strings) are automatically dropped from feature matrices.
  - Categorical columns are converted into dummy variables (`pd.get_dummies`) with full one-hot encoded column lists recorded.
- **Experiment Tracking**: Training runs are executed under the `MVP_Experiment` experiment in MLflow. Accuracy metrics, algorithm parameters, trained model artifacts, and an `explicit_schema.json` dictionary are logged to MLflow under the run.

### 🗃️ Model Registry & Serving Architecture
- **Application Model Registry**: The platform maintains an application-level model catalog in PostgreSQL (`app_registered_models` table) linking a chosen model name and version tag to the corresponding MLflow `run_id`.
  *(Note: This is an application-level registry and does not use the complete MLflow Model Registry backend or enterprise stage transitions).*
- **In-Memory Serving Layer**: When a model is deployed via `POST /api/v1/models/{model_id}/deploy`:
  - A record is created in the `deployments` table with `status="active"`.
  - The trained MLflow model artifact is loaded into the FastAPI backend's in-memory serving dictionary (`deployed_models[deployment_name]`) using `mlflow.pyfunc.load_model`.
  - On backend startup, existing active deployments recorded in the database are automatically loaded into memory.
  - Deployments share the FastAPI backend runtime rather than spawning dedicated individual Kubernetes pods or containers per model.

### 🧠 Dynamic Prediction & Schema Alignment
- **Explicit Schema Generation**: During training, an `explicit_schema.json` artifact is saved with:
  - `target_column`: Name of the target variable.
  - `features`: Array of original features with name, inferred data type (`number`, `categorical`, `boolean`, `string`), requirement status, and unique options list for categoricals.
  - `encoded_columns`: The exact one-hot encoded column headers expected by the model.
- **Dynamic Form Generation**: The frontend queries `GET /api/v1/deployments/{deployment_name}/schema` and dynamically builds the form:
  - Categorical features display dropdown selectors populated with unique observed values.
  - Numeric features render validated numeric inputs.
- **Robust Inference Execution**: When receiving a prediction payload:
  - Input features are validated against required fields and categorical options.
  - Inputs are one-hot encoded and aligned (`reindex(columns=encoded_columns, fill_value=0)`) against the training matrix to prevent shape mismatches.
  - Predictions are returned via JSON response with the deployment name.

---

## 🌐 Service Topology & Endpoints

| Component | Port | In-Cluster / Compose Host | External / Local URL | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Web App** | `80` (container)<br>`5173` (dev) | `frontend:80` | `http://localhost:5173` *(Compose/Dev)*<br>Ingress / NodePort *(K8s)* | React 19 SPA dashboard & prediction interface |
| **Backend REST API** | `8000` | `backend:8000` | `http://localhost:8000` | FastAPI server & Swagger UI (`/docs`) |
| **MLflow Server** | `5000` | `mlflow:5000` | `http://localhost:5000` | Experiment runs, metrics, parameters, and artifact browser |
| **MinIO S3 API** | `9000` | `minio:9000` | `http://localhost:9000` | S3 API endpoint for dataset & artifact storage |
| **MinIO Console** | `9001` | `minio:9001` | `http://localhost:9001` | Web UI for bucket inspection (`admin` / `password`) |
| **PostgreSQL DB** | `5432` | `db:5432` | `localhost:5432` | Database store (`mlops` / `mlops_password` / `mlops_db`) |

---

## 🐳 Deployment: Docker Compose

Docker Compose provisions the entire environment using `compose.yml`. In this environment, the production frontend is built via a multi-stage Dockerfile and served using Nginx, proxying API requests to the backend.

### 1. Launch Services

```bash
docker compose up -d --build
```

### 2. Verify Container Health

```bash
docker compose ps
```

### 3. Service Access

- **Frontend Dashboard:** [`http://localhost:5173`](http://localhost:5173)
- **FastAPI OpenAPI Docs:** [`http://localhost:8000/docs`](http://localhost:8000/docs)
- **MLflow UI:** [`http://localhost:5000`](http://localhost:5000)
- **MinIO Console:** [`http://localhost:9001`](http://localhost:9001)

### 4. Stop Services

```bash
# Stop containers while preserving volume data
docker compose down

# Stop containers and wipe volumes (complete clean reset)
docker compose down -v
```

---

## ☸️ Deployment: Kubernetes (Minikube)

The project includes Kubernetes manifests designed and verified on a local **Minikube** environment (Windows + Docker driver).

### Manifest Organization
The Kubernetes manifests are separated into dedicated directories:
- `kubernetes/config/`: Namespace, ConfigMaps, and Secrets.
- `kubernetes/volumes/`: PersistentVolumeClaims for PostgreSQL and MinIO storage.
- `kubernetes/workloads/`: StatefulSets (DB, MinIO) and Deployments (MLflow, Backend, Frontend).
- `kubernetes/networking/`: Ingress routing configuration.

### 1. Start Minikube & Enable Ingress

Start Minikube:

```bash
minikube start
```

If Ingress is part of the documented cluster setup, you can enable the ingress addon:

```bash
minikube addons enable ingress
```

*Note: While Ingress is deployed, the application is currently accessed through `kubectl port-forward`, not through the Ingress URL.*

### 2. Build Container Images & Load into Minikube

*(Note: Custom images only need to be rebuilt and loaded when the application code has changed or the images are missing from Minikube. You do not need to do this on every restart.)*

Build the custom images locally and load them into Minikube's image cache:

```bash
# Build custom backend and frontend images
docker build -t mlops-backend:latest ./backend
docker build -t mlops-frontend:latest ./frontend
docker build -t mlops-mlflow:latest ./mlflow

# Load images into the Minikube cluster
minikube image load mlops-backend:latest
minikube image load mlops-frontend:latest
minikube image load mlops-mlflow:latest
```

### 3. Apply Configuration

```bash
kubectl apply -f kubernetes/config/
```

### 4. Apply Persistent Volume Claims

```bash
kubectl apply -f kubernetes/volumes/
```

### 5. Apply Workloads

Apply the workloads in this verified startup sequence:

```bash
kubectl apply -f kubernetes/workloads/01-db.yaml
kubectl apply -f kubernetes/workloads/02-minio.yaml
kubectl apply -f kubernetes/workloads/03-mlflow.yaml
kubectl apply -f kubernetes/workloads/04-backend.yaml
kubectl apply -f kubernetes/workloads/05-frontend.yaml
```

### 6. Apply Networking

```bash
kubectl apply -f kubernetes/networking/01-ingress.yaml
```

### 7. Verify Cluster Resources

```bash
kubectl get pods -n mlops
kubectl get services -n mlops
kubectl get pvc -n mlops
kubectl get ingress -n mlops
```

Expected pod state:

```text
backend    1/1 Running
db         1/1 Running
frontend   1/1 Running
minio      1/1 Running
mlflow     1/1 Running
```

Expected PVC state:

```text
db-pvc       Bound
minio-pvc    Bound
```

### 8. Access the Application

The preferred and verified local access method for the current Windows + Docker-driver Minikube environment is port forwarding:

```bash
kubectl port-forward -n mlops service/frontend 8080:80
```

Then access the application at:

[http://localhost:8080](http://localhost:8080)

**Important Access Details:**
- Keep the port-forward terminal open while using the application.
- Pressing `Ctrl+C` stops the port-forward only; it does not delete your Kubernetes deployment.
- This is the preferred local access method for the current Windows + Docker-driver Minikube environment.
- Do NOT rely on `minikube service frontend --url` as the primary access method.
- Do NOT use `minikube tunnel` as the normal application access method.

### Restarting the Existing Cluster

If you have stopped Minikube and want to resume working on the existing cluster and `mlops` resources, you do NOT need to recreate the namespace, PVCs, deployments, or rebuild images. Simply start it back up:

```bash
minikube start
kubectl get pods -n mlops
kubectl port-forward -n mlops service/frontend 8080:80
```

### Recreating the Kubernetes Stack

If you check `kubectl get pods -n mlops` and see:

```text
No resources found in mlops namespace.
```

In that case, recreate the stack:

```bash
kubectl apply -f kubernetes/config/
kubectl apply -f kubernetes/volumes/

kubectl apply -f kubernetes/workloads/01-db.yaml
kubectl apply -f kubernetes/workloads/02-minio.yaml
kubectl apply -f kubernetes/workloads/03-mlflow.yaml
kubectl apply -f kubernetes/workloads/04-backend.yaml
kubectl apply -f kubernetes/workloads/05-frontend.yaml

kubectl apply -f kubernetes/networking/01-ingress.yaml
```

Then verify:

```bash
kubectl get pods -n mlops
kubectl get pvc -n mlops
```

Then access using:

```bash
kubectl port-forward -n mlops service/frontend 8080:80
```

### Stopping Minikube

When you are done working, you can safely stop Minikube. This preserves your cluster state (deployments, volumes, etc.) for next time:

```bash
minikube stop
```

### Complete Cluster Cleanup (Optional)

If you want to completely destroy the Minikube cluster and remove all data (including the database and uploaded datasets) to start fresh:

```bash
# Delete the minikube cluster entirely
minikube delete --all
```
*Note: Only run this if you want to wipe everything and start from a fresh installation.*

---

## 🛠️ Manual Local Development

If you wish to develop without containerizing the frontend or backend:

### 1. Start Supporting Services

```bash
docker compose up -d db minio mlflow
```

### 2. Run Backend (FastAPI)

```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Run Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The frontend development server runs at `http://localhost:5173`.

---

## 🔌 API Reference

Interactive OpenAPI documentation is available at `http://localhost:8000/docs`.

### Authentication
- `POST /api/v1/auth/register` — Register a new account (`{ username, password }`).
- `POST /api/v1/auth/login` — Authenticate with form data and receive `{ access_token, token_type, backend_session_id }`.
- `GET /api/v1/auth/session` — Retrieve the current backend instance session ID (`{ session_id }`).

### Datasets
- `POST /api/v1/datasets` — Upload multipart CSV file with `name` and `description` Form fields.
- `GET /api/v1/datasets` — List all stored datasets.

### Training & Experiments
- `POST /api/v1/training/jobs` — Train a model (`{ dataset_id, target_column, algorithm }`).
- `GET /api/v1/experiments` — List trained experiments with accuracy and MLflow Run IDs.

### Model Registry
- `POST /api/v1/models` — Register an experiment as a named model (`{ experiment_id, name }`).
- `GET /api/v1/models` — List all registered models in the catalog.

### Deployments & Predictions
- `POST /api/v1/models/{model_id}/deploy` — Deploy model to memory (`{ model_id, name }`).
- `GET /api/v1/deployments` — List active deployments with endpoint and status.
- `GET /api/v1/deployments/{deployment_name}/schema` — Retrieve feature schema and categorical options.
- `POST /api/v1/predict/{deployment_name}` — Execute inference (`{ features: { ... } }`).

### Example Inference via cURL

```bash
curl -X POST "http://localhost:8000/api/v1/predict/house-api-test" \
     -H "Content-Type: application/json" \
     -d '{
       "features": {
         "MedInc": 3.5,
         "HouseAge": 25.0,
         "AveRooms": 5.2,
         "AveBedrms": 1.1,
         "Population": 1200.0,
         "AveOccup": 3.0,
         "Latitude": 37.8,
         "Longitude": -122.2
       }
     }'
```

Response:
```json
{
  "prediction": "1",
  "deployment": "house-api-test"
}
```

---

## ⚙️ Environment Variables

Configured in `compose.yml` and Kubernetes ConfigMap/Secret manifests:

| Variable | Default (Docker Compose) | Default (Local) | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://mlops:mlops_password@db:5432/mlops_db` | `postgresql://mlops:mlops_password@localhost:5432/mlops_db` | PostgreSQL connection string |
| `MINIO_ENDPOINT` | `minio:9000` | `localhost:9000` | MinIO S3 API host & port |
| `MINIO_ACCESS_KEY` | `admin` | `admin` | MinIO root access key |
| `MINIO_SECRET_KEY` | `password` | `password` | MinIO root secret key |
| `MLFLOW_TRACKING_URI` | `http://mlflow:5000` | `http://localhost:5000` | MLflow tracking server URI |
| `AWS_ACCESS_KEY_ID` | `admin` | `admin` | S3 client access key for MLflow artifacts |
| `AWS_SECRET_ACCESS_KEY` | `password` | `password` | S3 client secret key for MLflow artifacts |
| `MLFLOW_S3_ENDPOINT_URL` | `http://minio:9000` | `http://localhost:9000` | S3 endpoint URL for MLflow artifact store |
| `MLFLOW_S3_IGNORE_TLS` | `"true"` | `"true"` | Ignore TLS checks for MinIO connection |

---

## 📁 Project Directory Structure

```text
MLOps-Neel/
├── backend/
│   ├── Dockerfile                 # Backend container image definition (Python 3.11-slim)
│   ├── main.py                    # FastAPI application, auth routes, training & inference endpoints
│   ├── ml_utils.py                # Preprocessing, model training (LR/RF/XGB), and MLflow artifact logging
│   ├── models.py                  # SQLAlchemy models (User, Dataset, Experiment, Model, Deployment)
│   └── requirements.txt           # Python dependencies (FastAPI, Scikit-learn, XGBoost, MLflow, etc.)
├── frontend/
│   ├── Dockerfile                 # Multi-stage production container build (Node.js -> Nginx)
│   ├── nginx.conf                 # Nginx reverse proxy configuration for SPA routing & /api/v1/ proxying
│   ├── package.json               # Frontend dependencies (React 19, TypeScript, Lucide, Tailwind)
│   ├── tsconfig.json              # TypeScript compilation configuration
│   ├── vite.config.ts             # Vite build & plugin configuration
│   └── src/
│       ├── api/                   # Modular API client services (auth, dataset, training, model, deployment)
│       ├── components/            # Reusable UI components organized by domain:
│       │   ├── common/            # Shared UI (Button, Card, Input, Loading, Navbar)
│       │   ├── datasets/          # Dataset upload & catalog views
│       │   ├── layout/            # Layout wrappers and theme switcher
│       │   ├── prediction/        # Prediction form, selector, and inference history
│       │   ├── registry/          # Model registry and deployment cards
│       │   └── training/          # Training job trigger & experiment history
│       ├── context/               # Global state contexts (AuthContext, ThemeContext)
│       ├── hooks/                 # Custom React hooks (useAuth, useDatasets, useModels, usePrediction, etc.)
│       ├── pages/                 # Route page components:
│       │   ├── DashboardPage.tsx  # Overview metrics & quick action navigation
│       │   ├── DatasetsPage.tsx   # Dataset management
│       │   ├── LoginPage.tsx      # Sign in / registration interface
│       │   ├── PredictPage.tsx    # Interactive model inference playground
│       │   ├── RegistryPage.tsx   # Model cataloging & deployment creation
│       │   └── TrainingPage.tsx   # Training pipeline execution
│       ├── types/                 # Shared TypeScript interfaces for models, datasets, and predictions
│       ├── utils/                 # Helpers (JWT parsing, date formatting, badge styles)
│       ├── App.tsx                # Client-side router configuration (React Router v7)
│       ├── index.css              # Design tokens and Tailwind utility styles
│       └── main.tsx               # Application bootstrap mount point
├── kubernetes/
│   ├── config/
│   │   ├── 00-namespace.yaml      # Dedicated 'mlops' namespace
│   │   ├── 01-configmap.yaml      # Shared service endpoints and environment configuration
│   │   └── 02-secret.yaml         # Database and storage credentials
│   ├── networking/
│   │   └── 01-ingress.yaml        # Nginx ingress routing for frontend access
│   ├── volumes/
│   │   ├── 01-db-pvc.yaml         # Persistent storage for PostgreSQL data
│   │   └── 02-minio-pvc.yaml      # Persistent storage for MinIO datasets & artifacts
│   └── workloads/
│       ├── 01-db.yaml             # PostgreSQL StatefulSet & ClusterIP service
│       ├── 02-minio.yaml          # MinIO StatefulSet & API/Console services
│       ├── 03-mlflow.yaml         # MLflow Tracking Deployment & ClusterIP service
│       ├── 04-backend.yaml        # FastAPI Backend Deployment with init-containers
│       └── 05-frontend.yaml       # React/Nginx Frontend Deployment & Service
├── mlflow/
│   └── Dockerfile                 # Custom MLflow server image with psycopg2-binary & boto3
├── compose.yml                    # Docker Compose orchestrating all services
├── project-context.md             # High-level architecture specification
└── README.md                      # Project documentation and operational guide
```

---

## ⚠️ Current Limitations & Future Work

As an academic project focused on core architecture and lifecycle integration, several production-grade enterprise features are explicitly out of scope for the current version:

- **Dataset Versioning & Validation**: Datasets are stored with timestamp keys in MinIO; deep dataset versioning (e.g., DVC), Great Expectations data validation, and automated profiling are not yet integrated.
- **Model-per-Container Deployment**: Models are dynamically loaded into the FastAPI backend's in-memory runtime. Dedicated Kubernetes Deployments/Pods per individual model, autoscaling (HPA), and specialized model serving runtimes (e.g., Triton, TorchServe, KServe) are not yet implemented.
- **Advanced Model Lifecycle Management**: Model promotion through formal stages (Staging -> Production -> Archived) and automated model comparison boards are planned for future iterations.
- **Drift Detection & Observability**: Real-time feature drift detection (e.g., Evidently AI), inference logging pipelines, and automated Prometheus/Grafana metric scrapers for model performance are not currently active.
- **Automated Retraining**: Pipeline retraining triggers based on schedule or performance degradation are not yet implemented.
- **CI/CD Automation**: Automated testing, linting, and Kubernetes continuous deployment pipelines via GitHub Actions remain future roadmap goals.

---

## ❓ Troubleshooting & FAQ

<details>
<summary><b>1. How does the frontend communicate with the backend in Docker Compose vs. Kubernetes?</b></summary>

In Docker Compose and local development, the frontend makes API requests to `http://localhost:8000/api/v1`. In Kubernetes, the frontend container runs Nginx which acts as a reverse proxy, routing `/api/v1/` requests directly to `http://backend:8000/api/v1/` within the cluster network.
</details>

<details>
<summary><b>2. Why are categorical feature options dynamically populated in the prediction form?</b></summary>

During training, `ml_utils.py` inspects the training DataFrame, extracts unique values for categorical features, and saves them to `explicit_schema.json` in MLflow. When a user selects a deployment on the prediction page, the frontend calls `/api/v1/deployments/{name}/schema` to render exact dropdown options rather than generic text boxes.
</details>

<details>
<summary><b>3. Why did my session expire after restarting the backend?</b></summary>

The backend assigns a new `BACKEND_SESSION_ID` (UUID) upon each process start. When the frontend detects a session ID mismatch via `/api/v1/auth/session`, it prompts the user to re-login. This prevents client state inconsistencies against an in-memory runtime that has just been reloaded.
</details>

<details>
<summary><b>4. How to completely reset all storage and database state in Docker Compose?</b></summary>

```bash
docker compose down -v
docker compose up -d --build
```
</details>

<details>
<summary><b>5. Why does minikube service frontend --url give ERR_CONNECTION_REFUSED?</b></summary>

On Windows with the Docker driver, the Minikube service URL is a temporary tunnel and depends on the associated terminal process. The current verified and recommended method is:

```bash
kubectl port-forward -n mlops service/frontend 8080:80
```

Then access:

[http://localhost:8080](http://localhost:8080)
</details>

<details>
<summary><b>6. All pods are Running, but I cannot open the frontend.</b></summary>

Verify your pod status:

```bash
kubectl get pods -n mlops
```

Then use port forwarding to access the frontend:

```bash
kubectl port-forward -n mlops service/frontend 8080:80
```

Make sure to keep the port-forward terminal open while accessing the application.
</details>

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
