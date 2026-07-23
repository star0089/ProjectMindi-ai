from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActivityLogBase(BaseModel):
    entity_type: str
    entity_id: Optional[int] = None
    action: str
    details: Optional[str] = None

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLogResponse(ActivityLogBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True
