from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date
from sqlalchemy.orm import relationship
from backend.app.database.connection import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    priority = Column(String, default="medium", index=True) # e.g., low, medium, high, critical
    status = Column(String, default="todo", index=True) # e.g., todo, in_progress, review, done
    assignee = Column(String, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    # Relationships
    project = relationship("Project", back_populates="tasks")
