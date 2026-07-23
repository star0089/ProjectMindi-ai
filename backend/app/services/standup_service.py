from sqlalchemy.orm import Session
from backend.app.services.project_service import get_project_context_for_ai
from backend.app.services.ai_service import generate_json_analysis
from backend.app.prompts.standup_prompt import STANDUP_SYSTEM_PROMPT, build_standup_prompt
from backend.app.prompts.executive_summary import EXECUTIVE_SUMMARY_SYSTEM_PROMPT, build_executive_summary_prompt

def generate_daily_standup(db: Session, project_id: int) -> dict:
    project_data = get_project_context_for_ai(db, project_id)
    if not project_data:
        return {"error": "Project not found"}
        
    prompt = build_standup_prompt(project_data)
    result = generate_json_analysis(STANDUP_SYSTEM_PROMPT, prompt)
    
    if not result:
        return {
            "yesterday": ["Mock task A"],
            "today": ["Mock task B"],
            "blockers": ["None"],
            "suggestions": ["Keep up the good work"],
            "expected_completion": "Unknown"
        }
    return result

def generate_executive_summary(db: Session, project_id: int) -> dict:
    project_data = get_project_context_for_ai(db, project_id)
    if not project_data:
        return {"error": "Project not found"}
        
    prompt = build_executive_summary_prompt(project_data)
    result = generate_json_analysis(EXECUTIVE_SUMMARY_SYSTEM_PROMPT, prompt)
    
    if not result:
        return {
            "project_summary": "AI generation failed. Mock summary.",
            "completed_work": [],
            "pending_work": [],
            "upcoming_deadlines": [],
            "risks": [],
            "recommendations": []
        }
    return result
