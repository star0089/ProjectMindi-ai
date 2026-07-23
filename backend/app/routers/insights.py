from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.database.connection import get_db
from backend.app.services.health_score_service import generate_health_score
from backend.app.services.standup_service import generate_daily_standup, generate_executive_summary
from backend.app.services.recommendation_service import generate_recommendations
from backend.app.services.prediction_service import generate_predictions

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/health")
def get_project_health(project_id: int, db: Session = Depends(get_db)):
    """Get the overall health score and metrics for a project."""
    return generate_health_score(db, project_id)

@router.get("/standup")
def get_daily_standup(project_id: int, db: Session = Depends(get_db)):
    """Generate a daily AI standup report."""
    return generate_daily_standup(db, project_id)

@router.get("/executive-summary")
def get_executive_summary(project_id: int, db: Session = Depends(get_db)):
    """Generate a weekly executive summary."""
    return generate_executive_summary(db, project_id)

@router.get("/recommendations")
def get_recommendations(project_id: int, db: Session = Depends(get_db)):
    """Get smart AI recommendations for project tasks."""
    return generate_recommendations(db, project_id)

@router.get("/prediction")
def get_predictions(project_id: int, db: Session = Depends(get_db)):
    """Get timeline predictions and dependency analysis."""
    return generate_predictions(db, project_id)
