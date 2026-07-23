from pydantic import BaseModel, Field
from typing import Optional
import datetime

class AnalyticsSnapshotBase(BaseModel):
    type: str
    metrics: str

class AnalyticsSnapshotCreate(AnalyticsSnapshotBase):
    date: Optional[datetime.date] = Field(default_factory=datetime.date.today)

class AnalyticsSnapshotResponse(AnalyticsSnapshotBase):
    id: int
    date: datetime.date
    class Config:
        from_attributes = True
