from sqlalchemy import Column, Integer, String, Text, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database.connection import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="active", index=True) # e.g., planning, active, completed, on_hold
    deadline = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    milestones = relationship("Milestone", back_populates="project", cascade="all, delete-orphan")
    risks = relationship("Risk", back_populates="project", cascade="all, delete-orphan")
    scopes = relationship("Scope", back_populates="project", cascade="all, delete-orphan")
    chat_histories = relationship("ChatHistory", back_populates="project", cascade="all, delete-orphan")
    plan = relationship("ProjectPlan", back_populates="project", uselist=False, cascade="all, delete-orphan")
