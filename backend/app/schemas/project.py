from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional

class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    status: Optional[str] = "active" # planning, active, on_hold, completed, cancelled
    deadline: Optional[date] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    deadline: Optional[date] = None

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    progress_percentage: float = 0.0
    completed_tasks_count: int = 0
    pending_tasks_count: int = 0
    total_tasks_count: int = 0
    overdue_tasks_count: int = 0
    milestones_count: int = 0
    completed_milestones_count: int = 0

    class Config:
        from_attributes = True
