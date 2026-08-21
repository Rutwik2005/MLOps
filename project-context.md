# Project Context

## 1. Overview

- **Project Name:** Cloud-Native MLOps Platform for Automated Machine Learning Lifecycle Management
- **Description:** A cloud-native platform that automates the machine learning lifecycle from dataset management and experiment tracking to model versioning, containerized deployment, inference, monitoring, and rollback/retraining. The project focuses on implementation and practical integration of ML, backend engineering, DevOps, and cloud-native technologies rather than developing new ML algorithms.
- **Target Architecture:** Microservices-based cloud-native architecture with independently deployable services, containerization using Docker, and orchestration using Kubernetes.

### Core Project Workflow

User
→ Authentication
→ Dataset Upload & Versioning
→ Data Validation
→ Model Training
→ Experiment Tracking
→ Model Registry
→ Model Selection
→ Docker Packaging
→ Kubernetes Deployment
→ REST Inference API
→ Monitoring & Logging
→ Drift/Performance Detection
→ Notification
→ Rollback / Retraining

The platform is designed primarily for supervised machine learning models and is intended to demonstrate an industry-inspired MLOps workflow using free/open-source technologies.

---

## 2. Tech Stack

### Language & Runtime

- **Backend:** Python 3.11+
- **Frontend:** JavaScript / TypeScript
- **ML:** Python
- **Containerization:** Docker
- **Orchestration:** Kubernetes

### Frameworks & Technologies

- **Backend Framework:** FastAPI
- **Frontend Framework:** React.js
- **Machine Learning:** Scikit-learn, XGBoost, and optionally LightGBM
- **Experiment Tracking:** MLflow
- **Model Registry:** MLflow Model Registry
- **API Gateway:** Nginx or a dedicated gateway service
- **Monitoring:** Prometheus
- **Visualization:** Grafana
- **Logging:** Loki + Promtail
- **CI/CD:** GitHub Actions
- **Authentication:** JWT
- **Object Storage:** MinIO Community Edition
- **Container Orchestration:** Kubernetes using Minikube or Kind for local development

### Database & Storage

- **Primary Database:** PostgreSQL
- **ORM / Database Access:** SQLAlchemy
- **Object Storage:** MinIO
- **ML Artifacts:** MinIO
- **Experiment Metadata:** MLflow + PostgreSQL
- **Model Artifacts:** MinIO

### Build / Dependency Tools

- **Python Dependency Management:** pip + requirements.txt
- **Frontend Build Tool:** npm
- **Container Build:** Docker
- **Infrastructure Configuration:** Kubernetes YAML manifests

---

## 3. Project Structure

The project uses a microservices architecture. Each service should have its own source code, dependencies, Dockerfile, configuration, and tests.

```text
mlops-platform/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── services/
│   │
│   ├── auth-service/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   ├── schemas/
│   │   │   ├── core/
│   │   │   └── utils/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── dataset-service/
│   ├── training-service/
│   ├── experiment-service/
│   ├── model-registry-service/
│   ├── deployment-service/
│   ├── inference-service/
│   ├── monitoring-service/
│   └── notification-service/
│
├── ml/
│   ├── preprocessing/
│   ├── training/
│   ├── evaluation/
│   └── models/
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   ├── prometheus/
│   ├── grafana/
│   ├── mlflow/
│   └── minio/
│
├── scripts/
│
├── docs/
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── README.md
└── project-context.md
```

### Service Responsibilities

* `auth-service/` - Authentication, JWT generation, user roles, and authorization.
* `dataset-service/` - Dataset upload, validation, metadata, and dataset versioning.
* `training-service/` - Executes ML training pipelines and preprocessing.
* `experiment-service/` - Manages experiment-related operations and integrates with MLflow.
* `model-registry-service/` - Handles model versions and model lifecycle stages.
* `deployment-service/` - Packages models, creates/deploys containers, and manages Kubernetes deployments.
* `inference-service/` - Provides REST APIs for real-time model predictions.
* `monitoring-service/` - Collects and exposes application/model metrics.
* `notification-service/` - Sends alerts for failures, degradation, drift, and deployment events.

---

## 4. Coding Conventions & Patterns

### Naming

* Python variables/functions: `snake_case`
* Python classes: `PascalCase`
* JavaScript/TypeScript variables/functions: `camelCase`
* React components: `PascalCase`
* Constants: `UPPER_SNAKE_CASE`
* Database tables: `snake_case`
* Database columns: `snake_case`
* API routes: lowercase kebab-case or resource-based REST naming
* Environment variables: `UPPER_SNAKE_CASE`

Examples:

```text
UserService
create_dataset()
dataset_id
MODEL_REGISTRY_URL
```

### Design Patterns

Use patterns where they genuinely improve maintainability.

Preferred patterns:

* Repository Pattern
* Service Layer Pattern
* DTO / Pydantic Schema Pattern
* Dependency Injection
* Factory Pattern where multiple ML algorithms/models need to be selected dynamically
* Strategy Pattern for interchangeable ML training strategies
* Adapter Pattern for external infrastructure integrations
* API Gateway Pattern
* Microservices Architecture

Do not introduce design patterns merely for academic terminology. Prefer simple, maintainable implementations.

### Separation of Concerns

Controllers/API routes should handle HTTP concerns.

Services should contain business logic.

Repositories should handle database access.

Models/entities should represent persistence/domain data.

External integrations should be isolated from business logic.

---

## 5. API & Database Standards

### API Style

* REST API
* JSON request/response format
* HTTP status codes must be used correctly.
* APIs should be versioned where appropriate.

Example:

```text
POST   /api/v1/auth/login
POST   /api/v1/datasets
GET    /api/v1/datasets
GET    /api/v1/datasets/{dataset_id}
POST   /api/v1/training/jobs
GET    /api/v1/models
POST   /api/v1/models/{model_id}/deploy
POST   /api/v1/predictions
GET    /api/v1/deployments
```

### Response Structure

Use a consistent response format.

Successful response:

```json
{
  "success": true,
  "message": "Dataset uploaded successfully",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Dataset validation failed",
  "error": {
    "code": "DATASET_VALIDATION_ERROR",
    "details": []
  }
}
```

Do not expose internal stack traces or sensitive infrastructure details through API responses.

### Authentication

* JWT-based authentication
* Passwords must never be stored in plain text.
* Use secure password hashing such as bcrypt/Argon2.
* Role-based access control.

Initial roles:

```text
ADMIN
ML_ENGINEER
VIEWER
```

Example permissions:

```text
ADMIN
  → Full platform access

ML_ENGINEER
  → Upload datasets
  → Run training
  → Manage experiments
  → Register models
  → Deploy models

VIEWER
  → View datasets
  → View experiments
  → View models
  → View monitoring dashboards
```

### Multi-Tenancy

Multi-tenancy is **not part of the initial MVP**.

Do not introduce tenant isolation unless explicitly requested later.

The initial architecture assumes a single organizational deployment with multiple users and role-based access control.

---

## Database Design

PostgreSQL is used for structured metadata.

Core entities include:

```text
users
roles
datasets
dataset_versions
training_jobs
experiments
models
model_versions
deployments
predictions
audit_logs
notifications
```

Large files should NOT be stored directly in PostgreSQL.

Use:

```text
PostgreSQL
→ metadata

MinIO
→ datasets
→ trained model files
→ MLflow artifacts
→ other large objects
```

---

## 6. Testing Guidelines

### Backend Testing

* **Framework:** pytest
* **API Testing:** FastAPI TestClient / HTTPX
* **Mocking:** pytest-mock / unittest.mock

### Frontend Testing

* **Framework:** Vitest / Jest
* **Component Testing:** React Testing Library

### Testing Structure

Use the Arrange-Act-Assert (AAA) pattern.

```text
Arrange
→ Prepare test data and dependencies

Act
→ Execute the function/API

Assert
→ Verify expected result
```

### Testing Levels

#### Unit Tests

Focus primarily on:

* Service-layer business logic
* Validation
* Dataset processing
* Model selection
* Deployment logic
* Authentication logic

#### Integration Tests

Test:

* API + database
* API + MinIO
* Training service + MLflow
* Model registry + deployment service

#### End-to-End Tests

Test the complete workflow:

```text
Login
→ Upload Dataset
→ Start Training
→ Track Experiment
→ Register Model
→ Deploy Model
→ Make Prediction
→ Monitor Deployment
```

### Coverage Target

Target:

* **80%+ coverage for critical business logic**
* High coverage for authentication, dataset management, model registry, and deployment logic.

Do not sacrifice meaningful tests merely to increase the coverage percentage.

---

## 7. Commands & Local Setup

### Prerequisites

Install:

```text
Python 3.11+
Node.js 20+
Docker Desktop
Git
kubectl
Minikube OR Kind
```

### Clone Repository

```bash
git clone <repository-url>
cd mlops-platform
```

### Backend Setup

```bash
cd services/<service-name>

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt
```

### Run FastAPI Service

```bash
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

### Run Tests

```bash
pytest
```

### Docker Build

```bash
docker build -t mlops/<service-name>:latest .
```

### Docker Compose

For local infrastructure:

```bash
docker compose up -d
```

Stop:

```bash
docker compose down
```

### Kubernetes

Start local cluster:

```bash
minikube start
```

Apply manifests:

```bash
kubectl apply -f infrastructure/kubernetes/
```

Check deployments:

```bash
kubectl get deployments
```

Check pods:

```bash
kubectl get pods
```

Check services:

```bash
kubectl get services
```

### PostgreSQL Migrations

Database migrations should use **Alembic**.

Create migration:

```bash
alembic revision --autogenerate -m "description"
```

Apply migrations:

```bash
alembic upgrade head
```

Rollback:

```bash
alembic downgrade -1
```

---

# 8. Infrastructure Architecture

The project should remain completely free and open-source for development and demonstration.

### Primary Infrastructure

```text
Docker
Kubernetes
PostgreSQL
MinIO
MLflow
Prometheus
Grafana
Loki
```

### Object Storage

Use **MinIO Community Edition** as the primary object storage.

Do not introduce Amazon S3 unless specifically required.

MinIO provides an S3-compatible object-storage interface while allowing the entire project to run locally.

### Kubernetes

Development environment:

```text
Minikube
```

Alternative:

```text
Kind
```

The project should not depend on a paid cloud provider for its core functionality.

---

# 9. MLOps Workflow

The core workflow is:

```text
1. User Login
       ↓
2. Dataset Upload
       ↓
3. Dataset Validation
       ↓
4. Dataset Version Creation
       ↓
5. Training Job
       ↓
6. Experiment Tracking
       ↓
7. Model Evaluation
       ↓
8. Model Registration
       ↓
9. Model Version Selection
       ↓
10. Docker Packaging
       ↓
11. Kubernetes Deployment
       ↓
12. REST Prediction API
       ↓
13. Monitoring
       ↓
14. Drift / Performance Detection
       ↓
15. Notification
       ↓
16. Rollback or Retraining
```

---

# 10. Core Engineering Principles

1. **Implementation over research.**
   The project is primarily an engineering and implementation project, not an attempt to develop a novel ML algorithm.

2. **Open source first.**
   Prefer free and open-source technologies.

3. **Modular architecture.**
   Services should be independently understandable and deployable.

4. **Reproducibility.**
   Dataset versions, experiment parameters, model versions, and deployment versions should be traceable.

5. **Automation.**
   Avoid manual steps wherever automation is practical.

6. **Observability.**
   Production-like services should expose meaningful health and metrics endpoints.

7. **Security by default.**
   Authentication, authorization, password hashing, input validation, and secrets management must be considered.

8. **Do not over-engineer the MVP.**
   Features such as distributed GPU training, multi-cloud deployment, and multi-tenancy are future scope unless explicitly added later.

9. **Every feature must have a clear purpose.**
   Do not add technologies simply because they are popular.

10. **Maintainability over complexity.**
    Prefer straightforward code that the entire team can understand.

---

# 11. MVP Definition

The minimum viable version of the project must support:

* User authentication
* Dataset upload
* Dataset versioning
* Dataset storage in MinIO
* Dataset metadata in PostgreSQL
* ML training
* MLflow experiment tracking
* Model registration
* Model versioning
* Dockerized model serving
* Kubernetes deployment
* REST prediction API
* Prometheus metrics
* Grafana dashboard
* Basic logging
* Model rollback

The following are optional enhancements:

* Automatic drift detection
* Automatic retraining
* Email/Slack notifications
* Canary deployments
* LLM-assisted experiment analysis
* SHAP-based model explainability
* Advanced autoscaling
* Resource/cost monitoring

Optional features must not delay completion of the MVP.
