from fastapi import APIRouter, Query, Depends
from typing import Optional
from sqlalchemy.orm import Session
from backend.app.database.connection import get_db
from backend.app.services.risk_analysis_service import predict_risks

router = APIRouter(prefix="/risk", tags=["risk"])

@router.get("")
def get_risk_analysis(project_id: int = Query(1, description="Filter risks by project ID"), db: Session = Depends(get_db)):
    """
    Get the project risk center overview and active risk registries.
    """
    return predict_risks(db, project_id)
