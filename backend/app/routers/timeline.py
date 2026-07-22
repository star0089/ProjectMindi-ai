from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from backend.app.database.connection import get_db
from backend.app.models.milestone import Milestone
from backend.app.models.task import Task

router = APIRouter(prefix="/timeline", tags=["timeline"])

@router.get("")
def get_timeline(
    project_id: Optional[int] = Query(None, description="Filter timeline by project ID"),
    db: Session = Depends(get_db)
):
    milestones_query = db.query(Milestone)
    tasks_query = db.query(Task).filter(Task.end_date.isnot(None))

    if project_id is not None:
        milestones_query = milestones_query.filter(Milestone.project_id == project_id)
        tasks_query = tasks_query.filter(Task.project_id == project_id)

    milestones = milestones_query.all()
    tasks = tasks_query.all()

    timeline_items = []
    for m in milestones:
        timeline_items.append({
            "id": f"m-{m.id}",
            "raw_id": m.id,
            "project_id": m.project_id,
            "project_name": m.project.name if m.project else None,
            "title": m.title,
            "deadline": m.deadline.isoformat() if m.deadline else None,
            "completed": m.completed,
            "type": "milestone"
        })

    for t in tasks:
        timeline_items.append({
            "id": f"t-{t.id}",
            "raw_id": t.id,
            "project_id": t.project_id,
            "project_name": t.project.name if t.project else None,
            "title": t.title,
            "deadline": t.end_date.isoformat() if t.end_date else None,
            "completed": t.status == "done",
            "type": "task",
            "status": t.status,
            "priority": t.priority
        })

    # Sort items by deadline
    timeline_items.sort(key=lambda x: x["deadline"] or "9999-12-31")
    return timeline_items
