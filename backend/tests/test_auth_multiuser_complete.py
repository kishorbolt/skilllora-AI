import pytest
import io
import datetime
import httpx
from app.main import app

@pytest.mark.anyio
async def test_complete_auth_system_and_multiuser_isolation():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        ts = int(datetime.datetime.utcnow().timestamp() * 1000)

        # ----------------------------------------------------
        # 1. TEST VALIDATION ERRORS ON REGISTRATION
        # ----------------------------------------------------
        # Missing username
        r = await client.post("/api/auth/register", json={
            "username": "",
            "email": f"test_{ts}@gmail.com",
            "password": "Password@123",
            "confirm_password": "Password@123"
        })
        assert r.status_code == 400
        assert "username" in r.json()["detail"].lower()

        # Missing email
        r = await client.post("/api/auth/register", json={
            "username": f"user_{ts}",
            "email": "invalidemail",
            "password": "Password@123",
            "confirm_password": "Password@123"
        })
        assert r.status_code == 400
        assert "email" in r.json()["detail"].lower()

        # Missing password
        r = await client.post("/api/auth/register", json={
            "username": f"user_{ts}",
            "email": f"valid_{ts}@gmail.com",
            "password": "",
            "confirm_password": ""
        })
        assert r.status_code == 400

        # Password mismatch
        r = await client.post("/api/auth/register", json={
            "username": f"user_{ts}",
            "email": f"valid_{ts}@gmail.com",
            "password": "Password@123",
            "confirm_password": "DifferentPassword@123"
        })
        assert r.status_code == 400
        assert "passwords do not match" in r.json()["detail"].lower()

        # ----------------------------------------------------
        # 2. TEST ACCOUNT 1: RAHUL REGISTRATION
        # ----------------------------------------------------
        rahul_username = f"rahul_{ts}"
        rahul_email = f"rahul_{ts}@gmail.com"
        rahul_pw = "Rahul@12345"

        reg_rahul = await client.post("/api/auth/register", json={
            "username": rahul_username,
            "email": rahul_email,
            "password": rahul_pw,
            "confirm_password": rahul_pw
        })
        assert reg_rahul.status_code == 200, f"Rahul registration failed: {reg_rahul.text}"
        rahul_auth = reg_rahul.json()
        rahul_token = rahul_auth["access_token"]
        rahul_headers = {"Authorization": f"Bearer {rahul_token}"}

        assert rahul_auth["user"]["username"] == rahul_username
        assert rahul_auth["user"]["email"] == rahul_email
        assert rahul_auth["profile"]["current_streak"] == 0
        assert rahul_auth["profile"]["total_skills_count"] == 0
        assert rahul_auth["profile"]["verified_skills_count"] == 0
        assert rahul_auth["profile"]["resume_url"] is None

        # Duplicate username prevention
        dup_u = await client.post("/api/auth/register", json={
            "username": rahul_username.upper(), # case-insensitive test
            "email": f"different_{ts}@gmail.com",
            "password": "Password@123",
            "confirm_password": "Password@123"
        })
        assert dup_u.status_code == 400
        assert "username already exists" in dup_u.json()["detail"].lower()

        # Duplicate email prevention
        dup_e = await client.post("/api/auth/register", json={
            "username": f"different_{ts}",
            "email": rahul_email.upper(), # case-insensitive test
            "password": "Password@123",
            "confirm_password": "Password@123"
        })
        assert dup_e.status_code == 400
        assert "account with this email already exists" in dup_e.json()["detail"].lower()

        # ----------------------------------------------------
        # 3. RAHUL ADDS PERSONAL DATA (Skill, Course, Resume)
        # ----------------------------------------------------
        # Add Skill
        sk_res = await client.post("/api/profile/skills", json={
            "skill_name": "Python",
            "proficiency": 85.0,
            "level": "Advanced",
            "is_self_reported": False
        }, headers=rahul_headers)
        assert sk_res.status_code == 200

        # Add Course
        crs_res = await client.post("/api/profile/courses", json={
            "course_name": "Advanced Python AI Mastery",
            "provider": "DeepLearning.AI",
            "skill_name": "Python",
            "completion_date": "2026-08-30",
            "duration_hours": 15.0
        }, headers=rahul_headers)
        assert crs_res.status_code == 200

        # Upload Resume
        file_bytes = b"%PDF-1.4 Mock Rahul Sharma Resume Content..."
        files = {"file": ("rahul_resume.pdf", io.BytesIO(file_bytes), "application/pdf")}
        resume_res = await client.post("/api/profile/resume", files=files, headers=rahul_headers)
        assert resume_res.status_code == 200
        assert "rahul_resume.pdf" in resume_res.json()["resume_filename"]

        # Verify Rahul's dashboard and profile
        rahul_prof = (await client.get("/api/profile", headers=rahul_headers)).json()
        assert rahul_prof["total_skills_count"] >= 1
        assert rahul_prof["resume_url"] is not None

        # ----------------------------------------------------
        # 4. TEST ACCOUNT 2: PRIYA REGISTRATION & ISOLATION
        # ----------------------------------------------------
        priya_username = f"priya_{ts}"
        priya_email = f"priya_{ts}@gmail.com"
        priya_pw = "Priya@12345"

        reg_priya = await client.post("/api/auth/register", json={
            "username": priya_username,
            "email": priya_email,
            "password": priya_pw,
            "confirm_password": priya_pw
        })
        assert reg_priya.status_code == 200
        priya_auth = reg_priya.json()
        priya_token = priya_auth["access_token"]
        priya_headers = {"Authorization": f"Bearer {priya_token}"}

        # VERIFY COMPLETE ISOLATION: Priya must NOT have Rahul's data
        priya_prof = (await client.get("/api/profile", headers=priya_headers)).json()
        assert priya_prof["username"] == priya_username
        assert priya_prof["email"] == priya_email
        assert priya_prof["total_skills_count"] == 0, "Priya should have 0 skills initially"
        assert priya_prof["resume_url"] is None, "Priya must NOT see Rahul's resume"
        assert priya_prof["current_streak"] == 0

        priya_courses = (await client.get("/api/profile/courses", headers=priya_headers)).json()
        assert len(priya_courses) == 0, "Priya must NOT see Rahul's completed courses"

        # ----------------------------------------------------
        # 5. TEST LOGIN WITH USERNAME AND EMAIL
        # ----------------------------------------------------
        # 5a. Login Rahul with USERNAME
        login_u = await client.post("/api/auth/login", json={
            "username_or_email": rahul_username,
            "password": rahul_pw
        })
        assert login_u.status_code == 200
        assert login_u.json()["user"]["username"] == rahul_username

        # Verify Rahul's data is retrieved intact
        rahul_reloaded = (await client.get("/api/profile", headers={"Authorization": f"Bearer {login_u.json()['access_token']}"})).json()
        assert rahul_reloaded["username"] == rahul_username
        assert rahul_reloaded["total_skills_count"] >= 1
        assert rahul_reloaded["resume_url"] is not None

        # 5b. Login Rahul with EMAIL
        login_e = await client.post("/api/auth/login", json={
            "username_or_email": rahul_email,
            "password": rahul_pw
        })
        assert login_e.status_code == 200
        assert login_e.json()["user"]["email"] == rahul_email

        # 5c. Wrong password rejection
        login_fail = await client.post("/api/auth/login", json={
            "username_or_email": rahul_username,
            "password": "WrongPassword@999"
        })
        assert login_fail.status_code == 401
        assert "invalid username/email or password" in login_fail.json()["detail"].lower()

        # 5d. Nonexistent user rejection
        login_nonexistent = await client.post("/api/auth/login", json={
            "username_or_email": "completely_nonexistent_user_xyz",
            "password": "AnyPassword@123"
        })
        assert login_nonexistent.status_code == 401
        assert "invalid username/email or password" in login_nonexistent.json()["detail"].lower()

        # ----------------------------------------------------
        # 6. TEST DEMO LOGIN (KISHOR G) ISOLATION
        # ----------------------------------------------------
        demo_res = await client.post("/api/auth/demo-login")
        assert demo_res.status_code == 200
        demo_json = demo_res.json()
        assert demo_json["user"]["name"] == "KISHOR G"
        assert demo_json["user"]["is_demo"] is True

        # ----------------------------------------------------
        # 7. TEST UNAUTHENTICATED REQUESTS RETURN 401
        # ----------------------------------------------------
        unauth_dash = await client.get("/api/dashboard")
        assert unauth_dash.status_code == 401
