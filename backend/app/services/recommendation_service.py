from sqlalchemy.orm import Session
from backend.app.services.project_service import get_project_context_for_ai
from backend.app.services.ai_service import generate_json_analysis
from backend.app.prompts.recommendation_prompt import RECOMMENDATION_SYSTEM_PROMPT, build_recommendation_prompt

def generate_recommendations(db: Session, project_id: int) -> dict:
    project_data = get_project_context_for_ai(db, project_id)
    if not project_data:
        return {"error": "Project not found"}
        
    prompt = build_recommendation_prompt(project_data)
    result = generate_json_analysis(RECOMMENDATION_SYSTEM_PROMPT, prompt)
    
    if not result:
        return {
            "recommendations": [
                {
                    "action": "Review API",
                    "target": "AI Engine",
                    "reason": "AI recommendations failed to generate."
                }
            ]
        }
    return result
