from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, JSON
from backend.app.database.connection import Base
from sqlalchemy.orm import relationship

class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False) # Admin, Project Manager, Developer, QA, Designer, Viewer
    avatar = Column(String, nullable=True)
    skills = Column(String, nullable=True) # Comma separated or JSON

    # Assuming a one-to-one relationship with workload for simplicity
    workload = relationship("Workload", back_populates="member", uselist=False)

class Workload(Base):
    __tablename__ = "workloads"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("team_members.id", ondelete="CASCADE"), nullable=False)
    tasks_count = Column(Integer, default=0)
    completed_tasks = Column(Integer, default=0)
    pending_tasks = Column(Integer, default=0)
    overdue_tasks = Column(Integer, default=0)
    workload_percentage = Column(Integer, default=0)

    member = relationship("TeamMember", back_populates="workload")
