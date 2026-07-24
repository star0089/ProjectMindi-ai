# ProjectPilot AI — REST API Reference Documentation

This document provides complete documentation for the RESTful endpoints exposed by the **ProjectPilot AI** FastAPI backend service.

---

## Base URLs
- **Local Development**: `http://localhost:8000`
- **Production (Render)**: `https://projectpilot-backend.onrender.com`
- **Interactive OpenAPI Specs**: `/docs` (Swagger UI) or `/redoc` (ReDoc)

---

## System Endpoints

### Health Check
- `GET /`
- **Response**:
  ```json
  {
    "status": "online",
    "app": "ProjectPilot AI",
    "version": "1.0.0",
    "environment": "development",
    "documentation": "/docs"
  }
  ```

---

## Projects Management

### List All Projects
- `GET /projects`
- **Query Params**: `search` (string), `status` (string), `sort_by` (string)
- **Response**: Array of `Project` objects.

### Create Project
- `POST /projects`
- **Request Body**:
  ```json
  {
    "name": "AI E-Commerce Platform",
    "description": "Next-gen storefront with AI recommendations",
    "status": "active",
    "deadline": "2026-10-01"
  }
  ```

### Get Project Details
- `GET /projects/{id}`

### Update Project
- `PUT /projects/{id}`

### Delete Project
- `DELETE /projects/{id}`

---

## Task Management

### List Tasks
- `GET /tasks`
- **Query Params**: `project_id`, `status`, `priority`, `search`, `assignee`

### Create Task
- `POST /tasks`
- **Request Body**:
  ```json
  {
    "project_id": 1,
    "title": "OAuth2 SSO Integration",
    "description": "Integrate Auth0 providers",
    "priority": "high",
    "status": "in_progress",
    "assignee": "Marcus Johnson",
    "start_date": "2026-07-01",
    "end_date": "2026-07-28"
  }
  ```

### Update Task Status
- `PATCH /tasks/{id}/status`
- **Request Body**: `{ "status": "done" }`

---

## Scope & Risk Guardian

### Get Scope Analysis
- `GET /scope?project_id=1`
- **Response**:
  ```json
  {
    "project_id": 1,
    "scope_alignment_score": 85,
    "total_requirements": 5,
    "implemented_requirements": 3,
    "drift_detected": false,
    "requirements": []
  }
  ```

### Get Risk Assessment
- `GET /risk?project_id=1`
- **Response**:
  ```json
  {
    "project_id": 1,
    "overall_risk_status": "medium",
    "active_risks_count": 2,
    "mitigated_risks_count": 1,
    "risks": []
  }
  ```

---

## AI Intelligence Features

### AI Assistant Chat
- `POST /chat`
- **Request Body**:
  ```json
  {
    "project_id": 1,
    "question": "What tasks are currently blocking our beta release?"
  }
  ```

### Generate Project Plan
- `POST /planning/generate`
- **Request Body**:
  ```json
  {
    "name": "Smart Analytics Portal",
    "description": "Build telemetry pipeline",
    "deadline": "2026-11-01",
    "team_size": "5",
    "tech_preference": "FastAPI + React"
  }
  ```

### Project Health Score
- `GET /insights/health?project_id=1`

### AI Standup Summary
- `GET /insights/standup?project_id=1`

### AI Executive Summary
- `GET /insights/executive-summary?project_id=1`
