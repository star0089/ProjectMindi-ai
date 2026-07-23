from sqlalchemy.orm import Session
from backend.app.services.project_service import get_project_context_for_ai
from backend.app.services.ai_service import generate_json_analysis
from backend.app.prompts.prediction_prompt import PREDICTION_SYSTEM_PROMPT, build_prediction_prompt

def generate_predictions(db: Session, project_id: int) -> dict:
    project_data = get_project_context_for_ai(db, project_id)
    if not project_data:
        return {"error": "Project not found"}
        
    prompt = build_prediction_prompt(project_data)
    result = generate_json_analysis(PREDICTION_SYSTEM_PROMPT, prompt)
    
    if not result:
        return {
            "prediction": {
                "current_completion_date": "Unknown",
                "possible_delay_days": 0,
                "required_velocity": "Unknown",
                "sprint_completion_confidence_percent": 0
            },
            "dependency_analysis": {
                "task_blocking": [],
                "circular_dependencies": [],
                "missing_dependencies": []
            }
        }
    return result
