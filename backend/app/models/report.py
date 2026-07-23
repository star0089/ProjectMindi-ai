from sqlalchemy import Column, Integer, String, Text, DateTime
from backend.app.database.connection import Base
from datetime import datetime

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False) # Daily, Weekly, Sprint
    content = Column(Text, nullable=True) # Store JSON or raw text
    format = Column(String, nullable=False) # PDF, DOCX, CSV equivalent 
    generated_at = Column(DateTime, default=datetime.utcnow)
