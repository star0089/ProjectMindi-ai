from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class MilestoneBase(BaseModel):
    title: str = Field(..., min_length=1)
    deadline: Optional[date] = None
    completed: Optional[bool] = False

class MilestoneCreate(MilestoneBase):
    project_id: int

class MilestoneResponse(MilestoneBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
