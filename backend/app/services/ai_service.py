import os
import json
import logging
# pyrefly: ignore [missing-import]
import google.generativeai as genai
from typing import Dict, Any
from backend.app.schemas.planning import PlanGenerationRequest
from backend.app.prompts.project_planning_prompt import PROJECT_PLANNING_SYSTEM_PROMPT, build_planning_prompt

logger = logging.getLogger(__name__)

# Configure Gemini (Ensure GEMINI_API_KEY is set in env)
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

def generate_project_plan(request: PlanGenerationRequest) -> Dict[str, Any]:
    """
    Generates a structured JSON project plan using Gemini API.
    Includes a 1-retry fallback on failure.
    """
    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro",
        system_instruction=PROJECT_PLANNING_SYSTEM_PROMPT,
        generation_config={"response_mime_type": "application/json"}
    )
    
    prompt = build_planning_prompt(
        name=request.name,
        description=request.description,
        deadline=request.deadline,
        team_size=request.team_size,
        tech_preference=request.tech_preference
    )
    
    attempts = 2
    for attempt in range(attempts):
        try:
            response = model.generate_content(prompt)
            # The response text should be a JSON string since we requested application/json
            json_str = response.text.strip()
            
            # Parse and validate JSON structure
            plan_data = json.loads(json_str)
            return plan_data
            
        except Exception as e:
            logger.error(f"Gemini API failure (attempt {attempt + 1}/{attempts}): {e}")
            if attempt == attempts - 1:
                raise Exception(f"Failed to generate AI plan after {attempts} attempts. Error: {str(e)}")

def generate_json_analysis(system_instruction: str, prompt: str) -> Dict[str, Any]:
    """
    Generic method to generate structured JSON analysis using Gemini API.
    """
    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro",
        system_instruction=system_instruction,
        generation_config={"response_mime_type": "application/json"}
    )
    
    attempts = 2
    for attempt in range(attempts):
        try:
            response = model.generate_content(prompt)
            json_str = response.text.strip()
            
            # Remove any markdown code blocks if present
            if json_str.startswith("```json"):
                json_str = json_str[7:]
            if json_str.endswith("```"):
                json_str = json_str[:-3]
                
            return json.loads(json_str.strip())
            
        except Exception as e:
            logger.error(f"Gemini Analysis API failure (attempt {attempt + 1}/{attempts}): {e}")
            if attempt == attempts - 1:
                return {} # Fallback gracefully

