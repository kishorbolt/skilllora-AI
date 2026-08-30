import pytest
import httpx
from app.main import app

@pytest.mark.anyio
async def test_full_learner_lifecycle_e2e():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # 0. Test unauthenticated request returns 401
        unauth_res = await client.get("/api/profile")
        assert unauth_res.status_code == 401, f"Expected 401, got {unauth_res.status_code}"

        # 1. Onboarding parsing
        parse_res = await client.post("/api/onboarding/parse-goal", json={"natural_language_input": "I want to become an AI Engineer by March 2027. I know Python."})
        assert parse_res.status_code == 200
        assert parse_res.json()["parsed_goal"] == "AI Engineer"

        # 2. Authenticate as Kishor demo user
        demo_res = await client.post("/api/auth/demo-login")
        assert demo_res.status_code == 200
        token = demo_res.json()["access_token"]
        auth_headers = {"Authorization": f"Bearer {token}"}

        # 3. Get Profile & verify Kishor G
        profile_res = await client.get("/api/profile", headers=auth_headers)
        assert profile_res.status_code == 200
        assert profile_res.json()["name"].upper() == "KISHOR G"

        # 4. Update Profile
        update_res = await client.put("/api/profile", json={"bio": "Updated bio for Kishor G"}, headers=auth_headers)
        assert update_res.status_code == 200
        assert update_res.json()["bio"] == "Updated bio for Kishor G"

        # 5. Add User Skill
        skill_res = await client.post("/api/profile/skills", json={
            "skill_name": "Docker",
            "proficiency": 70.0,
            "level": "Intermediate",
            "is_self_reported": True
        }, headers=auth_headers)
        assert skill_res.status_code == 200

        # 6. Add Completed Course
        course_res = await client.post("/api/profile/courses", json={
            "course_name": "Deep Learning Specialization",
            "provider": "Coursera",
            "skill_name": "Deep Learning",
            "completion_date": "August 2026",
            "duration_hours": 30.0
        }, headers=auth_headers)
        assert course_res.status_code == 200

        # 7. Add Interested Resource
        interest_res = await client.post("/api/profile/interests", json={
            "resource_name": "Transformers Masterclass",
            "skill_name": "NLP",
            "difficulty": "Advanced",
            "duration_minutes": 120,
            "provider": "HuggingFace"
        }, headers=auth_headers)
        assert interest_res.status_code == 200

        # 8. Get Skill DNA
        dna_res = await client.get("/api/profile/skill-dna", headers=auth_headers)
        assert dna_res.status_code == 200
        assert dna_res.json()["overall_dna_score"] > 0.0

        # 9. Get Recommendations
        rec_res = await client.get("/api/recommendations", headers=auth_headers)
        assert rec_res.status_code == 200
        assert len(rec_res.json()) > 0

        # 10. Start & Submit Assessment
        start_asm = await client.post("/api/assessment/start", json={"skill_name": "Deep Learning"}, headers=auth_headers)
        assert start_asm.status_code == 200
        asm_id = start_asm.json()["assessment_id"]
        q_id = start_asm.json()["questions"][0]["id"]

        sub_asm = await client.post("/api/assessment/submit", json={
            "assessment_id": asm_id,
            "answers": [{"question_id": q_id, "selected_option_index": 1}]
        }, headers=auth_headers)
        assert sub_asm.status_code == 200
        assert sub_asm.json()["new_skill_score"] is not None

        # 11. Analytics
        analytics_res = await client.get("/api/analytics", headers=auth_headers)
        assert analytics_res.status_code == 200
        assert len(analytics_res.json()["learning_history_timeline"]) > 0
