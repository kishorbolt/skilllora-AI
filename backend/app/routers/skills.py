from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import LearnerProfile, LearnerSkill, Skill
from app.schemas import SkillGapAnalysisResponse, SkillGapSchema, SkillGraphResponse, SkillNodeSchema
from app.services.auth_service import get_current_profile
from app.services.career_service import CareerService, CAREER_REQUIREMENTS

router = APIRouter(prefix="/skills", tags=["Skills & Intelligence"])

@router.get("/gaps", response_model=SkillGapAnalysisResponse)
def get_skill_gaps(
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    target_role = profile.career_goal or "AI Engineer"
    reqs = CAREER_REQUIREMENTS.get(target_role, CAREER_REQUIREMENTS["AI Engineer"])

    learner_skills = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id).all()
    skills_map = {ls.skill.name: ls for ls in learner_skills if ls.skill}

    gaps = []
    top_priorities = []
    crit_count = 0

    order = 1
    for skill_name, req_score in reqs.items():
        ls = skills_map.get(skill_name)
        curr = ls.overall_score if ls else 0.0
        gap = req_score - curr

        if gap > 25.0:
            severity = "Critical"
            crit_count += 1
            top_priorities.append(skill_name)
        elif gap > 10.0:
            severity = "Medium"
        elif gap > 0.0:
            severity = "Minor"
        else:
            severity = "Strength"

        why = (
            f"{skill_name} is a required core competency for {target_role}. "
            f"Current verified level is {curr:.0f}% vs target requirement of {req_score:.0f}%."
        )

        prereqs = ls.skill.prerequisites_json if ls and ls.skill else []

        gaps.append(SkillGapSchema(
            skill_name=skill_name,
            category=ls.skill.category if ls and ls.skill else "General",
            current_level=curr,
            target_level=req_score,
            gap_amount=round(max(0.0, gap), 1),
            gap_severity=severity,
            prerequisites=prereqs,
            why_it_matters=why,
            priority_order=order
        ))
        order += 1

    readiness = CareerService.calculate_career_readiness(db, profile, target_role)

    return SkillGapAnalysisResponse(
        target_role=target_role,
        readiness_score=readiness["readiness_score"],
        critical_gaps_count=crit_count,
        gaps=gaps,
        top_priorities=top_priorities[:3]
    )

@router.get("/graph", response_model=SkillGraphResponse)
def get_skill_graph(
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    learner_skills = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile.id).all()
    skills_map = {ls.skill.name: ls for ls in learner_skills if ls.skill}

    all_skills = db.query(Skill).all()
    nodes = []

    for s in all_skills:
        ls = skills_map.get(s.name)
        prof = ls.overall_score if ls else 0.0
        status = ls.status if ls else "Beginner"

        # Check prerequisite state
        prereqs = s.prerequisites_json or []
        unlocked = True
        for p in prereqs:
            pls = skills_map.get(p)
            if not pls or pls.overall_score < 40.0:
                unlocked = False

        nodes.append(SkillNodeSchema(
            id=str(s.id),
            name=s.name,
            category=s.category,
            proficiency=prof,
            status=status,
            prerequisites=prereqs,
            is_unlocked=unlocked
        ))

    return SkillGraphResponse(nodes=nodes)
