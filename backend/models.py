from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, create_engine
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://mlops:mlops_password@localhost:5432/mlops_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLAlchemy Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Dataset(Base):
    __tablename__ = "app_datasets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    file_path = Column(String)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

class Experiment(Base):
    __tablename__ = "app_experiments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    dataset_id = Column(Integer, ForeignKey("app_datasets.id"))
    algorithm = Column(String)
    accuracy = Column(Float, nullable=True)
    run_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class RegisteredModel(Base):
    __tablename__ = "app_registered_models"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    experiment_id = Column(Integer, ForeignKey("app_experiments.id"))
    version = Column(String)
    status = Column(String, default="Development")

class Deployment(Base):
    __tablename__ = "deployments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    model_id = Column(Integer, ForeignKey("app_registered_models.id"))
    endpoint = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Pydantic Schemas
class UserCreate(BaseModel):
    username: str
    password: str

class DatasetCreate(BaseModel):
    name: str
    description: str

class ExperimentCreate(BaseModel):
    dataset_id: int
    algorithm: str
    target_column: str

class ModelRegister(BaseModel):
    experiment_id: int
    name: str

class DeploymentCreate(BaseModel):
    model_id: int
    name: str

class PredictionRequest(BaseModel):
    features: Dict[str, Any]

