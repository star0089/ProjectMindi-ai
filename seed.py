import os
import sys
from datetime import date, datetime, timedelta

# Add project root to sys.path so backend modules can be resolved
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.app.database.connection import SessionLocal, Base, engine
from backend.app.models.project import Project
from backend.app.models.task import Task
from backend.app.models.milestone import Milestone
from backend.app.models.scope import Scope
from backend.app.models.risk import Risk
from backend.app.models.team import TeamMember, Workload
from backend.app.models.notification import Notification
from backend.app.models.activity import ActivityLog

def seed_database():
    print("Re-creating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    today = date.today()

    print("Seeding Team Members...")
    team_members_data = [
        {"name": "Sarah Chen", "role": "Lead Architect", "avatar": "SC", "email": "sarah.chen@projectpilot.ai", "skills": "System Architecture, Python, FastAPI, AWS"},
        {"name": "Alex Rivera", "role": "Senior Frontend Developer", "avatar": "AR", "email": "alex.rivera@projectpilot.ai", "skills": "React, TypeScript, TailwindCSS, Vite"},
        {"name": "Marcus Johnson", "role": "Backend Engineer", "avatar": "MJ", "email": "marcus.j@projectpilot.ai", "skills": "Python, PostgreSQL, Redis, REST APIs"},
        {"name": "Elena Rostova", "role": "AI / ML Engineer", "avatar": "ER", "email": "elena.r@projectpilot.ai", "skills": "PyTorch, Vector Search, LLMs, Gemini"},
        {"name": "David Kim", "role": "DevOps Engineer", "avatar": "DK", "email": "david.kim@projectpilot.ai", "skills": "Kubernetes, Docker, Terraform, CI/CD"},
        {"name": "Priya Patel", "role": "Product Manager", "avatar": "PP", "email": "priya.p@projectpilot.ai", "skills": "Agile, Product Strategy, PRDs, Roadmap"},
    ]

    team_instances = []
    for tm in team_members_data:
        member = TeamMember(**tm)
        db.add(member)
        team_instances.append(member)
    db.commit()

    print("Seeding Team Workloads...")
    workload_configs = [
        {"tasks_count": 8, "completed_tasks": 5, "pending_tasks": 3, "overdue_tasks": 0, "workload_percentage": 75},
        {"tasks_count": 10, "completed_tasks": 6, "pending_tasks": 4, "overdue_tasks": 1, "workload_percentage": 85},
        {"tasks_count": 7, "completed_tasks": 4, "pending_tasks": 3, "overdue_tasks": 0, "workload_percentage": 65},
        {"tasks_count": 6, "completed_tasks": 3, "pending_tasks": 3, "overdue_tasks": 0, "workload_percentage": 60},
        {"tasks_count": 9, "completed_tasks": 5, "pending_tasks": 4, "overdue_tasks": 1, "workload_percentage": 80},
        {"tasks_count": 5, "completed_tasks": 4, "pending_tasks": 1, "overdue_tasks": 0, "workload_percentage": 45},
    ]

    for idx, tm in enumerate(team_instances):
        cfg = workload_configs[idx]
        db.add(Workload(
            member_id=tm.id,
            tasks_count=cfg["tasks_count"],
            completed_tasks=cfg["completed_tasks"],
            pending_tasks=cfg["pending_tasks"],
            overdue_tasks=cfg["overdue_tasks"],
            workload_percentage=cfg["workload_percentage"]
        ))
    db.commit()

    print("Seeding Projects...")
    p1 = Project(
        name="AI E-Commerce Platform",
        description="Next-generation headless e-commerce storefront with autonomous AI recommendation engine, real-time vector inventory search, and automated checkout.",
        status="active",
        deadline=today + timedelta(days=60)
    )
    p2 = Project(
        name="Enterprise Cloud Migration",
        description="Migrating legacy monolith web infrastructure to cloud-native Kubernetes clusters, implementing zero-trust security and multi-region failover.",
        status="active",
        deadline=today + timedelta(days=90)
    )
    p3 = Project(
        name="Smart Health Analytics Portal",
        description="HIPAA-compliant patient telemetry analytics platform providing real-time vital metrics, predictive diagnostics, and clinical dashboarding.",
        status="active",
        deadline=today + timedelta(days=45)
    )

    db.add_all([p1, p2, p3])
    db.commit()
    for p in [p1, p2, p3]:
        db.refresh(p)

    print("Seeding Milestones...")
    milestones = [
        # Project 1 Milestones
        Milestone(project_id=p1.id, title="Core Platform Architecture", deadline=today - timedelta(days=15), completed=True),
        Milestone(project_id=p1.id, title="Auth & Payment Gateway Integration", deadline=today - timedelta(days=2), completed=True),
        Milestone(project_id=p1.id, title="AI Recommendation Engine MVP", deadline=today + timedelta(days=15), completed=False),
        Milestone(project_id=p1.id, title="Beta Launch & Load Testing", deadline=today + timedelta(days=45), completed=False),

        # Project 2 Milestones
        Milestone(project_id=p2.id, title="Infrastructure Audit & Containerization", deadline=today - timedelta(days=10), completed=True),
        Milestone(project_id=p2.id, title="Database Migration to Postgres Cloud", deadline=today + timedelta(days=20), completed=False),
        Milestone(project_id=p2.id, title="CI/CD GitOps Pipeline", deadline=today + timedelta(days=50), completed=False),

        # Project 3 Milestones
        Milestone(project_id=p3.id, title="HIPAA Compliance & Data Encryption", deadline=today - timedelta(days=5), completed=True),
        Milestone(project_id=p3.id, title="Real-Time Telemetry Pipeline", deadline=today + timedelta(days=10), completed=False),
        Milestone(project_id=p3.id, title="Clinical Dashboard UI", deadline=today + timedelta(days=35), completed=False),
    ]
    db.add_all(milestones)
    db.commit()

    print("Seeding Scopes...")
    scopes = [
        # Project 1 Scopes
        Scope(project_id=p1.id, requirement="OAuth2 SSO Integration (Google & GitHub)", status="implemented", notes="Implemented via Auth0 provider."),
        Scope(project_id=p1.id, requirement="Personalized Recommendation Pipeline", status="in_scope", notes="ML model training underway."),
        Scope(project_id=p1.id, requirement="Stripe Subscription & One-Time Payments", status="implemented", notes="Webhooks verified."),
        Scope(project_id=p1.id, requirement="Real-Time Inventory WebSockets", status="pending_review", notes="Architecture proposal submitted."),
        Scope(project_id=p1.id, requirement="Native Mobile Apps (iOS/Android)", status="out_of_scope", notes="Deferred to Phase 2 roadmap."),

        # Project 2 Scopes
        Scope(project_id=p2.id, requirement="Zero-Downtime Database Migration", status="in_scope", notes="pg_dump and replication streams configured."),
        Scope(project_id=p2.id, requirement="Kubernetes Multi-Region Cluster", status="in_scope", notes="Helm charts created."),
        Scope(project_id=p2.id, requirement="Legacy Code Refactoring", status="out_of_scope", notes="Excluded from cloud migration scope."),

        # Project 3 Scopes
        Scope(project_id=p3.id, requirement="End-to-End Vital Data Encryption", status="implemented", notes="AES-256 at rest and TLS 1.3 in transit."),
        Scope(project_id=p3.id, requirement="Predictive Anomaly Detection Model", status="in_scope", notes="Dataset sanitized."),
    ]
    db.add_all(scopes)
    db.commit()

    print("Seeding Risks...")
    risks = [
        # Project 1 Risks
        Risk(project_id=p1.id, title="GPU Instance Shortage for ML Training", severity="high", status="identified", description="Cloud provider quota limits delaying vector embedding generation. Mitigation: Fallback to CPU-optimized cluster."),
        Risk(project_id=p1.id, title="Scope Creep from Dynamic Pricing Request", severity="medium", status="identified", description="Stakeholders requested real-time dynamic pricing model not in original PRD."),
        Risk(project_id=p1.id, title="Third-Party Payment Webhook Failures", severity="medium", status="mitigated", description="Intermittent 500 errors on sandbox endpoint. Mitigation: Added exponential backoff retry worker queue."),

        # Project 2 Risks
        Risk(project_id=p2.id, title="Downtime During Primary Database Cutover", severity="critical", status="identified", description="Large data volume requires carefully timed window. Mitigation: Blue-green replication setup."),
        Risk(project_id=p2.id, title="Kubernetes Cluster Cost Overruns", severity="medium", status="mitigated", description="Auto-scaling max limits defined to avoid billing spikes."),

        # Project 3 Risks
        Risk(project_id=p3.id, title="HIPAA Audit Certification Bottleneck", severity="high", status="identified", description="External auditor review turnaround taking 3 weeks instead of 1 week."),
        Risk(project_id=p3.id, title="High Telemetry Streaming Latency", severity="low", status="mitigated", description="Optimized Kafka consumer batching to achieve under 50ms latency."),
    ]
    db.add_all(risks)
    db.commit()

    print("Seeding 50 Realistic Tasks...")
    task_titles_p1 = [
        ("Setup FastAPI Backend Architecture", "Initialize FastAPI application with SQLAlchemy ORM and standard routing structure.", "critical", "done", "Sarah Chen", -25, -20),
        ("React + Tailwind Scaffold", "Configure Vite build pipeline, Tailwind setup, and base app layout.", "high", "done", "Alex Rivera", -25, -21),
        ("Database Schema Design & Migrations", "Design PostgreSQL tables for users, products, orders, and AI embeddings.", "critical", "done", "Sarah Chen", -20, -17),
        ("OAuth2 User Authentication", "Implement JWT validation, Auth0 login integration, and user profile management.", "high", "done", "Marcus Johnson", -18, -14),
        ("Stripe Payment Webhook Processing", "Configure webhook listeners for checkout.session.completed and invoice.payment_failed.", "critical", "done", "Marcus Johnson", -12, -8),
        ("Product Catalog REST API", "Implement CRUD operations, filtering, pagination, and sorting for items.", "medium", "done", "Alex Rivera", -10, -5),
        ("Vector Search Integration with Qdrant", "Build vector indexing pipeline for semantic product recommendations.", "high", "in_progress", "Elena Rostova", -5, 3),
        ("Shopping Cart State Management", "Build persistent local shopping cart with optimistic UI updates.", "medium", "done", "Alex Rivera", -8, -3),
        ("AI Recommendation Filtering Engine", "Construct cosine similarity query endpoint for user recommendation feed.", "high", "in_progress", "Elena Rostova", -4, 5),
        ("Order History & Invoice Generation", "Generate automated PDF receipts and display customer order history.", "medium", "in_progress", "Marcus Johnson", -2, 4),
        ("Redis Cache Layer for Catalog Querying", "Add redis caching layer to eliminate redundant DB reads on popular products.", "medium", "todo", "David Kim", 1, 6),
        ("Dark Mode Refinement & Color Tokens", "Refine CSS dark theme, contrast ratios, and design system variables.", "low", "in_progress", "Alex Rivera", 0, 3),
        ("Checkout UI Component Polish", "Add step-by-step wizard for payment method selection and delivery details.", "high", "todo", "Alex Rivera", 2, 7),
        ("Load Testing with Locust (10k RPS)", "Simulate high concurrent user traffic during flash sale scenarios.", "high", "todo", "David Kim", 5, 10),
        ("CI/CD Pipeline via GitHub Actions", "Automate linting, unit testing, and Docker image publishing to ECR.", "medium", "done", "David Kim", -15, -12),
        ("Admin Inventory Dashboard", "Build management table for stock levels, price updates, and SKU imports.", "medium", "todo", "Priya Patel", 4, 9),
        ("Email Notification Gateway", "Integrate SendGrid transactional emails for order confirmations.", "low", "todo", "Marcus Johnson", 6, 11),
        ("User Review & Rating System", "Allow verified purchasers to leave star reviews and text feedback.", "low", "todo", "Alex Rivera", 8, 14),
    ]

    task_titles_p2 = [
        ("Containerize Legacy Services", "Write optimized Dockerfiles for 12 monolithic micro-services.", "critical", "done", "David Kim", -30, -22),
        ("Kubernetes Terraform Module", "Provision EKS clusters across US-East and EU-West regions using Terraform.", "critical", "done", "David Kim", -22, -15),
        ("Helm Chart Standardization", "Standardize ingress, service, and deployment templates across services.", "high", "done", "David Kim", -15, -10),
        ("PostgreSQL Multi-Region Replication", "Configure streaming physical replication with automatic failover cluster.", "critical", "in_progress", "Sarah Chen", -8, 4),
        ("Zero-Trust Service Mesh (Istio)", "Implement mTLS encryption between intra-cluster pod communications.", "high", "in_progress", "David Kim", -5, 5),
        ("Log Aggregation with Grafana Loki", "Centralize container stdout logs into searchable Grafana dashboards.", "medium", "done", "David Kim", -12, -7),
        ("Prometheus Monitoring & Alerting", "Set up CPU/RAM memory usage alerts and pager alerts.", "high", "in_progress", "David Kim", -3, 3),
        ("API Gateway Route Migration", "Migrate legacy NGINX routing rules to Kong API Gateway.", "high", "todo", "Sarah Chen", 2, 8),
        ("Secrets Management with HashiCorp Vault", "Remove hardcoded credentials and inject runtime secrets via Vault.", "critical", "in_progress", "Marcus Johnson", -2, 4),
        ("Disaster Recovery Simulation", "Perform simulated region outage to verify automated DNS failover.", "high", "todo", "David Kim", 10, 15),
        ("Vulnerability Scanning in Container Pipeline", "Integrate Trivy container vulnerability scanner into build pipeline.", "medium", "done", "David Kim", -18, -14),
        ("IAM Policy Least-Privilege Audit", "Restrict AWS IAM roles and service account permissions.", "medium", "todo", "Sarah Chen", 4, 9),
        ("Legacy Database Storage Cleanup", "Purge 5+ years of temporary session tables prior to migration.", "low", "done", "Marcus Johnson", -10, -6),
        ("Network Topology Security Audit", "Verify security group ingress restrictions and private subnet routing.", "medium", "todo", "Sarah Chen", 7, 12),
        ("Staging Environment Parity Check", "Ensure staging k8s environment matches production manifests.", "low", "todo", "Priya Patel", 5, 8),
        ("Cutover Playbook Documentation", "Write step-by-step minute-by-minute deployment procedure for cutover weekend.", "high", "todo", "Priya Patel", 12, 16),
    ]

    task_titles_p3 = [
        ("HIPAA Security Policy Specification", "Document technical safeguards, audit controls, and encryption standards.", "critical", "done", "Priya Patel", -20, -15),
        ("Patient Telemetry Ingestion API", "Build high-throughput FastAPI endpoint for wearable heart rate streams.", "critical", "done", "Marcus Johnson", -15, -10),
        ("Time-Series Data Pipeline (TimescaleDB)", "Set up hypertable partitioning for millions of vital sensor data points.", "critical", "done", "Sarah Chen", -12, -6),
        ("Patient Vital Sign Dashboard UI", "Build real-time SVG charting components for ECG signals.", "high", "in_progress", "Alex Rivera", -5, 2),
        ("Predictive Arrhythmia Detection ML Model", "Train XGBoost classifier on historical telemetry dataset.", "critical", "in_progress", "Elena Rostova", -8, 5),
        ("Clinical Alert Notification Engine", "Trigger immediate SMS/Push alerts to medical staff when vitals cross thresholds.", "critical", "in_progress", "Marcus Johnson", -3, 3),
        ("Medical EHR Data Exporter (FHIR Format)", "Support export of patient records compliant with HL7 FHIR standards.", "high", "todo", "Marcus Johnson", 3, 9),
        ("Doctor Annotation & Prescription Interface", "Build modal view for clinicians to enter notes and update treatments.", "medium", "todo", "Alex Rivera", 4, 8),
        ("Audit Log Immutable Ledger", "Store clinical data access logs in an append-only audit trail for compliance.", "high", "done", "Sarah Chen", -10, -7),
        ("Patient Mobile Portal Integration", "Expose secure REST APIs for patient mobile app consumption.", "medium", "todo", "Marcus Johnson", 6, 12),
        ("Data Anonymization Pipeline for Research", "Strip Patient Health Information (PHI) before feeding data to research DB.", "high", "todo", "Elena Rostova", 8, 14),
        ("Emergency Room Telemetry Wall Screen", "Build full-screen multi-patient monitor view for ER nurses.", "medium", "todo", "Alex Rivera", 7, 11),
        ("End-to-End Integration Testing", "Write Cypress E2E tests for clinical workflow and alert triggers.", "high", "todo", "Alex Rivera", 10, 15),
        ("HIPAA Third-Party Security Audit", "Provide system access and architectural documentation to external auditor.", "critical", "todo", "Priya Patel", 12, 18),
        ("System Performance Tuning for 50k Devices", "Optimize WebSocket broker connections for scaling telemetry throughput.", "high", "todo", "David Kim", 14, 20),
        ("User Role-Based Access Control (RBAC)", "Enforce Nurse, Doctor, Admin, and Patient data visibility boundaries.", "critical", "done", "Sarah Chen", -14, -9),
    ]

    all_task_defs = [
        (p1.id, task_titles_p1),
        (p2.id, task_titles_p2),
        (p3.id, task_titles_p3)
    ]

    created_tasks = []
    for pid, task_list in all_task_defs:
        for title, desc, prio, st, assignee, start_off, end_off in task_list:
            task_obj = Task(
                project_id=pid,
                title=title,
                description=desc,
                priority=prio,
                status=st,
                assignee=assignee,
                start_date=today + timedelta(days=start_off),
                end_date=today + timedelta(days=end_off)
            )
            db.add(task_obj)
            created_tasks.append(task_obj)

    db.commit()
    print(f"Successfully generated {len(created_tasks)} tasks across 3 projects!")

    print("Seeding Activity Logs...")
    activities = [
        ActivityLog(entity_type="Milestone", entity_id=1, action="completed milestone", details="Sarah Chen completed milestone: Core Platform Architecture", timestamp=datetime.now() - timedelta(hours=4)),
        ActivityLog(entity_type="Task", entity_id=12, action="updated task status", details="Alex Rivera moved task to In Progress: Dark Mode Refinement", timestamp=datetime.now() - timedelta(hours=3)),
        ActivityLog(entity_type="Risk", entity_id=1, action="created risk item", details="Elena Rostova logged GPU Instance Shortage risk", timestamp=datetime.now() - timedelta(hours=2)),
        ActivityLog(entity_type="Task", entity_id=5, action="completed task", details="Marcus Johnson finished Stripe Payment Webhook Processing", timestamp=datetime.now() - timedelta(hours=1)),
        ActivityLog(entity_type="Project", entity_id=2, action="deployed staging environment", details="David Kim published Kubernetes EKS Cluster v1.2", timestamp=datetime.now() - timedelta(minutes=25)),
    ]
    db.add_all(activities)

    print("Seeding System Notifications...")
    notifications = [
        Notification(title="AI Risk Alert", content="High priority risk detected: GPU Instance Shortage for ML Training.", type="risk", is_read=0),
        Notification(title="Milestone Achieved", content="Project 'AI E-Commerce Platform' achieved milestone: Core Platform Architecture.", type="milestone", is_read=0),
        Notification(title="Task Assigned", content="Alex Rivera was assigned 'Checkout UI Component Polish'.", type="task", is_read=1),
        Notification(title="Scope Guardian Warning", content="Unplanned feature 'Dynamic Pricing' pending scope approval.", type="scope", is_read=0),
    ]
    db.add_all(notifications)

    db.commit()
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
