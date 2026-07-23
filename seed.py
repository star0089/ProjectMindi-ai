import os
import sys
from datetime import date, timedelta

# Add the project root to python path so we can import backend
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.app.database.connection import SessionLocal, Base, engine
from backend.app.models.project import Project
from backend.app.models.task import Task
from backend.app.models.milestone import Milestone
from backend.app.models.scope import Scope
from backend.app.models.risk import Risk
from backend.app.models.chat import ChatHistory
from backend.app.models.plan import ProjectPlan

def seed_database():
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    today = date.today()
    
    # 1. Create a rich project
    project = Project(
        name="AI E-Commerce Platform",
        description="A next-generation e-commerce platform featuring AI-driven product recommendations, automated inventory management, and a headless frontend architecture.",
        status="active",
        deadline=today + timedelta(days=90)
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    
    p_id = project.id

    # 2. Add Scopes (Original Requirements)
    scopes = [
        Scope(project_id=p_id, requirement="User Authentication with OAuth2 (Google/GitHub)", status="implemented", notes="Integrated with Auth0."),
        Scope(project_id=p_id, requirement="AI Product Recommendation Engine based on user history", status="in_scope", notes="Pending data science model."),
        Scope(project_id=p_id, requirement="Stripe Integration for Subscription payments", status="in_scope", notes="API keys created."),
        Scope(project_id=p_id, requirement="Real-time Inventory tracking", status="pending_review", notes="Requires WebSocket implementation."),
        Scope(project_id=p_id, requirement="Mobile App for iOS/Android", status="out_of_scope", notes="Deferred to Phase 2.")
    ]
    db.add_all(scopes)
    
    # 3. Add Milestones
    milestones = [
        Milestone(project_id=p_id, title="Core Architecture Setup", deadline=today - timedelta(days=10), completed=True),
        Milestone(project_id=p_id, title="Authentication & Payments", deadline=today + timedelta(days=5), completed=False),
        Milestone(project_id=p_id, title="AI Recommendation MVP", deadline=today + timedelta(days=25), completed=False),
        Milestone(project_id=p_id, title="Beta Launch", deadline=today + timedelta(days=60), completed=False)
    ]
    db.add_all(milestones)

    # 4. Add Tasks (Completed, Active, Overdue, Blocked)
    tasks = [
        # Completed
        Task(project_id=p_id, title="Setup FastAPI Backend", description="Initialize project with SQLAlchemy and SQLite.", priority="critical", status="done", assignee="Alice", start_date=today - timedelta(days=15), end_date=today - timedelta(days=12)),
        Task(project_id=p_id, title="Setup React Frontend", description="Vite + React + Tailwind scaffolding.", priority="high", status="done", assignee="Bob", start_date=today - timedelta(days=15), end_date=today - timedelta(days=11)),
        # In Progress
        Task(project_id=p_id, title="Integrate Auth0", description="Add OAuth providers.", priority="high", status="in_progress", assignee="Alice", start_date=today - timedelta(days=5), end_date=today + timedelta(days=2)),
        Task(project_id=p_id, title="Stripe Webhooks", description="Handle payment success and failure events.", priority="critical", status="todo", assignee="Charlie", start_date=today, end_date=today + timedelta(days=5)),
        # Blocked/Overdue
        Task(project_id=p_id, title="Train Recommendation Model", description="Requires AWS GPU instance.", priority="high", status="todo", assignee="Dave", start_date=today - timedelta(days=5), end_date=today - timedelta(days=1)),
        # Scope Drift (Unplanned features)
        Task(project_id=p_id, title="Add Dark Mode to Dashboard", description="Users requested dark mode.", priority="low", status="in_progress", assignee="Bob", start_date=today, end_date=today + timedelta(days=1))
    ]
    db.add_all(tasks)

    # 5. Add Risks
    risks = [
        Risk(project_id=p_id, title="AWS GPU Instance Unavailability", severity="high", status="identified", description="Dave cannot train the ML model because GPU instances are unavailable. Mitigation: Switch to Google Cloud Compute Engine temporarily."),
        Risk(project_id=p_id, title="Scope Creep with Dark Mode", severity="low", status="identified", description="Frontend team is building dark mode which wasn't in the original PRD. Mitigation: Review with product manager to decide if we should halt."),
        Risk(project_id=p_id, title="Auth0 Rate Limits", severity="medium", status="mitigated", description="Hitting free tier limits during load testing. Mitigation: Upgraded to Pro tier.")
    ]
    db.add_all(risks)

    db.commit()
    print(f"Successfully seeded the database! Project ID: {p_id}")
    db.close()

if __name__ == "__main__":
    seed_database()
