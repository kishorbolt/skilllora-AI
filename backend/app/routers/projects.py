from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import LearnerProfile, Project, ProjectSubmission, Skill, LearnerSkill
from app.schemas import GenerateProjectRequest, ProjectSpecResponse, SubmitProjectRequest, ProjectEvaluationResponse
from app.services.auth_service import get_current_profile
from app.services.ai_provider import get_ai_provider
from app.services.skill_dna_service import SkillDNAService
from app.services.streak_service import StreakService

router = APIRouter(prefix="/projects", tags=["AI Projects & Evidence"])

@router.post("/generate", response_model=ProjectSpecResponse)
def generate_project(
    req: GenerateProjectRequest,
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    skill = db.query(Skill).filter(Skill.name == req.skill_name).first()
    if not skill:
        skill = db.query(Skill).filter(Skill.name == "Deep Learning").first()
        if not skill:
            skill = db.query(Skill).first()

    proj = db.query(Project).filter(Project.skill_id == skill.id).first() if skill else None
    if not proj and skill:
        ai = get_ai_provider()
        spec = ai.generate_project_spec(skill.name, "Intermediate")
        proj = Project(
            skill_id=skill.id,
            title=spec["title"],
            objective=spec["objective"],
            difficulty=spec["difficulty"],
            estimated_hours=spec["estimated_hours"],
            required_skills_json=spec["required_skills"],
            requirements_json=spec["requirements"],
            evaluation_criteria_json=spec["evaluation_criteria"]
        )
        db.add(proj)
        db.commit()
        db.refresh(proj)

    return ProjectSpecResponse(
        id=proj.id if proj else 1,
        skill_name=skill.name if skill else "AI Engineering",
        title=proj.title if proj else "Production ML Pipeline",
        objective=proj.objective if proj else "Build and deploy machine learning pipeline.",
        difficulty=proj.difficulty if proj else "Intermediate",
        estimated_hours=proj.estimated_hours if proj else 8.0,
        required_skills=proj.required_skills_json if (proj and proj.required_skills_json) else ["Python"],
        requirements=proj.requirements_json if (proj and proj.requirements_json) else ["Implement model"],
        evaluation_criteria=proj.evaluation_criteria_json if (proj and proj.evaluation_criteria_json) else ["Working code"]
    )

@router.post("/evaluate", response_model=ProjectEvaluationResponse)
def evaluate_project(
    req: SubmitProjectRequest,
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    proj = db.query(Project).filter(Project.id == req.project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project spec not found.")

    ai = get_ai_provider()
    eval_res = ai.evaluate_project_submission(proj.title, req.code_snippet or "", req.reflection or "")

    sub = ProjectSubmission(
        profile_id=profile.id,
        project_id=proj.id,
        github_url=req.github_url,
        code_snippet=req.code_snippet,
        reflection=req.reflection,
        correctness_score=eval_res["correctness_score"],
        application_score=eval_res["application_score"],
        completeness_score=eval_res["completeness_score"],
        complexity_score=eval_res["complexity_score"],
        overall_score=eval_res["overall_score"],
        feedback_text=eval_res["feedback_text"]
    )
    db.add(sub)

    # Fetch or create LearnerSkill
    ls = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id, LearnerSkill.skill_id == proj.skill_id).first()
    if not ls:
        ls = LearnerSkill(
            profile_id=profile.id,
            skill_id=proj.skill_id,
            mastery=40.0,
            confidence=50.0,
            retention=90.0,
            practical_application=0.0,
            overall_score=40.0,
            level="Intermediate"
        )
        db.add(ls)
        db.flush()

    reason = f"Project '{proj.title}' evaluated with {eval_res['overall_score']:.0f}% practical application."

    # Update Skill DNA
    SkillDNAService.update_skill_state(
        db=db,
        learner_skill=ls,
        reason=reason,
        event_type="project_evaluation",
        mastery_delta=10.0,
        practical_delta=25.0,
        confidence_delta=15.0,
        retention_delta=15.0,
        velocity_delta=8.0,
        evidence_title=proj.title,
        evidence_type="project",
        evidence_score=eval_res["overall_score"]
    )

    # Log streak activity
    StreakService.record_activity(
        db=db,
        profile=profile,
        activity_type="project",
        title=f"Project Evaluated: {proj.title}",
        description=f"Scored {eval_res['overall_score']:.0f}% practical proof score."
    )

    db.commit()

    return ProjectEvaluationResponse(
        project_title=proj.title,
        correctness_score=eval_res["correctness_score"],
        application_score=eval_res["application_score"],
        completeness_score=eval_res["completeness_score"],
        complexity_score=eval_res["complexity_score"],
        overall_score=eval_res["overall_score"],
        feedback_text=eval_res["feedback_text"],
        practical_application_updated=ls.practical_application,
        evidence_added=f"Verified Project Evidence ({eval_res['overall_score']:.0f}%)",
        new_skill_score=ls.overall_score
    )
