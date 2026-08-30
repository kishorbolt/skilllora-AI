import datetime
from sqlalchemy.orm import Session
from app.models import (
    User, LearnerProfile, Skill, LearnerSkill, SkillEvidence, SkillHistory,
    Resource, Feedback, Roadmap, RoadmapPhase, RoadmapItem, Assessment, Question,
    AssessmentAttempt, Project, AIInsight, AdaptationEvent, CompletedCourse, InterestedResource,
    LearningActivity
)
from app.services.auth_service import AuthService

def seed_database(db: Session):
    # Check if already seeded with Kishor G
    demo_user = db.query(User).filter(User.email == "kishor.g@skillora.ai").first()
    if demo_user:
        if not demo_user.username:
            demo_user.username = "kishorg"
            db.commit()
        return

    # Clear any old legacy user records
    old_user = db.query(User).filter(User.email == "alex.morgan@pathforge.ai").first()
    if old_user:
        db.delete(old_user)
        db.commit()

    # 1. Base Skills
    skills_data = [
        ("Python", "Programming", "Core programming language for AI and data engineering", []),
        ("Statistics", "Mathematics", "Probability, statistical testing, and linear algebra", []),
        ("SQL", "Data Engineering", "Relational database querying and data modeling", []),
        ("React", "Frontend", "Modern UI component framework for web applications", []),
        ("Machine Learning", "AI Core", "Supervised, unsupervised, and ensemble learning methods", ["Python", "Statistics"]),
        ("Deep Learning", "AI Core", "Neural networks, CNNs, Transformers, and PyTorch", ["Machine Learning", "Statistics"]),
        ("NLP", "AI Application", "Natural language processing, embeddings, and LLMs", ["Deep Learning"]),
        ("Computer Vision", "AI Application", "Image processing, object detection, and segmentation", ["Deep Learning"]),
        ("MLOps", "Engineering", "Model deployment, monitoring, CI/CD, and feature stores", ["Machine Learning", "Python"]),
        ("Data Structures", "Engineering", "Algorithms, complexity analysis, and graph structures", ["Python"]),
        ("System Design", "Engineering", "Distributed systems, scalability, and microservices", ["Data Structures"]),
        ("Cloud", "Infrastructure", "AWS/GCP infrastructure, Kubernetes, and serverless", ["System Design"]),
        ("Data Visualization", "Analytics", "Matplotlib, Seaborn, and executive dashboarding", ["Python", "SQL"])
    ]

    skill_db_map = {}
    for name, cat, desc, prereqs in skills_data:
        existing = db.query(Skill).filter(Skill.name == name).first()
        if not existing:
            s = Skill(name=name, category=cat, description=desc, prerequisites_json=prereqs)
            db.add(s)
            db.flush()
            skill_db_map[name] = s
        else:
            skill_db_map[name] = existing

    # 2. Catalog Resources
    catalog = [
        ("Python for Data Science & AI", "Course", "Python", "Beginner", 120, ["Python"], "Video & Labs", True, "Master Python syntax, Pandas, and NumPy for machine learning data manipulation."),
        ("Applied Statistics & Hypothesis Testing", "Course", "Statistics", "Intermediate", 90, ["Statistics"], "Interactive", False, "Understand p-values, confidence intervals, and probability distributions."),
        ("SQL for Data Engineering", "Course", "SQL", "Intermediate", 75, ["SQL"], "Interactive", True, "Master complex JOINs, CTEs, and window functions."),
        ("Hands-On Machine Learning Masterclass", "Course", "Machine Learning", "Intermediate", 180, ["Python", "Statistics"], "Video & Project", True, "Scikit-Learn, decision trees, random forests, and gradient boosting."),
        ("Neural Network Fundamentals & PyTorch", "Course", "Deep Learning", "Intermediate", 150, ["Machine Learning"], "Interactive", True, "Build backpropagation from scratch and train dense neural networks."),
        ("Convolutional Neural Networks & Vision", "Course", "Computer Vision", "Advanced", 120, ["Deep Learning"], "Video & Labs", True, "Image classification with ResNet and object detection with YOLO."),
        ("Transformer Architecture & LLM Fine-Tuning", "Course", "NLP", "Advanced", 160, ["Deep Learning"], "Video & Project", True, "Attention mechanisms, HuggingFace, and PEFT fine-tuning."),
        ("Production MLOps & Model Serving", "Course", "MLOps", "Advanced", 140, ["Machine Learning", "Python"], "Interactive & Labs", True, "Deploy ML models with FastAPI, Docker, MLflow, and Kubernetes."),
        ("Python Data Structures & Algorithm Design", "Course", "Data Structures", "Intermediate", 90, ["Python"], "Coding Exercises", False, "Hash tables, trees, graphs, and dynamic programming."),
        ("Scalable System Design for AI Pipelines", "Course", "System Design", "Advanced", 110, ["System Design"], "Article & Video", False, "Design high-throughput vector databases and inference clusters."),
        ("15-Min Deep Learning Foundations Diagnostic", "Quiz", "Deep Learning", "Intermediate", 15, [], "Quiz", False, "Test vectorization, activation functions, and gradient descent concepts."),
        ("Scikit-Learn Model Evaluation Diagnostic", "Quiz", "Machine Learning", "Intermediate", 20, [], "Quiz", False, "Test cross-validation, ROC-AUC metrics, and bias-variance tradeoff.")
    ]

    resource_db_map = {}
    for title, rtype, sname, diff, dur, prereqs, fmt, is_proj, desc in catalog:
        sk = skill_db_map[sname]
        existing_r = db.query(Resource).filter(Resource.title == title).first()
        if not existing_r:
            res = Resource(
                skill_id=sk.id,
                title=title,
                type=rtype,
                difficulty=diff,
                duration_minutes=dur,
                prerequisites_json=prereqs,
                format=fmt,
                is_project_based=is_proj,
                description=desc
            )
            db.add(res)
            db.flush()
            resource_db_map[title] = res
        else:
            resource_db_map[title] = existing_r

    # 3. Create Demo User: KISHOR G
    user = User(
        username="kishorg",
        email="kishor.g@skillora.ai",
        name="KISHOR G",
        hashed_password=AuthService.hash_password("demo123"),
        is_demo=True
    )
    db.add(user)
    db.flush()

    profile = LearnerProfile(
        user_id=user.id,
        career_goal="AI Engineer",
        learning_objective="Master PyTorch, Deep Learning, and production MLOps to transition into an AI Engineer role.",
        experience_level="Intermediate",
        daily_study_hours=2.0,
        target_deadline="March 2027",
        preferred_format="Interactive & Project-based",
        confidence_level=75,
        current_streak=5,
        longest_streak=7,
        total_learning_days=14,
        last_active_date=datetime.datetime.utcnow(),
        bio="Passionate software engineer focused on machine learning systems, full-stack AI applications, and model deployment.",
        location="San Francisco, CA",
        current_role="Software Developer",
        target_role="AI Engineer",
        preferred_difficulty="Intermediate",
        weekly_availability="14 Hours / Week",
        linkedin_url="https://linkedin.com/in/kishorg",
        github_url="https://github.com/kishorg",
        portfolio_url="https://kishorg.dev",
        resume_url="/uploads/resumes/demo_kishor_resume.pdf",
        resume_filename="Kishor_G_AI_Resume.pdf",
        resume_filetype="application/pdf",
        resume_filesize="1.2 MB",
        resume_uploaded_at=datetime.datetime.utcnow() - datetime.timedelta(days=2),
        resume_analysis_status="analyzed",
        resume_insights_json={
            "detected_skills": [
                {"name": "Python", "level": "Advanced"},
                {"name": "PyTorch", "level": "Intermediate"},
                {"name": "Scikit-Learn", "level": "Intermediate"},
                {"name": "FastAPI", "level": "Intermediate"},
                {"name": "Docker", "level": "Intermediate"}
            ],
            "detected_roles": ["AI Engineer", "ML Engineer", "Software Developer"],
            "detected_projects": 3,
            "detected_certifications": 2
        },
        raw_onboarding_input="I want to become an AI Engineer by March 2027. I know Python well and Machine Learning basics, but I need deep learning and MLOps skills."
    )
    db.add(profile)
    db.flush()

    # 4. Seed Kishor G's Learner Skills
    # Python: 90% (Verified)
    ls_py = LearnerSkill(
        profile_id=profile.id,
        skill_id=skill_db_map["Python"].id,
        mastery=92.0,
        confidence=90.0,
        retention=94.0,
        practical_application=88.0,
        assessment_performance=90.0,
        learning_velocity=10.0,
        overall_score=90.0,
        has_enough_evidence=True,
        evidence_count=4,
        is_verified=True,
        source="evidence_based",
        level="Advanced",
        last_practiced=datetime.datetime.utcnow() - datetime.timedelta(days=1),
        trend="improving",
        status="Verified"
    )
    db.add(ls_py)

    # Machine Learning: 75% (Verified)
    ls_ml = LearnerSkill(
        profile_id=profile.id,
        skill_id=skill_db_map["Machine Learning"].id,
        mastery=78.0,
        confidence=75.0,
        retention=78.0,
        practical_application=72.0,
        assessment_performance=76.0,
        learning_velocity=6.0,
        overall_score=75.0,
        has_enough_evidence=True,
        evidence_count=3,
        is_verified=True,
        source="evidence_based",
        level="Intermediate",
        last_practiced=datetime.datetime.utcnow() - datetime.timedelta(days=2),
        trend="improving",
        status="Developing"
    )
    db.add(ls_ml)

    # React: 65% (Self-reported)
    ls_react = LearnerSkill(
        profile_id=profile.id,
        skill_id=skill_db_map["React"].id,
        mastery=65.0,
        confidence=70.0,
        retention=80.0,
        practical_application=60.0,
        assessment_performance=60.0,
        learning_velocity=4.0,
        overall_score=65.0,
        has_enough_evidence=True,
        evidence_count=1,
        is_verified=False, # Self-reported is not automatically verified
        source="self_reported",
        level="Intermediate",
        last_practiced=datetime.datetime.utcnow() - datetime.timedelta(days=4),
        trend="stable",
        status="Developing"
    )
    db.add(ls_react)

    # SQL: 60% (Self-reported)
    ls_sql = LearnerSkill(
        profile_id=profile.id,
        skill_id=skill_db_map["SQL"].id,
        mastery=60.0,
        confidence=65.0,
        retention=70.0,
        practical_application=55.0,
        assessment_performance=55.0,
        learning_velocity=2.0,
        overall_score=60.0,
        has_enough_evidence=True,
        evidence_count=1,
        is_verified=False,
        source="self_reported",
        level="Intermediate",
        last_practiced=datetime.datetime.utcnow() - datetime.timedelta(days=6),
        trend="stable",
        status="Needs Focus"
    )
    db.add(ls_sql)

    # Statistics: 55% (Needs Focus)
    ls_stats = LearnerSkill(
        profile_id=profile.id,
        skill_id=skill_db_map["Statistics"].id,
        mastery=58.0,
        confidence=50.0,
        retention=65.0,
        practical_application=50.0,
        assessment_performance=55.0,
        learning_velocity=1.0,
        overall_score=55.0,
        has_enough_evidence=True,
        evidence_count=2,
        is_verified=False,
        source="evidence_based",
        level="Beginner",
        last_practiced=datetime.datetime.utcnow() - datetime.timedelta(days=5),
        trend="stable",
        status="Needs Focus"
    )
    db.add(ls_stats)

    # Deep Learning: 45% (Needs Focus / Priority Gap)
    ls_dl = LearnerSkill(
        profile_id=profile.id,
        skill_id=skill_db_map["Deep Learning"].id,
        mastery=48.0,
        confidence=40.0,
        retention=60.0,
        practical_application=35.0,
        assessment_performance=42.0,
        learning_velocity=0.0,
        overall_score=45.0,
        has_enough_evidence=True,
        evidence_count=1,
        is_verified=False,
        source="evidence_based",
        level="Beginner",
        last_practiced=datetime.datetime.utcnow() - datetime.timedelta(days=3),
        trend="stable",
        status="Needs Focus"
    )
    db.add(ls_dl)
    db.flush()

    # Evidence & History for Kishor G
    db.add(SkillEvidence(learner_skill_id=ls_py.id, evidence_type="course", title="Python for Data Science & AI", score=100.0, description="Completed course."))
    db.add(SkillEvidence(learner_skill_id=ls_py.id, evidence_type="assessment", title="Python Advanced Diagnostic", score=90.0, description="Passed assessment."))
    db.add(SkillEvidence(learner_skill_id=ls_py.id, evidence_type="project", title="Python Data Processing Pipeline", score=88.0, description="Evaluated project submission."))
    db.add(SkillHistory(learner_skill_id=ls_py.id, old_score=82.0, new_score=90.0, reason="Verified Python ETL Pipeline project submission (88%).", event_type="project_evaluation"))

    db.add(SkillEvidence(learner_skill_id=ls_ml.id, evidence_type="course", title="Hands-On Machine Learning Masterclass", score=90.0, description="Completed course."))
    db.add(SkillEvidence(learner_skill_id=ls_ml.id, evidence_type="assessment", title="Scikit-Learn Evaluation Diagnostic", score=76.0, description="Passed diagnostic."))
    db.add(SkillHistory(learner_skill_id=ls_ml.id, old_score=68.0, new_score=75.0, reason="Completed Scikit-Learn evaluation diagnostic with 76%.", event_type="assessment"))

    db.add(SkillEvidence(learner_skill_id=ls_dl.id, evidence_type="assessment", title="Deep Learning Foundations Attempt", score=42.0, description="Diagnostic attempt highlighted backpropagation concept gap."))
    db.add(SkillHistory(learner_skill_id=ls_dl.id, old_score=50.0, new_score=45.0, reason="Deep Learning diagnostic score (42%) triggered remediation insertion into roadmap.", event_type="assessment_remediation"))

    # Unpracticed skills
    for name in ["NLP", "Computer Vision", "MLOps", "Data Structures", "System Design", "Cloud", "Data Visualization"]:
        sk = skill_db_map[name]
        ls_unseen = LearnerSkill(
            profile_id=profile.id,
            skill_id=sk.id,
            mastery=0.0,
            confidence=50.0,
            retention=100.0,
            practical_application=0.0,
            assessment_performance=0.0,
            learning_velocity=0.0,
            overall_score=0.0,
            has_enough_evidence=False,
            evidence_count=0,
            is_verified=False,
            source="evidence_based",
            level="Beginner",
            last_practiced=datetime.datetime.utcnow(),
            status="Beginner"
        )
        db.add(ls_unseen)

    # 5. Seed Completed Courses
    db.add(CompletedCourse(
        profile_id=profile.id,
        course_name="Python Programming",
        provider="Coursera",
        skill_id=skill_db_map["Python"].id,
        skill_name="Python",
        completion_date="July 2026",
        duration_hours=20.0,
        description="Comprehensive course covering Python 3 data structures, OOP, Pandas, and NumPy."
    ))
    db.add(CompletedCourse(
        profile_id=profile.id,
        course_name="Machine Learning Fundamentals",
        provider="Coursera",
        skill_id=skill_db_map["Machine Learning"].id,
        skill_name="Machine Learning",
        completion_date="August 2026",
        duration_hours=25.0,
        description="Covering regression, classification, cross-validation, and Scikit-Learn models."
    ))
    db.add(CompletedCourse(
        profile_id=profile.id,
        course_name="React Development",
        provider="Udemy",
        skill_id=skill_db_map["React"].id,
        skill_name="React",
        completion_date="August 2026",
        duration_hours=18.0,
        description="Building modern React UI web interfaces with hooks and TypeScript."
    ))

    # 6. Seed Interested Courses (Bookmarked Resources)
    db.add(InterestedResource(
        profile_id=profile.id,
        resource_id=resource_db_map["Neural Network Fundamentals & PyTorch"].id,
        resource_name="Deep Learning with PyTorch",
        skill_name="Deep Learning",
        difficulty="Intermediate",
        duration_minutes=150,
        provider="Udacity",
        notes="Bookmarked to close current Deep Learning backpropagation prerequisite gap."
    ))
    db.add(InterestedResource(
        profile_id=profile.id,
        resource_id=resource_db_map["Production MLOps & Model Serving"].id,
        resource_name="MLOps Fundamentals",
        skill_name="MLOps",
        difficulty="Advanced",
        duration_minutes=140,
        provider="Coursera",
        notes="Saved for Phase 4 deployment pipeline module."
    ))
    db.add(InterestedResource(
        profile_id=profile.id,
        resource_id=resource_db_map["Convolutional Neural Networks & Vision"].id,
        resource_name="Advanced Computer Vision",
        skill_name="Computer Vision",
        difficulty="Advanced",
        duration_minutes=120,
        provider="fast.ai",
        notes="Interested in object detection and image segmentation."
    ))

    # 7. Seed Roadmap (5 Phases)
    roadmap = Roadmap(
        profile_id=profile.id,
        goal_title="AI Engineer",
        target_date="March 2027",
        total_duration_weeks=24
    )
    db.add(roadmap)
    db.flush()

    p1 = RoadmapPhase(roadmap_id=roadmap.id, phase_number=1, title="Phase 1: Core Foundations", description="Master Python programming, linear algebra, and basic statistics.", estimated_weeks=4, status="completed")
    p2 = RoadmapPhase(roadmap_id=roadmap.id, phase_number=2, title="Phase 2: Machine Learning & Deep Learning Core", description="Scikit-Learn algorithms, PyTorch neural networks, and diagnostic evaluation.", estimated_weeks=6, status="in_progress")
    p3 = RoadmapPhase(roadmap_id=roadmap.id, phase_number=3, title="Phase 3: Applied Computer Vision & NLP", description="Transformers, HuggingFace fine-tuning, and CNN architectures.", estimated_weeks=5, status="upcoming")
    p4 = RoadmapPhase(roadmap_id=roadmap.id, phase_number=4, title="Phase 4: Production MLOps Systems", description="FastAPI model serving, Docker containers, MLflow, and Kubernetes.", estimated_weeks=5, status="upcoming")
    p5 = RoadmapPhase(roadmap_id=roadmap.id, phase_number=5, title="Phase 5: Capstone AI System Deployment", description="Portfolio verification and end-to-end production pipeline deployment.", estimated_weeks=4, status="upcoming")
    
    db.add_all([p1, p2, p3, p4, p5])
    db.flush()

    # Roadmap Items
    db.add(RoadmapItem(phase_id=p1.id, resource_id=resource_db_map["Python for Data Science & AI"].id, title="Python for Data Science & AI", skill_name="Python", estimated_hours=4.0, item_type="Resource", status="completed", order_index=1))
    db.add(RoadmapItem(phase_id=p1.id, resource_id=resource_db_map["Applied Statistics & Hypothesis Testing"].id, title="Applied Statistics & Hypothesis Testing", skill_name="Statistics", estimated_hours=3.5, item_type="Resource", status="completed", order_index=2))
    
    db.add(RoadmapItem(phase_id=p2.id, resource_id=resource_db_map["Hands-On Machine Learning Masterclass"].id, title="Hands-On Machine Learning Masterclass", skill_name="Machine Learning", estimated_hours=6.0, item_type="Resource", status="completed", order_index=1))
    db.add(RoadmapItem(phase_id=p2.id, resource_id=resource_db_map["Neural Network Fundamentals & PyTorch"].id, title="Neural Network Fundamentals & PyTorch", skill_name="Deep Learning", estimated_hours=5.0, item_type="Resource", status="in_progress", order_index=2))
    db.add(RoadmapItem(phase_id=p2.id, title="Remediation: Neural Network Backpropagation", skill_name="Deep Learning", estimated_hours=2.0, item_type="Resource", status="pending", is_remediation=True, order_index=3))

    db.add(RoadmapItem(phase_id=p3.id, resource_id=resource_db_map["Convolutional Neural Networks & Vision"].id, title="Convolutional Neural Networks & Vision", skill_name="Computer Vision", estimated_hours=6.0, item_type="Resource", status="pending", order_index=1))
    db.add(RoadmapItem(phase_id=p3.id, resource_id=resource_db_map["Transformer Architecture & LLM Fine-Tuning"].id, title="Transformer Architecture & LLM Fine-Tuning", skill_name="NLP", estimated_hours=8.0, item_type="Resource", status="pending", order_index=2))

    db.add(RoadmapItem(phase_id=p4.id, resource_id=resource_db_map["Production MLOps & Model Serving"].id, title="Production MLOps & Model Serving", skill_name="MLOps", estimated_hours=7.0, item_type="Resource", status="pending", order_index=1))

    # 8. Seed AI Insights & Adaptation Events for SKILLORA AI
    db.add(AIInsight(
        profile_id=profile.id,
        title="Python Skill DNA Verified",
        category="strength",
        content="Kishor, your Python proficiency (90%) is verified and strong enough to accelerate advanced PyTorch and MLOps modules.",
        impact="positive"
    ))
    db.add(AIInsight(
        profile_id=profile.id,
        title="Deep Learning Prerequisite Bottleneck",
        category="bottleneck",
        content="Deep Learning score (45%) is currently your primary bottleneck preventing capstone MLOps readiness.",
        impact="warning"
    ))

    # 9. Seed 5 Days of Learning Activities for Streak
    now = datetime.datetime.utcnow()
    activities_data = [
        ("course", "Completed Python for Data Science & AI", 4),
        ("assessment", "Python Advanced Diagnostic (90%)", 3),
        ("course", "Completed Machine Learning Masterclass", 2),
        ("project", "Python ETL Pipeline Project Evaluated (88%)", 1),
        ("mentor_chat", "Explored Deep Learning & MLOps Strategy", 0)
    ]
    for act_type, title, days_ago in activities_data:
        act_date = now - datetime.timedelta(days=days_ago)
        db.add(LearningActivity(
            profile_id=profile.id,
            activity_type=act_type,
            title=title,
            description="Verified learning activity logged into digital twin evidence.",
            activity_date=act_date,
            created_at=act_date
        ))

    db.commit()
    print("Database successfully seeded with KISHOR G demo profile for SKILLORA AI!")

