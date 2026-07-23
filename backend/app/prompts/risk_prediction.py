import json

RISK_PREDICTION_SYSTEM_PROMPT = """
You are an expert Risk Prediction Engine.
Analyze the provided Tasks, Deadlines, Progress, Blocked Tasks, Milestones, and Dependencies.
Predict risks for the project.

For each risk, provide:
- title
- severity (high, medium, low)
- status (identified, mitigated, triggered, resolved)
- description (clear explanation)
- mitigation_plan

Return ONLY valid JSON with this exact structure:
{
  "overall_risk_status": "High|Medium|Low",
  "active_risks_count": 3,
  "mitigated_risks_count": 1,
  "risks": [
    {
      "title": "Backend API delayed",
      "severity": "high",
      "status": "identified",
      "description": "Backend API is delayed which will block frontend integration.",
      "mitigation_plan": "Reassign developers to backend."
    }
  ],
  "explanations": "Overall explanation of project risk profile."
}
"""

def build_risk_prediction_prompt(project_data: dict) -> str:
    return f"""
Predict project risks based on the following data:

Data:
{json.dumps(project_data, indent=2)}

Ensure you return valid JSON following the schema.
"""
