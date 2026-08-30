from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import LearnerProfile
from app.schemas import SimulateCareerRequest, SimulationComparisonResponse
from app.services.auth_service import get_current_profile
from app.services.career_service import CareerService

router = APIRouter(prefix="/career", tags=["Career & Simulator"])

@router.get("/readiness")
def get_career_readiness(
    target_role: str = None,
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    res = CareerService.calculate_career_readiness(db, profile, target_role)
    return res

@router.post("/simulate", response_model=SimulationComparisonResponse)
def simulate_career_path(
    req: SimulateCareerRequest,
    profile: LearnerProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    res = CareerService.simulate_what_if(
        db=db,
        profile=profile,
        target_role=req.target_role,
        daily_hours=req.daily_study_hours,
        known_skills=req.known_skills,
        target_deadline=req.target_deadline
    )
    return SimulationComparisonResponse(
        current_path=res["current_path"],
        simulated_path=res["simulated_path"],
        differences=res["differences"]
    )
