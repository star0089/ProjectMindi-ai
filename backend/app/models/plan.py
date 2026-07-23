from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.connection import Base

class ProjectPlan(Base):
    __tablename__ = "project_plans"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    # Store AI generated JSON strings or plain text sections
    overview = Column(Text, nullable=True)
    objectives = Column(Text, nullable=True)
    scope = Column(Text, nullable=True)
    deliverables = Column(Text, nullable=True)
    personas = Column(Text, nullable=True)
    modules = Column(Text, nullable=True)
    tech_stack = Column(Text, nullable=True)
    database_tables = Column(Text, nullable=True)
    api_endpoints = Column(Text, nullable=True)

    # Relationship
    project = relationship("Project", back_populates="plan")
