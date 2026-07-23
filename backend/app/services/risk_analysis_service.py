from sqlalchemy.orm import Session
from backend.app.services.project_service import get_project_context_for_ai
from backend.app.services.ai_service import generate_json_analysis
from backend.app.prompts.risk_prediction import RISK_PREDICTION_SYSTEM_PROMPT, build_risk_prediction_prompt

def predict_risks(db: Session, project_id: int) -> dict:
    project_data = get_project_context_for_ai(db, project_id)
    if not project_data:
        return {"error": "Project not found"}
        
    prompt = build_risk_prediction_prompt(project_data)
    result = generate_json_analysis(RISK_PREDICTION_SYSTEM_PROMPT, prompt)
    
    if not result:
        return {
            "overall_risk_status": "Medium",
            "active_risks_count": 1,
            "mitigated_risks_count": 0,
            "risks": [
                {
                    "title": "AI Offline (Mock)",
                    "severity": "medium",
                    "status": "identified",
                    "description": "AI analysis is offline.",
                    "mitigation_plan": "Check API keys."
                }
            ],
            "explanations": "AI fallback mock."
        }
        
    return result
