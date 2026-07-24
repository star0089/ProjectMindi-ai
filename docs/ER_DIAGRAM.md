# ProjectPilot AI — Database Schema & Entity Relationship Diagram

This document describes the complete relational database schema for **ProjectPilot AI**, compatible with both SQLite and PostgreSQL.

---

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    PROJECTS ||--o{ TASKS : "contains"
    PROJECTS ||--o{ MILESTONES : "tracks"
    PROJECTS ||--o{ SCOPES : "defines"
    PROJECTS ||--o{ RISKS : "identifies"
    PROJECTS ||--o{ CHAT_HISTORIES : "records"
    TEAM_MEMBERS ||--o| WORKLOADS : "has"

    PROJECTS {
        int id PK
        string name
        text description
        string status
        date deadline
    }

    TASKS {
        int id PK
        int project_id FK
        string title
        text description
        string priority
        string status
        string assignee
        date start_date
        date end_date
    }

    MILESTONES {
        int id PK
        int project_id FK
        string title
        date deadline
        boolean completed
    }

    SCOPES {
        int id PK
        int project_id FK
        string requirement
        string status
        text notes
    }

    RISKS {
        int id PK
        int project_id FK
        string title
        string severity
        string status
        text description
    }

    TEAM_MEMBERS {
        int id PK
        string name
        string email
        string role
        string avatar
        string skills
    }

    WORKLOADS {
        int id PK
        int member_id FK
        int tasks_count
        int completed_tasks
        int pending_tasks
        int overdue_tasks
        int workload_percentage
    }

    NOTIFICATIONS {
        int id PK
        string title
        text content
        string type
        int is_read
        datetime timestamp
    }

    ACTIVITY_LOGS {
        int id PK
        string entity_type
        int entity_id
        string action
        text details
        datetime timestamp
    }
```

---

## Entity Descriptions

- **PROJECTS**: Core project container tracking name, scope description, overall status (`active`, `completed`, `on_hold`), and target deadline.
- **TASKS**: Granular work items mapped to projects, priority (`critical`, `high`, `medium`, `low`), execution status (`todo`, `in_progress`, `review`, `done`), assignee, and timeline dates.
- **MILESTONES**: Key deliverable checkpoints with completion flags.
- **SCOPES**: Requirements baseline tracking implemented features vs out-of-scope/drift items.
- **RISKS**: Risk management matrix cataloging identified hazards, severity levels, and mitigation notes.
- **TEAM_MEMBERS & WORKLOADS**: Team roster tracking role responsibilities, active task loads, and percentage utilization.
- **NOTIFICATIONS & ACTIVITY_LOGS**: Real-time event streams and audit trails.
