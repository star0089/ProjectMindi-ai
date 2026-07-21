from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from backend.app.database.connection import Base

class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False, index=True)
    deadline = Column(Date, nullable=True)
    completed = Column(Boolean, default=False)

    # Relationships
    project = relationship("Project", back_populates="milestones")
