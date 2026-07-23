from fastapi import APIRouter, Query, Depends
from typing import Optional
from sqlalchemy.orm import Session
from backend.app.database.connection import get_db
from backend.app.models.project import Project
from backend.app.services.scope_guardian_service import analyze_scope

router = APIRouter(prefix="/scope", tags=["scope"])

@router.get("")
def get_scope_guardian(project_id: Optional[int] = Query(None, description="Filter scope requirements by project ID"), db: Session = Depends(get_db)):
    """
    Get the Scope Guardian details including scope requirements list, alignment metric and potential scope drift detections.
    """
    if project_id is None:
        first_proj = db.query(Project).first()
        project_id = first_proj.id if first_proj else 1
        
    return analyze_scope(db, project_id)
