import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import LearnerProfile, LearnerSkill, Skill, Feedback
from app.services.skill_dna_service import SkillDNAService
from app.services.recommendation_service import RecommendationService
from app.services.adaptive_service import AdaptiveService
from app.services.career_service import CareerService
from app.services.seed_service import seed_database

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    seed_database(session)
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)

def test_skill_dna_score_calculation(db_session):
    profile = db_session.query(LearnerProfile).first()
    ls_python = db_session.query(LearnerSkill).join(LearnerSkill.skill).filter(LearnerSkill.profile_id == profile.id, LearnerSkill.skill.has(name="Python")).first()
    
    score = SkillDNAService.calculate_skill_score(ls_python)
    assert score > 80.0
    assert ls_python.has_enough_evidence is True
    assert ls_python.is_verified is True

def test_insufficient_evidence_handling(db_session):
    profile = db_session.query(LearnerProfile).first()
    ls_nlp = db_session.query(LearnerSkill).join(LearnerSkill.skill).filter(LearnerSkill.profile_id == profile.id, LearnerSkill.skill.has(name="NLP")).first()
    
    score = SkillDNAService.calculate_skill_score(ls_nlp)
    assert score == 0.0
    assert ls_nlp.has_enough_evidence is False
    assert ls_nlp.status == "Beginner"

def test_adaptive_high_assessment_fasttrack(db_session):
    profile = db_session.query(LearnerProfile).first()
    ls_ml = db_session.query(LearnerSkill).join(LearnerSkill.skill).filter(LearnerSkill.profile_id == profile.id, LearnerSkill.skill.has(name="Machine Learning")).first()
    
    res = AdaptiveService.handle_assessment_result(db_session, profile, ls_ml, 94.0, [], ["Scikit-Learn Architecture"])
    assert res["new_score"] > res["old_score"]
    assert "exceptionally strong" in res["adaptation_summary"]

def test_adaptive_low_assessment_remediation(db_session):
    profile = db_session.query(LearnerProfile).first()
    ls_dl = db_session.query(LearnerSkill).join(LearnerSkill.skill).filter(LearnerSkill.profile_id == profile.id, LearnerSkill.skill.has(name="Deep Learning")).first()
    
    res = AdaptiveService.handle_assessment_result(db_session, profile, ls_dl, 42.0, ["Backpropagation"], [])
    assert res["roadmap_updated"] is True
    assert "inserted a targeted remediation" in res["adaptation_summary"]

def test_recommendation_feedback_weighting(db_session):
    profile = db_session.query(LearnerProfile).first()
    recs_before = RecommendationService.get_recommendations(db_session, profile, limit=1)

    top_res_id = recs_before[0]["resource"].id

    # Submit dislike feedback
    fb = Feedback(profile_id=profile.id, resource_id=top_res_id, feedback_type="dislike")
    db_session.add(fb)
    db_session.commit()

    recs_after = RecommendationService.get_recommendations(db_session, profile, limit=5)
    matching = [r for r in recs_after if r["resource"].id == top_res_id]
    if matching:
        assert matching[0]["breakdown"]["feedback_adjustment"] == -30.0

def test_career_readiness_heuristic(db_session):
    profile = db_session.query(LearnerProfile).first()
    res = CareerService.calculate_career_readiness(db_session, profile, "AI Engineer")
    assert res["readiness_score"] > 60.0
    assert "Deep Learning" in res["critical_missing_skills"] or "MLOps" in res["critical_missing_skills"]
