from sqlalchemy.orm import Session
from backend.app.models.task import Task
from backend.app.models.milestone import Milestone

def get_calendar_events(db: Session):
    tasks = db.query(Task).all()
    milestones = db.query(Milestone).all()
    
    events = []
    for t in tasks:
        if t.end_date:
            events.append({
                "id": f"task-{t.id}",
                "title": t.title,
                "date": str(t.end_date),
                "type": "task",
                "status": t.status
            })
    for m in milestones:
        if m.deadline:
            events.append({
                "id": f"milestone-{m.id}",
                "title": m.title,
                "date": str(m.deadline),
                "type": "milestone",
                "status": "completed" if m.completed else "pending"
            })
            
    return events
