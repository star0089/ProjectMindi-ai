from sqlalchemy.orm import Session
import json
from backend.app.services.project_service import get_project_context_for_ai
from backend.app.services.ai_service import generate_json_analysis

HEALTH_SCORE_SYSTEM_PROMPT = """
You are a Project Health Scoring Engine.
Analyze the project data (Tasks, Milestones, Scope, Risks).
Calculate a Project Health Score from 0 to 100 based on Timeline Health, Task Completion, Milestone Progress, Scope Coverage, and Risk Level.
Provide the overall score and explain why the score is high or low.

Return ONLY valid JSON with this exact structure:
{
  "overall_health_score": 85,
  "timeline_health": 90,
  "task_completion": 80,
  "milestone_progress": 70,
  "scope_coverage": 95,
  "risk_level": "Low",
  "explanation": "Detailed explanation of why the score is what it is."
}
"""

def generate_health_score(db: Session, project_id: int) -> dict:
    project_data = get_project_context_for_ai(db, project_id)
    if not project_data:
        return {"error": "Project not found"}
        
    prompt = f"Calculate the Project Health Score based on the following data:\n\n{json.dumps(project_data, indent=2)}"
    result = generate_json_analysis(HEALTH_SCORE_SYSTEM_PROMPT, prompt)
    
    if not result:
        return {
            "overall_health_score": 0,
            "timeline_health": 0,
            "task_completion": 0,
            "milestone_progress": 0,
            "scope_coverage": 0,
            "risk_level": "Unknown",
            "explanation": "AI Engine failed to generate health score."
        }
    return result
