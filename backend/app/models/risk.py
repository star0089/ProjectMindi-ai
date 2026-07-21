from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.connection import Base

class Risk(Base):
    __tablename__ = "risks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False, index=True)
    severity = Column(String, default="medium", index=True) # e.g., low, medium, high, critical
    status = Column(String, default="identified", index=True) # e.g., identified, mitigated, triggered, resolved
    description = Column(Text, nullable=True)

    # Relationships
    project = relationship("Project", back_populates="risks")
