import json

STANDUP_SYSTEM_PROMPT = """
You are an AI Daily Standup Generator.
Analyze the project tasks (completed yesterday, pending, etc.) and generate a professional daily standup report.

Return ONLY valid JSON with this exact structure:
{
  "yesterday": ["Completed Task A", "Completed Task B"],
  "today": ["Recommended Task C", "Recommended Task D"],
  "blockers": ["Blocker E"],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "expected_completion": "End of week (Friday)"
}
"""

def build_standup_prompt(project_data: dict) -> str:
    return f"""
Generate a Daily Standup Report based on the following project data:

Data:
{json.dumps(project_data, indent=2)}

Ensure you return valid JSON following the schema.
"""
