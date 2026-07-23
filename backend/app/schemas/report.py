from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReportBase(BaseModel):
    title: str
    type: str
    content: Optional[str] = None
    format: str

class ReportCreate(ReportBase):
    pass

class ReportResponse(ReportBase):
    id: int
    generated_at: datetime
    class Config:
        from_attributes = True
