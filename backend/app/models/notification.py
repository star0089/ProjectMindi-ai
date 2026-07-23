from sqlalchemy import Column, Integer, String, Text, DateTime
from backend.app.database.connection import Base
from datetime import datetime

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    type = Column(String, nullable=False) # e.g. Task Assigned, Milestone Due
    is_read = Column(Integer, default=0) # SQLite doesn't have boolean by default, using 0/1
    timestamp = Column(DateTime, default=datetime.utcnow)
