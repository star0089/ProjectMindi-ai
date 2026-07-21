from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/scope", tags=["scope"])

@router.get("")
def get_scope_guardian(project_id: Optional[int] = Query(None, description="Filter scope requirements by project ID")):
    """
    Get the Scope Guardian details including scope requirements list, alignment metric and potential scope drift detections.
    """
    scope_data = {
        "project_id": project_id or 1,
        "scope_alignment_score": 95, # 95% aligned
        "total_requirements": 5,
        "implemented_requirements": 3,
        "drift_detected": False,
        "drift_details": None,
        "requirements": [
            {
                "id": 1,
                "requirement": "Modular folder structure for frontend and backend separation",
                "status": "implemented",
                "notes": "Verified, structure conforms to specs."
            },
            {
                "id": 2,
                "requirement": "FastAPI + SQLAlchemy + SQLite database structure with foreign keys enabled",
                "status": "implemented",
                "notes": "Implemented with connect listener for SQLite pragma."
            },
            {
                "id": 3,
                "requirement": "Premium SaaS dashboard layout featuring responsive Sidebar, Navbar and routing",
                "status": "implemented",
                "notes": "Completed React shell components."
            },
            {
                "id": 4,
                "requirement": "Light/Dark theme toggling using standard React context and LocalStorage hook",
                "status": "implemented",
                "notes": "Integrated tailwind config theme classes."
            },
            {
                "id": 5,
                "requirement": "Verification scripts to automate code compilation checks and backend server tests",
                "status": "pending",
                "notes": "Awaiting compilation script execution."
            }
        ]
    }
    return scope_data
