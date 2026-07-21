from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/risk", tags=["risk"])

@router.get("")
def get_risk_analysis(project_id: Optional[int] = Query(None, description="Filter risks by project ID")):
    """
    Get the project risk center overview and active risk registries.
    """
    return {
        "project_id": project_id or 1,
        "overall_risk_status": "Low-Medium",
        "active_risks_count": 2,
        "mitigated_risks_count": 1,
        "risks": [
            {
                "id": 1,
                "title": "API Rate Limits with Gemini API",
                "severity": "high",
                "status": "mitigated",
                "description": "If user prompt volume scales too quickly, we may hit Gemini API rate limit windows.",
                "mitigation_plan": "Implement redis-based caching for frequent prompts and exponential backoff queues."
            },
            {
                "id": 2,
                "title": "SQLite Concurrent Write Locks",
                "severity": "medium",
                "status": "identified",
                "description": "Under multithreaded heavy requests, SQLite may return database is locked error.",
                "mitigation_plan": "Configure SQLite journal mode to WAL (Write-Ahead Logging) and set appropriate timeout values."
            },
            {
                "id": 3,
                "title": "TailwindCSS Build Cache Invalidation",
                "severity": "low",
                "status": "resolved",
                "description": "CSS classes may fail to compile when switching branches with cache storage active.",
                "mitigation_plan": "Setup automatic cache clearing scripts on git checkout hooks."
            }
        ]
    }
