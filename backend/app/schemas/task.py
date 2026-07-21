from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    description: Optional[str] = None
    priority: Optional[str] = "medium"
    status: Optional[str] = "todo"
    assignee: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class TaskCreate(TaskBase):
    project_id: int

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    assignee: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class TaskResponse(TaskBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
