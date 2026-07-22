from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.models.milestone import Milestone
from backend.app.schemas.milestone import MilestoneCreate, MilestoneUpdate, MilestoneResponse

def _enrich_milestone_response(milestone: Milestone) -> MilestoneResponse:
    project_name = milestone.project.name if milestone.project else None
    return MilestoneResponse(
        id=milestone.id,
        project_id=milestone.project_id,
        title=milestone.title,
        deadline=milestone.deadline,
        completed=milestone.completed,
        project_name=project_name
    )

def create_milestone(db: Session, milestone_in: MilestoneCreate) -> MilestoneResponse:
    db_milestone = Milestone(
        project_id=milestone_in.project_id,
        title=milestone_in.title,
        deadline=milestone_in.deadline,
        completed=milestone_in.completed or False
    )
    db.add(db_milestone)
    db.commit()
    db.refresh(db_milestone)
    return _enrich_milestone_response(db_milestone)

def get_milestone_by_id(db: Session, milestone_id: int) -> Optional[MilestoneResponse]:
    milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not milestone:
        return None
    return _enrich_milestone_response(milestone)

def get_all_milestones(db: Session, project_id: Optional[int] = None) -> List[MilestoneResponse]:
    query = db.query(Milestone)
    if project_id is not None:
        query = query.filter(Milestone.project_id == project_id)
    
    milestones = query.order_by(Milestone.deadline.asc().nulls_last()).all()
    return [_enrich_milestone_response(m) for m in milestones]

def update_milestone(db: Session, milestone_id: int, milestone_in: MilestoneUpdate) -> Optional[MilestoneResponse]:
    db_milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not db_milestone:
        return None

    update_data = milestone_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_milestone, field, value)

    db.commit()
    db.refresh(db_milestone)
    return _enrich_milestone_response(db_milestone)

def toggle_milestone_completion(db: Session, milestone_id: int) -> Optional[MilestoneResponse]:
    db_milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not db_milestone:
        return None

    db_milestone.completed = not db_milestone.completed
    db.commit()
    db.refresh(db_milestone)
    return _enrich_milestone_response(db_milestone)

def delete_milestone(db: Session, milestone_id: int) -> bool:
    db_milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not db_milestone:
        return False

    db.delete(db_milestone)
    db.commit()
    return True
