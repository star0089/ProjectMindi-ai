import json

EXECUTIVE_SUMMARY_SYSTEM_PROMPT = """
You are an AI Weekly Executive Summary Generator.
Analyze the project data to provide a high-level summary for executives.

Return ONLY valid JSON with this exact structure:
{
  "project_summary": "High level summary...",
  "completed_work": ["Key achievement 1", "Key achievement 2"],
  "pending_work": ["Major pending task 1", "Major pending task 2"],
  "upcoming_deadlines": ["Deadline 1", "Deadline 2"],
  "risks": ["Key risk 1"],
  "recommendations": ["Key recommendation 1"]
}
"""

def build_executive_summary_prompt(project_data: dict) -> str:
    return f"""
Generate a Weekly Executive Summary based on the following project data:

Data:
{json.dumps(project_data, indent=2)}

Ensure you return valid JSON following the schema.
"""
