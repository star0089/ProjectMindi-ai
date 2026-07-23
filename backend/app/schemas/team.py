from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any

class WorkloadBase(BaseModel):
    tasks_count: int = 0
    completed_tasks: int = 0
    pending_tasks: int = 0
    overdue_tasks: int = 0
    workload_percentage: int = 0

class WorkloadResponse(WorkloadBase):
    id: int
    member_id: int
    class Config:
        from_attributes = True

class TeamMemberBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    avatar: Optional[str] = None
    skills: Optional[str] = None

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberResponse(TeamMemberBase):
    id: int
    workload: Optional[WorkloadResponse] = None
    class Config:
        from_attributes = True
