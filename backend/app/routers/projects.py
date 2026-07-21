from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import date, datetime
from backend.app.schemas.project import ProjectCreate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["projects"])

# Mock database for layout/testing support
MOCK_PROJECTS = [
    {
        "id": 1,
        "name": "ProjectPilot AI Core Setup",
        "description": "Initialize the React frontend and FastAPI backend with fully modular routing and models.",
        "status": "active",
        "deadline": date(2026, 8, 15),
        "created_at": datetime(2026, 7, 21, 10, 0, 0),
        "updated_at": datetime(2026, 7, 21, 10, 0, 0),
    },
    {
        "id": 2,
        "name": "Gemini API Integration",
        "description": "Connect backend service to Gemini API and construct prompt templates for autonomous PM recommendations.",
        "status": "planning",
        "deadline": date(2026, 9, 30),
        "created_at": datetime(2026, 7, 21, 10, 30, 0),
        "updated_at": datetime(2026, 7, 21, 10, 30, 0),
    },
    {
        "id": 3,
        "name": "SaaS Platform Launch",
        "description": "Deploy to Vercel (frontend) and Render (backend) with database persistence enabled.",
        "status": "planning",
        "deadline": date(2026, 10, 15),
        "created_at": datetime(2026, 7, 21, 11, 0, 0),
        "updated_at": datetime(2026, 7, 21, 11, 0, 0),
    }
]

@router.get("", response_model=List[ProjectResponse])
def get_projects():
    """
    Get all projects.
    """
    return MOCK_PROJECTS

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(project: ProjectCreate):
    """
    Create a new project.
    """
    new_project = {
        "id": len(MOCK_PROJECTS) + 1,
        "name": project.name,
        "description": project.description,
        "status": project.status or "active",
        "deadline": project.deadline,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    MOCK_PROJECTS.append(new_project)
    return new_project
