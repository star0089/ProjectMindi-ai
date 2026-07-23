import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.app.models.project import Project
from backend.app.models.plan import ProjectPlan
from backend.app.models.task import Task
from backend.app.models.milestone import Milestone
from backend.app.models.risk import Risk
from backend.app.schemas.planning import AIProjectPlan

def save_project_plan(db: Session, name: str, deadline: str, plan_data: AIProjectPlan) -> Project:
    # 1. Create Project
    db_project = Project(
        name=name,
        description=plan_data.project_overview,
        status="planning",
        deadline=datetime.strptime(deadline, "%Y-%m-%d").date() if deadline else None
    )
    db.add(db_project)
    db.flush() # Get project ID

    # 2. Create ProjectPlan
    db_plan = ProjectPlan(
        project_id=db_project.id,
        overview=plan_data.project_overview,
        objectives=plan_data.objectives,
        scope=plan_data.scope,
        deliverables=plan_data.deliverables,
        personas=plan_data.personas,
        modules=plan_data.modules,
        tech_stack=plan_data.tech_stack,
        user_stories=json.dumps([s.model_dump() for s in plan_data.user_stories]),
        database_tables=json.dumps([t.model_dump() for t in plan_data.database_tables]),
        api_endpoints=json.dumps([a.model_dump() for a in plan_data.api_endpoints])
    )
    db.add(db_plan)

    # 3. Create Tasks
    for t in plan_data.tasks:
        db_task = Task(
            project_id=db_project.id,
            title=t.title,
            description=f"{t.description}\n\nEstimated Hours: {t.estimated_hours}",
            priority=t.priority if t.priority in ["low", "medium", "high", "critical"] else "medium",
            status=t.status if t.status in ["todo", "in_progress", "review", "testing", "done"] else "todo"
        )
        db.add(db_task)

    # 4. Create Milestones
    for idx, m in enumerate(plan_data.milestones):
        ms_deadline = None
        if deadline:
            base_date = datetime.strptime(deadline, "%Y-%m-%d")
            # If deadline_days_offset is 14, we just subtract from deadline or add to today?
            # Let's say milestone deadline is today + offset
            ms_deadline = (datetime.utcnow() + timedelta(days=m.deadline_days_offset)).date()

        db_milestone = Milestone(
            project_id=db_project.id,
            title=m.title,
            deadline=ms_deadline,
            completed=False
        )
        db.add(db_milestone)

    # 5. Create Risks
    for r in plan_data.risks:
        db_risk = Risk(
            project_id=db_project.id,
            title=r.title,
            severity=r.severity if r.severity in ["low", "medium", "high", "critical"] else "medium",
            description=f"{r.description}\n\nMitigation: {r.mitigation}",
            status="identified"
        )
        db.add(db_risk)

    db.commit()
    db.refresh(db_project)
    return db_project
