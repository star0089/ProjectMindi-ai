from sqlalchemy.orm import Session
from backend.app.models.task import Task
from backend.app.models.project import Project
from backend.app.models.milestone import Milestone

def global_search(db: Session, query: str):
    q = f"%{query}%"
    tasks = db.query(Task).filter(Task.title.like(q)).all()
    projects = db.query(Project).filter(Project.name.like(q)).all()
    milestones = db.query(Milestone).filter(Milestone.title.like(q)).all()
    
    results = []
    for p in projects:
        results.append({"type": "Project", "id": p.id, "title": p.name})
    for t in tasks:
        results.append({"type": "Task", "id": t.id, "title": t.title})
    for m in milestones:
        results.append({"type": "Milestone", "id": m.id, "title": m.title})
        
    return results
