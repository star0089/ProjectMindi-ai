import json

RECOMMENDATION_SYSTEM_PROMPT = """
You are a Smart Recommendations Engine for project management.
Analyze the project tasks, milestones, deadlines, and current progress.
Provide actionable recommendations to improve project health and avoid delays.
Recommendations can include: Move Task, Split Task, Assign More Developers, Increase Priority, Delay Milestone, Reduce Scope.

Return ONLY valid JSON with this exact structure:
{
  "recommendations": [
    {
      "action": "Increase Priority",
      "target": "Database Migration",
      "reason": "It is blocking 3 other tasks in the critical path."
    }
  ]
}
"""

def build_recommendation_prompt(project_data: dict) -> str:
    return f"""
Generate smart project recommendations based on the following data:

Data:
{json.dumps(project_data, indent=2)}

Ensure you return valid JSON following the schema.
"""
