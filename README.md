# MLOps Platform

A full-stack MLOps platform featuring model training, tracking (MLflow), dataset management (MinIO/S3), and serving (FastAPI + React frontend).

---

## Prerequisites

Ensure you have the following installed:

- **Git**: [Download Git](https://git-scm.com/)
- **Docker & Docker Desktop**: [Install Docker Desktop](https://www.docker.com/products/docker-desktop/) *(Includes Docker Compose)*

---

## Quick Start with Docker Compose (Recommended)

Docker Compose automatically pulls, builds, and starts all required services—including PostgreSQL, MinIO, MLflow, Backend API, and Frontend—with zero manual configuration.

### Step 1: Clone the Repository

```bash
git clone https://github.com/neelwankhade007-rgb/MLOps-Neel.git
cd MLOps-Neel
```

### Step 2: Build and Start All Services

```bash
docker-compose up --build -d
```

### Step 3: Verify Running Containers

```bash
docker-compose ps
```

### Stopping Services

To stop and remove all running containers:

```bash
docker-compose down
```

---

## Service Endpoints

Once running, access the services using your browser:

| Service | Access URL | Default Credentials |
| :--- | :--- | :--- |
| **Frontend Web App** | `http://localhost:5173` | N/A |
| **Backend API (FastAPI Docs)** | `http://localhost:8000/docs` | N/A |
| **MLflow Tracking UI** | `http://localhost:5000` | N/A |
| **MinIO Console** | `http://localhost:9001` | Username: `admin` / Password: `password` |
| **PostgreSQL Database** | `localhost:5432` | User: `mlops` / Password: `mlops_password` / DB: `mlops_db` |

---

## System Requirements

- **Disk Storage:** ~4.0 GB – 5.0 GB free disk space (for base Docker images, python ML dependencies, and artifacts)
- **RAM:** 4 GB – 8 GB RAM

---

## Alternative: Manual Local Setup (Advanced)

If you prefer to run services manually without Docker Compose:

### 1. Database Options (If PostgreSQL is not installed locally)
- **Run PostgreSQL in Docker:**
  ```bash
  docker run --name mlops-postgres -e POSTGRES_USER=mlops -e POSTGRES_PASSWORD=mlops_password -e POSTGRES_DB=mlops_db -p 5432:5432 -d postgres:15
  ```
- **Use SQLite (Zero Install):**
  - PowerShell: `$env:DATABASE_URL="sqlite:///./mlops.db"`
  - Bash: `export DATABASE_URL="sqlite:///./mlops.db"`

### 2. Backend Setup
1. `cd backend`
2. Create virtual environment:
   - Linux/macOS: `python3 -m venv venv && source venv/bin/activate`
   - Windows: `python -m venv venv` and `.\venv\Scripts\Activate.ps1`
3. Install dependencies: `pip install -r requirements.txt`
4. Run server: `uvicorn main:app --reload --port 8000`

### 3. Frontend Setup
1. `cd frontend`
2. Install packages: `npm install`
3. Run dev server: `npm run dev`
