from sqlalchemy import Column, Integer, String, Text, DateTime
from backend.app.database.connection import Base
from datetime import datetime

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String, nullable=False) # Project, Task, Milestone
    entity_id = Column(Integer, nullable=True)
    action = Column(String, nullable=False) # Created, Updated, Status Changed
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
