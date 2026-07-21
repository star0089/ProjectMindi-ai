from pydantic import BaseModel, Field
from typing import Optional

class ScopeBase(BaseModel):
    requirement: str = Field(..., min_length=1)
    status: Optional[str] = "in_scope"
    notes: Optional[str] = None

class ScopeCreate(ScopeBase):
    project_id: int

class ScopeResponse(ScopeBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
