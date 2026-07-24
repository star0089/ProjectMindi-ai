# ProjectPilot AI — Repository Directory Structure

This document outlines the codebase folder layout and architectural boundaries of **ProjectPilot AI**.

```
ProjectMind-ai/
├── .env.example                # Root environment variables template
├── render.yaml                 # Render deployment configuration manifest
├── seed.py                     # Realistic demo database seeding script
├── README.md                   # Primary project submission & setup guide
│
├── backend/                    # FastAPI Backend Application
│   ├── requirements.txt        # Python package dependencies (FastAPI, SQLAlchemy, psycopg2, Gemini)
│   └── app/
│       ├── main.py             # FastAPI entrypoint, middleware, exception handlers
│       ├── core/
│       │   ├── __init__.py
│       │   └── config.py       # Pydantic-settings environment configuration
│       ├── database/
│       │   ├── __init__.py
│       │   └── connection.py   # SQLAlchemy engine & session factory (SQLite & Postgres)
│       ├── models/             # SQLAlchemy ORM Data Models
│       │   ├── project.py
│       │   ├── task.py
│       │   ├── milestone.py
│       │   ├── scope.py
│       │   ├── risk.py
│       │   ├── team.py
│       │   ├── notification.py
│       │   ├── activity.py
│       │   └── ...
│       ├── routers/            # FastAPI Modular REST Route Handlers
│       │   ├── projects.py
│       │   ├── tasks.py
│       │   ├── milestones.py
│       │   ├── dashboard.py
│       │   ├── scope.py
│       │   ├── risk.py
│       │   ├── chat.py
│       │   ├── planning.py
│       │   ├── insights.py
│       │   └── ...
│       ├── schemas/            # Pydantic Request/Response DTO Schemas
│       └── services/           # Business Logic & Gemini AI Service Integrations
│
├── frontend/                   # React + Vite + TypeScript Frontend Application
│   ├── vercel.json             # Vercel SPA routing configuration
│   ├── package.json            # NPM dependencies & scripts
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── vite.config.ts          # Vite build configuration
│   └── src/
│       ├── App.tsx             # React router configuration with lazy code-splitting
│       ├── main.tsx            # DOM root entrypoint
│       ├── index.css           # Global CSS design tokens and theme variables
│       ├── components/
│       │   ├── common/         # ErrorBoundary, EmptyState, LoadingSkeleton, NetworkStatus
│       │   ├── layout/         # Sidebar, Navbar, PageLayout
│       │   ├── dashboard/      # Dashboard metric cards & charts
│       │   └── ...
│       ├── pages/              # View pages (Dashboard, Projects, TaskBoard, ScopeGuardian, RiskCenter, etc.)
│       ├── services/           # Axios REST API Client & Interceptors (api.ts)
│       ├── hooks/              # Custom hooks (useTheme, useToast)
│       └── types/              # TypeScript interfaces and domain schemas
│
└── docs/                       # Project Documentation & Specifications
    ├── ARCHITECTURE.md         # System Architecture & Diagram
    ├── ER_DIAGRAM.md           # Database Schema ERD Diagram
    ├── FOLDER_STRUCTURE.md     # Code Directory Layout Guide (this document)
    └── API_DOCS.md             # REST API Endpoint Documentation
```
