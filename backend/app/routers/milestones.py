from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database.connection import get_db
from backend.app.schemas.milestone import MilestoneCreate, MilestoneUpdate, MilestoneResponse
from backend.app.services import milestone_service

router = APIRouter(prefix="/milestones", tags=["milestones"])

@router.get("", response_model=List[MilestoneResponse])
def get_milestones(
    project_id: Optional[int] = Query(None, description="Filter by project ID"),
    db: Session = Depends(get_db)
):
    return milestone_service.get_all_milestones(db, project_id=project_id)

@router.post("", response_model=MilestoneResponse, status_code=status.HTTP_201_CREATED)
def create_milestone(milestone: MilestoneCreate, db: Session = Depends(get_db)):
    return milestone_service.create_milestone(db, milestone)

@router.get("/{milestone_id}", response_model=MilestoneResponse)
def get_milestone(milestone_id: int, db: Session = Depends(get_db)):
    milestone = milestone_service.get_milestone_by_id(db, milestone_id)
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return milestone

@router.put("/{milestone_id}", response_model=MilestoneResponse)
def update_milestone(milestone_id: int, milestone_in: MilestoneUpdate, db: Session = Depends(get_db)):
    updated = milestone_service.update_milestone(db, milestone_id, milestone_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return updated

@router.patch("/{milestone_id}/complete", response_model=MilestoneResponse)
def toggle_milestone_complete(milestone_id: int, db: Session = Depends(get_db)):
    updated = milestone_service.toggle_milestone_completion(db, milestone_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return updated

@router.delete("/{milestone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_milestone(milestone_id: int, db: Session = Depends(get_db)):
    success = milestone_service.delete_milestone(db, milestone_id)
    if not success:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return None
