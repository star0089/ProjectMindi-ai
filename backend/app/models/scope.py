from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.connection import Base

class Scope(Base):
    __tablename__ = "scopes"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    requirement = Column(Text, nullable=False)
    status = Column(String, default="in_scope", index=True) # e.g., in_scope, out_of_scope, pending_review, implemented
    notes = Column(Text, nullable=True)

    # Relationships
    project = relationship("Project", back_populates="scopes")
