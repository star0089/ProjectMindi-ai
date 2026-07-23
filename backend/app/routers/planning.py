from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from backend.app.database.connection import get_db
from backend.app.schemas.planning import PlanGenerationRequest, AIProjectPlan
from backend.app.schemas.project import ProjectResponse
from backend.app.services import ai_service, planning_service

router = APIRouter(prefix="/planning", tags=["ai-planning"])

@router.post("/generate", response_model=Dict[str, Any])
def generate_plan(request: PlanGenerationRequest):
    """
    Calls Gemini API to generate a structured AI project plan based on user description.
    """
    try:
        plan_json = ai_service.generate_project_plan(request)
        return plan_json
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate project plan: {str(e)}"
        )

@router.post("/save", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def save_plan(
    name: str, 
    deadline: str, 
    plan_data: AIProjectPlan, 
    db: Session = Depends(get_db)
):
    """
    Persists the editable AI generated plan into SQLite as a new Project with related tasks, milestones, and risks.
    """
    try:
        project = planning_service.save_project_plan(db, name, deadline, plan_data)
        return project
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save project plan: {str(e)}"
        )
