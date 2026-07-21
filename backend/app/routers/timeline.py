from fastapi import APIRouter, Query
from typing import Optional, List
from datetime import date

router = APIRouter(prefix="/timeline", tags=["timeline"])

@router.get("")
def get_timeline(project_id: Optional[int] = Query(None, description="Filter timeline by project ID")):
    """
    Get project milestones and key task milestones for Gantt or timeline visualization.
    """
    # Mock data for project 1
    timeline_data = [
        {
            "id": 1,
            "project_id": 1,
            "title": "Project Initialization",
            "description": "Establish directories, environments, and base configurations.",
            "deadline": date(2026, 7, 22),
            "completed": True,
            "type": "milestone",
            "phase": "Phase 1: Setup"
        },
        {
            "id": 2,
            "project_id": 1,
            "title": "Backend Base & Models Setup",
            "description": "Expose SQLAlchemy models, migrate schemas and create connection sessions.",
            "deadline": date(2026, 7, 24),
            "completed": False,
            "type": "milestone",
            "phase": "Phase 2: Database"
        },
        {
            "id": 3,
            "project_id": 1,
            "title": "Frontend Core Layout Design",
            "description": "Setup global layouts, routes, theme engine, and key card widgets.",
            "deadline": date(2026, 7, 26),
            "completed": False,
            "type": "milestone",
            "phase": "Phase 3: Client Interface"
        },
        {
            "id": 4,
            "project_id": 1,
            "title": "API Routes Mapping & Integration",
            "description": "Integrate API mock models, configure react-query endpoints, and link dashboards.",
            "deadline": date(2026, 7, 30),
            "completed": False,
            "type": "milestone",
            "phase": "Phase 4: Linking"
        }
    ]
    
    if project_id is not None:
        return [item for item in timeline_data if item["project_id"] == project_id]
    return timeline_data
