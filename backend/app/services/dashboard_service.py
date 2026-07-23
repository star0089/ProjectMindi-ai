from sqlalchemy.orm import Session
from datetime import date
from backend.app.models.project import Project
from backend.app.models.task import Task
from backend.app.models.milestone import Milestone
from backend.app.services.project_service import _enrich_project_response
from backend.app.services.task_service import _enrich_task_response
from backend.app.services.milestone_service import _enrich_milestone_response

def get_dashboard_analytics(db: Session):
    projects = db.query(Project).all()
    tasks = db.query(Task).all()
    milestones = db.query(Milestone).all()
    today = date.today()

    total_projects = len(projects)
    active_projects = sum(1 for p in projects if p.status == "active")
    completed_projects = sum(1 for p in projects if p.status == "completed")

    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status == "done")
    pending_tasks = total_tasks - completed_tasks
    overdue_tasks = 0
    for t in tasks:
        if t.status != "done" and t.end_date is not None:
            try:
                task_date = t.end_date if isinstance(t.end_date, date) else date.fromisoformat(str(t.end_date))
                if task_date < today:
                    overdue_tasks += 1
            except Exception:
                pass

    total_milestones = len(milestones)
    active_milestones = sum(1 for m in milestones if not m.completed)

    overall_progress_pct = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0.0

    recent_projects = [
        _enrich_project_response(p) 
        for p in db.query(Project).order_by(Project.created_at.desc()).limit(5).all()
    ]

    recent_tasks = [
        _enrich_task_response(t) 
        for t in db.query(Task).order_by(Task.id.desc()).limit(5).all()
    ]

    # Combine upcoming deadlines from milestones and tasks
    upcoming_deadlines = []
    for m in milestones:
        if not m.completed and m.deadline is not None:
            upcoming_deadlines.append({
                "id": f"m-{m.id}",
                "title": m.title,
                "deadline": str(m.deadline),
                "type": "milestone",
                "project_name": m.project.name if m.project else None
            })
    for t in tasks:
        if t.status != "done" and t.end_date is not None:
            upcoming_deadlines.append({
                "id": f"t-{t.id}",
                "title": t.title,
                "deadline": str(t.end_date),
                "type": "task",
                "project_name": t.project.name if t.project else None
            })

    upcoming_deadlines.sort(key=lambda x: x["deadline"])
    upcoming_deadlines = upcoming_deadlines[:5]

    return {
        "stats": {
            "total_projects": total_projects,
            "active_projects": active_projects,
            "completed_projects": completed_projects,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "overdue_tasks": overdue_tasks,
            "active_milestones": active_milestones,
            "overall_progress_percentage": overall_progress_pct,
        },
        "recent_projects": recent_projects,
        "recent_tasks": recent_tasks,
        "upcoming_deadlines": upcoming_deadlines,
    }
