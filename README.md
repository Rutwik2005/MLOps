# 🚀 Nexus MLOps Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MLflow](https://img.shields.io/badge/MLflow-0194E2?style=for-the-badge&logo=mlflow&logoColor=white)](https://mlflow.org/)
[![MinIO](https://img.shields.io/badge/MinIO-C72C48?style=for-the-badge&logo=minio&logoColor=white)](https://min.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python_3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

An enterprise-ready, end-to-end cloud-native MLOps platform designed to streamline and automate the entire machine learning lifecycle: from **dataset ingestion and storage (MinIO/S3)**, **experiment tracking & artifact logging (MLflow)**, **model registry & versioning**, to **zero-downtime containerized model deployment** and **interactive real-time REST inference**.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Service Topology & Endpoints](#-service-topology--endpoints)
- [Prerequisites](#-prerequisites)
- [Quick Start with Docker Compose](#-quick-start-with-docker-compose-recommended)
- [Manual Local Development Setup](#-manual-local-development-setup)
- [End-to-End User Workflow](#-end-to-end-user-workflow)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Project Directory Structure](#-project-directory-structure)
- [Troubleshooting & FAQ](#-troubleshooting--faq)
- [License](#-license)

---

## ✨ Key Features

- **🔐 Robust Authentication & Security**:
  - JWT-based authentication with bcrypt password hashing.
  - Automatic session synchronization and secure access token management.
- **📦 S3-Compatible Dataset Management**:
  - Direct dataset uploads stored safely in MinIO S3 object storage.
  - Relational metadata and version tracking persisted in PostgreSQL.
- **🔬 Automated ML Training & Experiment Tracking**:
  - Multi-algorithm support out of the box: **Random Forest**, **Logistic Regression**, and **XGBoost**.
  - Automated feature extraction, categorical dummy encoding, and schema preservation.
  - Full MLflow integration: automatic logging of metrics (accuracy), parameters, models, and artifacts.
- **🗃️ Centralized Model Registry**:
  - Transition top-performing experimental runs into registered models with semantic versioning.
- **🚀 Dynamic Model Deployment & Serving**:
  - Instantly deploy registered models as live REST inference endpoints.
  - Automatic memory caching and runtime model loading from MLflow.
- **🧠 Dynamic Inference & Schema Inspection**:
  - Automatic generation of dynamic input forms with dropdowns for categorical features and validation for numeric inputs.
  - Real-time JSON prediction API with automatic feature matrix alignment.
- **🎨 Sleek, Modern User Interface**:
  - Built with React 18, TypeScript, Tailwind CSS, and Lucide icons.
  - Dark & Light mode theme switching, toast alerts, and responsive metrics dashboard.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Layer"]
        UI["React + Vite Single Page Application\n(Port 5173)"]
    end

    subgraph Backend["API & Orchestration Layer"]
        API["FastAPI REST Server\n(Port 8000)"]
    end

    subgraph Storage["Storage & Metadata Layer"]
        DB[("PostgreSQL 15 Database\n(Port 5432)")]
        MINIO[("MinIO S3 Object Storage\n(Ports 9000 / 9001)")]
    end

    subgraph MLOps["ML Lifecycle & Serving Layer"]
        MLFLOW["MLflow Tracking & Registry Server\n(Port 5000)"]
        ENGINES["Scikit-Learn / XGBoost\nTraining & Inference Engine"]
    end

    UI -->|HTTP / REST API + JWT| API
    API -->|Metadata, Users, Deployments| DB
    API -->|Raw Datasets (.csv)| MINIO
    API -->|Runs, Metrics, Model Artifacts| MLFLOW
    MLFLOW -->|Backend Store| DB
    MLFLOW -->|Artifact Store (s3://mlflow-artifacts)| MINIO
    API -->|Execute Training / Load Models| ENGINES
```

---

## 🌐 Service Topology & Endpoints

When all services are running, access the various platform components via your browser:

| Service | Access URL | Default Credentials | Description |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | [`http://localhost:5173`](http://localhost:5173) | *Create an account on login page* | Full dashboard, dataset manager, experiment tracking & prediction playground |
| **Backend API (Swagger UI)** | [`http://localhost:8000/docs`](http://localhost:8000/docs) | N/A | Interactive OpenAPI documentation & testing |
| **MLflow Tracking Server** | [`http://localhost:5000`](http://localhost:5000) | N/A | Experiment visualization, parameters, metrics & model artifacts |
| **MinIO Web Console** | [`http://localhost:9001`](http://localhost:9001) | **User:** `admin`<br>**Pass:** `password` | MinIO S3 Object Storage bucket & browser |
| **MinIO S3 API** | `http://localhost:9000` | **Key:** `admin`<br>**Secret:** `password` | S3-compatible object storage API |
| **PostgreSQL Database** | `localhost:5432` | **User:** `mlops`<br>**Pass:** `mlops_password`<br>**DB:** `mlops_db` | Relational metadata store |

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:

- **Docker & Docker Compose** (Recommended): [Install Docker Desktop](https://www.docker.com/products/docker-desktop/) *(Includes Compose v2)*
- **Git**: [Download Git](https://git-scm.com/)
- *For manual setup:* **Python 3.11+** and **Node.js 18+ (with npm)**

---

## ⚡ Quick Start with Docker Compose (Recommended)

Docker Compose configures, provisions, and launches PostgreSQL, MinIO, MLflow, and the FastAPI Backend in containerized isolation.

### 1. Clone the Repository

```bash
git clone https://github.com/neelwankhade007-rgb/MLOps-Neel.git
cd MLOps-Neel
```

### 2. Start Infrastructure and Backend Services

```bash
docker-compose up -d --build
```
*(or using Docker Compose V2: `docker compose up -d --build`)*

### 3. Start Frontend Dashboard

Open a terminal in the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be live at: **[`http://localhost:5173`](http://localhost:5173)**

### 4. Verify Running Services

```bash
docker-compose ps
```

### 5. Managing Services & Logs

- **View Live Backend Logs**:
  ```bash
  docker-compose logs -f backend
  ```
- **Stop All Containers**:
  ```bash
  docker-compose down
  ```
- **Stop Containers and Wipe Volumes** *(clean reset)*:
  ```bash
  docker-compose down -v
  ```

---

## 🛠️ Manual Local Development Setup

If you wish to run backend and frontend services natively on your host machine:

### 1. Start Support Services (PostgreSQL + MinIO + MLflow)
You can run the supporting dependencies with Docker while running code locally:

```bash
docker-compose up -d db minio mlflow
```

### 2. Configure & Run Backend (FastAPI)

```bash
cd backend

# Create & activate Python virtual environment
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI with live reloading
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Configure & Run Frontend (React + Vite)

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```

---

## 🔄 End-to-End User Workflow

Follow this step-by-step path to test the entire lifecycle:

```text
1. Register & Login  ➔  2. Upload Dataset  ➔  3. Run Training  ➔  4. Register Model  ➔  5. Deploy Endpoint  ➔  6. Real-Time Inference
```

1. **Sign Up / Log In**:
   - Navigate to [`http://localhost:5173`](http://localhost:5173), switch to **"Need an account? Register"**, enter credentials, and sign in.
2. **Upload a Dataset**:
   - Go to the **Datasets** tab.
   - Upload any CSV (e.g., Titanic classification, Iris, Housing, or Churn dataset).
   - The dataset is saved to MinIO bucket `datasets` and cataloged in PostgreSQL.
3. **Train an ML Model**:
   - Go to the **Training & Experiments** tab.
   - Select your uploaded dataset, input the exact target column name (e.g., `Survived` or `target`), and select an algorithm (**Random Forest**, **XGBoost**, or **Logistic Regression**).
   - Click **"Launch Training Job"**.
   - Review the resulting accuracy and MLflow Run ID.
4. **Register the Best Model**:
   - Go to the **Model Registry** tab.
   - Select the winning experiment run and give it a model registry name (e.g., `titanic-classifier-v1`).
5. **Deploy the Model**:
   - Go to the **Deployments** tab.
   - Select your registered model and assign a deployment name (e.g., `titanic-prod`).
   - Click **"Deploy Model"**.
6. **Perform Real-Time Predictions**:
   - In the **Deployments** tab, choose your active deployment.
   - The UI automatically analyzes the model schema from MLflow and renders dynamic input fields (numerical inputs, dropdowns for categorical features).
   - Click **"Predict"** to view instant inference output.
   - Alternatively, query the REST API endpoint directly using cURL or Python!

---

## 🔌 API Reference

The FastAPI backend provides interactive OpenAPI documentation at [`http://localhost:8000/docs`](http://localhost:8000/docs).

### Core Endpoints

#### Authentication
- `POST /api/v1/auth/register` — Register a new platform user account.
- `POST /api/v1/auth/login` — Authenticate and receive a Bearer JWT access token.
- `GET /api/v1/auth/session` — Retrieve backend instance session ID.

#### Datasets
- `POST /api/v1/datasets` — Upload multipart CSV dataset file to MinIO.
- `GET /api/v1/datasets` — List all cataloged datasets.

#### Training & Experiments
- `POST /api/v1/training/jobs` — Trigger model training pipeline (`dataset_id`, `target_column`, `algorithm`).
- `GET /api/v1/experiments` — List experiment runs with logged accuracy & MLflow Run IDs.

#### Model Registry
- `POST /api/v1/models` — Register a model from a successful experiment run.
- `GET /api/v1/models` — List all registered models and versions.

#### Deployments & Inference
- `POST /api/v1/models/{model_id}/deploy` — Create a live deployment instance.
- `GET /api/v1/deployments` — List active model deployments.
- `GET /api/v1/deployments/{deployment_name}/schema` — Retrieve feature schema & categorical value sets.
- `POST /api/v1/predict/{deployment_name}` — Execute real-time prediction.

### Example Prediction Request via cURL

```bash
curl -X POST "http://localhost:8000/api/v1/predict/titanic-prod" \
     -H "Content-Type: application/json" \
     -d '{
       "features": {
         "Pclass": 3,
         "Sex": "female",
         "Age": 22,
         "SibSp": 1,
         "Parch": 0,
         "Fare": 7.25,
         "Embarked": "S"
       }
     }'
```

**Response:**
```json
{
  "prediction": "1",
  "deployment": "titanic-prod"
}
```

---

## ⚙️ Environment Variables

The backend accepts the following environment variables (configured with defaults in `docker-compose.yml`):

| Variable | Default (Docker) | Default (Local) | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://mlops:mlops_password@db:5432/mlops_db` | `postgresql://mlops:mlops_password@localhost:5432/mlops_db` | PostgreSQL connection string |
| `MINIO_ENDPOINT` | `minio:9000` | `localhost:9000` | MinIO S3 API host & port |
| `MINIO_ACCESS_KEY` | `admin` | `admin` | MinIO root access key |
| `MINIO_SECRET_KEY` | `password` | `password` | MinIO root secret key |
| `MLFLOW_TRACKING_URI` | `http://mlflow:5000` | `http://localhost:5000` | MLflow tracking server URI |
| `AWS_ACCESS_KEY_ID` | `admin` | `admin` | S3 client access key for MLflow artifacts |
| `AWS_SECRET_ACCESS_KEY`| `password` | `password` | S3 client secret key for MLflow artifacts |
| `MLFLOW_S3_ENDPOINT_URL`| `http://minio:9000` | `http://localhost:9000` | MinIO S3 endpoint for MLflow artifacts |

---

## 📁 Project Directory Structure

```text
MLOps-Neel/
├── backend/
│   ├── Dockerfile             # Backend container image definition
│   ├── main.py                # FastAPI routes, auth, schema parsing & prediction handlers
│   ├── ml_utils.py            # MinIO client, training pipelines (RF/LR/XGB), MLflow logging
│   ├── models.py              # SQLAlchemy ORM models & Pydantic request/response schemas
│   └── requirements.txt       # Python dependencies (FastAPI, MLflow, Scikit-learn, XGBoost, etc.)
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main React UI with Auth, Datasets, Training, Registry, Deployments
│   │   ├── main.tsx           # Application entry point
│   │   └── index.css          # Tailwind CSS styling and theme definitions
│   ├── package.json           # Frontend dependencies & scripts
│   ├── tsconfig.json          # TypeScript configuration
│   └── vite.config.ts         # Vite build configuration
├── docker-compose.yml         # Multi-service composition (PostgreSQL, MinIO, MLflow, Backend)
├── project-context.md         # Comprehensive architectural reference & specification
└── README.md                  # Project overview, setup guide, and documentation
```

---

## ❓ Troubleshooting & FAQ

<details>
<summary><b>1. MLflow fails to connect to MinIO or PostgreSQL on first startup</b></summary>

Docker Compose includes health checks to ensure PostgreSQL and MinIO are healthy before MLflow starts. If you experience startup ordering issues on a fresh machine, run:
```bash
docker-compose up -d db minio
# Wait 5 seconds, then:
docker-compose up -d
```
</details>

<details>
<summary><b>2. How do I reset the entire platform database and storage?</b></summary>

To wipe all data and start completely fresh:
```bash
docker-compose down -v
docker-compose up -d --build
```
</details>

<details>
<summary><b>3. Why are categorical feature options automatically populated in the UI?</b></summary>

During training, `ml_utils.py` saves an `explicit_schema.json` artifact to MLflow containing detected column types and unique categorical categories. When viewing a deployment, the frontend queries `/api/v1/deployments/{name}/schema` to render exact form controls dynamically.
</details>

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
