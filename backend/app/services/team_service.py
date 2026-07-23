from sqlalchemy.orm import Session
from backend.app.models.team import TeamMember, Workload
from backend.app.schemas.team import TeamMemberCreate
from typing import List

def get_team_members(db: Session) -> List[TeamMember]:
    return db.query(TeamMember).all()

def create_team_member(db: Session, member_in: TeamMemberCreate) -> TeamMember:
    db_member = TeamMember(
        name=member_in.name,
        email=member_in.email,
        role=member_in.role,
        avatar=member_in.avatar,
        skills=member_in.skills
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    
    # Create empty workload
    workload = Workload(member_id=db_member.id)
    db.add(workload)
    db.commit()
    
    return db_member

def update_workload(db: Session, member_id: int, tasks_count: int, completed: int, pending: int, overdue: int):
    workload = db.query(Workload).filter(Workload.member_id == member_id).first()
    if workload:
        workload.tasks_count = tasks_count
        workload.completed_tasks = completed
        workload.pending_tasks = pending
        workload.overdue_tasks = overdue
        if tasks_count > 0:
            workload.workload_percentage = int((pending / tasks_count) * 100)
        db.commit()
