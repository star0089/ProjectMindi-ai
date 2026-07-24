from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PRDParseRequest(BaseModel):
    project_id: Optional[int] = 1
    document_text: str = Field(..., description="Raw text or markdown of the PRD / Scope of Work document")
    document_title: Optional[str] = "Project Specification"

class PRDAuditRequest(BaseModel):
    project_id: int
    blueprint: Optional[Dict[str, Any]] = None

class RequirementItem(BaseModel):
    id: Optional[int] = None
    title: str
    category: str = "functional"  # functional, non_functional, deliverable
    priority: str = "high"       # critical, high, medium, low
    status: str = "in_scope"     # implemented, in_scope, missing, out_of_scope
    acceptance_criteria: List[str] = []
    notes: Optional[str] = ""

class ProjectBlueprint(BaseModel):
    project_title: str
    objectives: List[str]
    functional_requirements: List[RequirementItem]
    non_functional_requirements: List[RequirementItem]
    deliverables: List[str]
    key_milestones: List[str]
    dependencies: List[str]

class ScopeAuditResult(BaseModel):
    project_id: int
    scope_alignment_score: int
    confidence_score: int
    total_requirements_count: int
    implemented_count: int
    missing_features: List[str]
    unexpected_work: List[str]
    incomplete_modules: List[str]
    ignored_acceptance_criteria: List[str]
    risk_score: str
    strategic_recommendation: str
    detailed_requirements: List[RequirementItem]
