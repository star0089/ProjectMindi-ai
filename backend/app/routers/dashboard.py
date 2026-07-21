from fastapi import APIRouter
from datetime import datetime

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("")
def get_dashboard_summary():
    """
    Get aggregated dashboard details for ProjectPilot AI.
    """
    return {
        "project_health": {
            "status": "Healthy",
            "score": 92,
            "description": "On track with minimal scope creep and low risk exposures."
        },
        "overall_progress": {
            "percentage": 68,
            "completed_milestones": 4,
            "total_milestones": 6
        },
        "tasks_summary": {
            "completed": 12,
            "in_progress": 8,
            "todo": 14,
            "total": 34
        },
        "upcoming_deadlines": [
            {
                "id": 1,
                "title": "Vite Application Routing Complete",
                "deadline": "2026-07-24",
                "type": "milestone"
            },
            {
                "id": 2,
                "title": "Setup SQLite SQLAlchemy Tables",
                "deadline": "2026-07-25",
                "type": "task"
            }
        ],
        "active_risks": {
            "count": 2,
            "severity_breakdown": {"critical": 0, "high": 1, "medium": 1, "low": 0},
            "items": [
                {
                    "id": 1,
                    "title": "API Rate Limits",
                    "severity": "high",
                    "status": "mitigating"
                }
            ]
        },
        "scope_health": {
            "percentage": 95,
            "total_requirements": 20,
            "implemented": 12,
            "creep_detected": False
        },
        "recent_ai_insights": [
            {
                "id": 1,
                "category": "risk",
                "text": "Risk detected: High severity dependency conflict warning on Axios versions.",
                "timestamp": "2026-07-21T10:15:00Z"
            },
            {
                "id": 2,
                "category": "progress",
                "text": "Insight: Task 'FastAPI Setup' is advancing 15% faster than initial milestone projections.",
                "timestamp": "2026-07-21T09:40:00Z"
            }
        ],
        "recent_activity": [
            {
                "id": 1,
                "user": "Architect",
                "action": "created project structure",
                "timestamp": "2026-07-21T10:00:00Z"
            },
            {
                "id": 2,
                "user": "Backend Developer",
                "action": "completed model declarations",
                "timestamp": "2026-07-21T10:45:00Z"
            }
        ]
    }
