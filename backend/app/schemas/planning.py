from pydantic import BaseModel, Field
from typing import List, Optional

class AIUserStory(BaseModel):
    role: str
    action: str
    benefit: str

class AITask(BaseModel):
    title: str
    description: str
    priority: str
    estimated_hours: int
    status: str

class AIMilestone(BaseModel):
    title: str
    description: str
    deadline_days_offset: int
    deliverables: str

class AIRisk(BaseModel):
    title: str
    severity: str
    description: str
    mitigation: str

class AIDatabaseTable(BaseModel):
    name: str
    columns: str
    relationships: str

class AIApiEndpoint(BaseModel):
    method: str
    path: str
    description: str

class AIProjectPlan(BaseModel):
    project_overview: str
    objectives: str
    scope: str
    deliverables: str
    personas: str
    modules: str
    tech_stack: str
    user_stories: List[AIUserStory]
    tasks: List[AITask]
    milestones: List[AIMilestone]
    risks: List[AIRisk]
    database_tables: List[AIDatabaseTable]
    api_endpoints: List[AIApiEndpoint]

class PlanGenerationRequest(BaseModel):
    name: str
    description: str
    deadline: Optional[str] = None
    team_size: Optional[str] = None
    tech_preference: Optional[str] = None
