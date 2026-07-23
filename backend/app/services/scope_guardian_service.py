from sqlalchemy.orm import Session
from backend.app.services.project_service import get_project_context_for_ai
from backend.app.services.ai_service import generate_json_analysis
from backend.app.prompts.scope_guardian import SCOPE_GUARDIAN_SYSTEM_PROMPT, build_scope_guardian_prompt

def analyze_scope(db: Session, project_id: int) -> dict:
    project_data = get_project_context_for_ai(db, project_id)
    if not project_data:
        return {"error": "Project not found"}
        
    prompt = build_scope_guardian_prompt(project_data)
    result = generate_json_analysis(SCOPE_GUARDIAN_SYSTEM_PROMPT, prompt)
    
    # Fallback to mock data if AI fails
    if not result:
        return {
            "scope_health_score": 85,
            "requirement_coverage_percent": 80,
            "missing_features": ["Authentication (Mock)"],
            "unplanned_features": ["Dark Mode (Mock)"],
            "incomplete_modules": ["Payment (Mock)"],
            "scope_drift_detected": True,
            "drift_details": "AI analysis failed, showing mock data.",
            "requirements": project_data.get("scopes", [])
        }
        
    return result
