from sqlalchemy import Column, Integer, String, Date, Text
from backend.app.database.connection import Base
from datetime import date

class AnalyticsSnapshot(Base):
    __tablename__ = "analytics_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=date.today)
    type = Column(String, nullable=False) # e.g., daily_productivity, project_health
    metrics = Column(Text, nullable=False) # Store JSON string of metrics
