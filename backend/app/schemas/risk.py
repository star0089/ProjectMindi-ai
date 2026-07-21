from pydantic import BaseModel, Field
from typing import Optional

class RiskBase(BaseModel):
    title: str = Field(..., min_length=1)
    severity: Optional[str] = "medium"  # e.g., low, medium, high, critical
    status: Optional[str] = "identified"  # e.g., identified, mitigated, triggered, resolved
    description: Optional[str] = None

class RiskCreate(RiskBase):
    project_id: int

class RiskResponse(RiskBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
