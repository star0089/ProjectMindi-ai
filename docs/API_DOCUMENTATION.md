# ProjectPilot AI — API Reference & OpenAPI Specification

This document provides a comprehensive REST API reference for **ProjectPilot AI**, including endpoints for project management, AI PRD scope auditing, predictive risk telemetry, interactive recommendations, and real-time notifications.

---

## Base Endpoints

- **Production API**: `https://projectmindi-ai.onrender.com`
- **Local Development**: `http://localhost:8000`
- **Interactive Swagger Docs**: `https://projectmindi-ai.onrender.com/docs`

---

## 1. System & Health

### `GET /`
Returns backend API health status, version, and environment.

**Response `200 OK`**:
```json
{
  "status": "online",
  "app": "ProjectPilot AI",
  "version": "1.0.0",
  "environment": "production",
  "documentation": "/docs"
}
```

---

## 2. PRD & AI Scope Audit Engine (`/prd`)

### `POST /prd/parse`
Parses raw PRD text or markdown document into a structured `ProjectBlueprint`.

**Request Body**:
```json
{
  "project_id": 1,
  "document_text": "PRODUCT REQUIREMENT DOCUMENT...\n1. Core Auth SSO\n2. Stripe Payment Retry Queue...",
  "document_title": "AI E-Commerce PRD"
}
```

**Response `200 OK`**:
```json
{
  "project_title": "AI E-Commerce PRD",
  "objectives": ["Deliver production-ready auth and payment retry queue"],
  "functional_requirements": [
    {
      "id": 1,
      "title": "OAuth2 SSO Auth",
      "priority": "critical",
      "status": "implemented"
    }
  ]
}
```

### `POST /prd/audit`
Audits baseline PRD blueprint against active database tasks to compute Scope Alignment % and detect missing features / out-of-scope work.

**Request Body**:
```json
{
  "project_id": 1,
  "blueprint": {}
}
```

**Response `200 OK`**:
```json
{
  "project_id": 1,
  "scope_alignment_score": 94,
  "confidence_score": 95,
  "missing_features": ["Automated Payment Retry Worker Queue"],
  "unexpected_work": ["Dark Mode Refinement & Color Tokens"],
  "risk_score": "Medium",
  "strategic_recommendation": "Focus velocity on critical missing requirements."
}
```

---

## 3. Project Intelligence & Recommendations (`/insights`)

### `GET /insights/health`
Returns project health index, completion percentages, and milestone SLA metrics.

### `GET /insights/recommendations`
Returns structured evidence-backed recommendations.

**Response `200 OK`**:
```json
{
  "project_id": 1,
  "recommendations": [
    {
      "id": "rec-1",
      "observation": "Backend API milestone delayed by 4 days due to unassigned payment retry queue.",
      "reason": "Developer velocity allocated to non-essential dark mode styling.",
      "impact": "Beta launch milestone scheduled for 15 days out will slip by 4 business days.",
      "priority": "critical",
      "suggested_action": "Reassign Alex Rivera to Payment Retry Worker Queue.",
      "expected_benefit": "Recover 3 working days",
      "confidence_score": 95,
      "evidence_citations": ["PRD Section 3.2", "Task #5 Status: Done"]
    }
  ]
}
```

### `POST /insights/recommendations/apply`
Executes 1-click strategic recommendation action in database.

**Query Parameters**:
- `project_id`: `1`
- `recommendation_id`: `"rec-1"`

---

## 4. AI Assistant Chat (`/chat`)

### `POST /chat`
Submits a natural language project governance question to ProjectPilot AI.

**Request Body**:
```json
{
  "project_id": 1,
  "question": "What features are outside the PRD scope?"
}
```

---

## 5. Notification Center (`/notifications`)

### `GET /notifications`
Retrieves list of active notifications.

### `PATCH /notifications/{notif_id}/read`
Marks a specific notification as read.

### `POST /notifications/read-all`
Marks all user notifications as read.
