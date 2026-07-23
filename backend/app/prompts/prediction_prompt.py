import json

PREDICTION_SYSTEM_PROMPT = """
You are a Project Timeline Prediction Engine.
Analyze the project tasks, their status, deadlines, and dependencies.
Predict the project timeline, delays, required velocity, and sprint completion confidence.
Also detect any Dependency issues (Circular Dependencies, Missing Dependencies, Task Blocking).

Return ONLY valid JSON with this exact structure:
{
  "prediction": {
    "current_completion_date": "YYYY-MM-DD",
    "possible_delay_days": 5,
    "required_velocity": "High",
    "sprint_completion_confidence_percent": 80
  },
  "dependency_analysis": {
    "task_blocking": [{"task": "Task A", "blocking": ["Task B"]}],
    "circular_dependencies": [],
    "missing_dependencies": []
  }
}
"""

def build_prediction_prompt(project_data: dict) -> str:
    return f"""
Generate timeline predictions and dependency analysis based on the following data:

Data:
{json.dumps(project_data, indent=2)}

Ensure you return valid JSON following the schema.
"""
