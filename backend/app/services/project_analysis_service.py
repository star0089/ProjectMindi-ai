from sqlalchemy.orm import Session
import json
from backend.app.services.project_service import get_project_context_for_ai
from backend.app.services.ai_service import generate_json_analysis

PROJECT_INTELLIGENCE_PROMPT = """
You are an expert Project Manager AI Assistant.
The user is asking a natural language question about their project.
Use the provided project data context to answer accurately. Never hallucinate.

Return ONLY valid JSON with this exact structure:
{
  "answer": "Your detailed answer based on project data."
}
"""

def answer_project_question(db: Session, project_id: int, question: str) -> dict:
    project_data = get_project_context_for_ai(db, project_id)
    if not project_data:
        return {"answer": "Project not found."}
        
    prompt = f"Project Data:\n{json.dumps(project_data, indent=2)}\n\nQuestion: {question}"
    result = generate_json_analysis(PROJECT_INTELLIGENCE_PROMPT, prompt)
    
    if not result or "answer" not in result:
        return {"answer": "I'm sorry, I couldn't process the project data to answer your question at this time."}
    
    return result
