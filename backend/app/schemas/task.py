from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    description: Optional[str] = None
    priority: Optional[str] = "medium" # low, medium, high, critical
    status: Optional[str] = "todo" # todo, in_progress, review, testing, done
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

class TaskStatusUpdate(BaseModel):
    status: str

class TaskResponse(TaskBase):
    id: int
    project_id: int
    project_name: Optional[str] = None

    class Config:
        from_attributes = True
