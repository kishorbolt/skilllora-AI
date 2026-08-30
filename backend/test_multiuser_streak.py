import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import io
import asyncio
import datetime
import httpx
from app.main import app

async def test_full_multiuser_and_streak():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        ts = int(datetime.datetime.utcnow().timestamp())

        print("\n--- 1. Testing Demo Account Login (Kishor G) ---")
        res = await client.post("/api/auth/demo-login")
        assert res.status_code == 200, f"Demo login failed: {res.text}"
        demo_data = res.json()
        kishor_token = demo_data["access_token"]
        kishor_user = demo_data["user"]
        kishor_profile = demo_data["profile"]
        
        assert kishor_user["name"] == "KISHOR G"
        assert kishor_user["email"] == "kishor.g@skillora.ai"
        assert kishor_user["is_demo"] is True
        assert kishor_profile["current_streak"] >= 1
        print(f"[PASS] Kishor G loaded with {kishor_profile['current_streak']}-day streak.")

        print("\n--- 2. Testing New User A Registration (Rahul) ---")
        rahul_username = f"rahul123_{ts}"
        rahul_email = f"rahul_{ts}@gmail.com"
        rahul_pw = "Rahul@12345"

        res = await client.post("/api/auth/register", json={
            "username": rahul_username,
            "email": rahul_email,
            "password": rahul_pw,
            "confirm_password": rahul_pw
        })
        assert res.status_code == 200, f"Rahul register failed: {res.text}"
        rahul_data = res.json()
        rahul_token = rahul_data["access_token"]
        rahul_user = rahul_data["user"]
        rahul_profile = rahul_data["profile"]

        assert rahul_user["username"] == rahul_username
        assert rahul_user["email"] == rahul_email
        assert rahul_profile["current_streak"] == 0
        assert rahul_profile["total_skills_count"] == 0
        assert rahul_profile["verified_skills_count"] == 0
        assert rahul_profile["resume_url"] is None
        print("[PASS] Rahul registered with custom password, 0-streak, 0-skill fresh state.")

        print("\n--- 3. Testing New User B Registration (Priya) ---")
        priya_username = f"priya123_{ts}"
        priya_email = f"priya_{ts}@gmail.com"
        priya_pw = "Priya@12345"

        res = await client.post("/api/auth/register", json={
            "username": priya_username,
            "email": priya_email,
            "password": priya_pw,
            "confirm_password": priya_pw
        })
        assert res.status_code == 200
        priya_data = res.json()
        priya_token = priya_data["access_token"]
        priya_profile = priya_data["profile"]

        assert priya_profile["username"] == priya_username
        assert priya_profile["current_streak"] == 0
        assert priya_profile["total_skills_count"] == 0
        print("[PASS] Priya registered with independent fresh profile.")

        print("\n--- 4. Testing Rahul Resume Upload & Isolation ---")
        file_bytes = b"%PDF-1.4 Mock PDF resume content for Rahul Sharma..."
        files = {"file": ("rahul_resume.pdf", io.BytesIO(file_bytes), "application/pdf")}
        headers_rahul = {"Authorization": f"Bearer {rahul_token}"}
        
        upload_res = await client.post("/api/profile/resume", files=files, headers=headers_rahul)
        assert upload_res.status_code == 200, f"Rahul upload failed: {upload_res.text}"
        upload_json = upload_res.json()
        assert upload_json["resume_filename"] == "rahul_resume.pdf"
        assert "/uploads/resumes/" in upload_json["resume_url"]
        print(f"[PASS] Rahul uploaded resume: {upload_json['resume_url']}")

        # Check Priya profile - Priya MUST NOT see Rahul's resume
        headers_priya = {"Authorization": f"Bearer {priya_token}"}
        priya_profile_res = await client.get("/api/profile", headers=headers_priya)
        assert priya_profile_res.status_code == 200
        assert priya_profile_res.json()["resume_url"] is None
        print("[PASS] Verified Priya's profile has NO resume (Complete Isolation).")

        # Analyze Rahul's resume
        analyze_res = await client.post("/api/profile/resume/analyze", headers=headers_rahul)
        assert analyze_res.status_code == 200, f"Analyze failed: {analyze_res.text}"
        assert len(analyze_res.json()["insights"]["detected_skills"]) > 0
        print("[PASS] Rahul's resume analyzed successfully with AI extraction.")

        print("\n--- 5. Testing Streak & Activities for Rahul ---")
        act1_res = await client.post("/api/profile/courses", json={
            "course_name": "Modern Python 3 Bootcamp",
            "provider": "Coursera",
            "skill_name": "Python",
            "completion_date": "2026-08-30",
            "duration_hours": 10.0
        }, headers=headers_rahul)
        assert act1_res.status_code == 200

        prof_after_act1 = (await client.get("/api/profile", headers=headers_rahul)).json()
        assert prof_after_act1["current_streak"] == 1
        assert prof_after_act1["is_today_complete"] is True
        print("[PASS] Activity 1 on day 1 -> Streak: 1 Day (is_today_complete = True).")

        # Multiple activities on SAME calendar day -> Streak remains 1
        act2_res = await client.post("/api/mentor/chat", json={
            "message": "Explain Python async and await"
        }, headers=headers_rahul)
        assert act2_res.status_code == 200

        prof_after_act2 = (await client.get("/api/profile", headers=headers_rahul)).json()
        assert prof_after_act2["current_streak"] == 1, "Same calendar day should not increase streak count"
        print("[PASS] Activity 2 on same calendar day -> Streak correctly remains 1 Day.")

        # Priya profile check - Priya's streak must still be 0
        priya_prof_check = (await client.get("/api/profile", headers=headers_priya)).json()
        assert priya_prof_check["current_streak"] == 0
        print("[PASS] Priya's streak remains 0 (Isolated streak).")

        print("\n--- 6. Testing Rahul Username & Email Logins ---")
        # Username login
        login_u = await client.post("/api/auth/login", json={
            "username_or_email": rahul_username,
            "password": rahul_pw
        })
        assert login_u.status_code == 200
        assert login_u.json()["user"]["username"] == rahul_username
        print("[PASS] Rahul logged in via Username + Password.")

        # Email login
        login_e = await client.post("/api/auth/login", json={
            "username_or_email": rahul_email,
            "password": rahul_pw
        })
        assert login_e.status_code == 200
        assert login_e.json()["user"]["email"] == rahul_email
        print("[PASS] Rahul logged in via Email + Password.")

        # Wrong password rejection
        login_bad = await client.post("/api/auth/login", json={
            "username_or_email": rahul_username,
            "password": "WrongPassword@999"
        })
        assert login_bad.status_code == 401
        print("[PASS] Wrong password rejected with 401 Unauthorized.")

        print("\n--- 7. Testing Unauthenticated Access Rejection ---")
        unauth_prof = await client.get("/api/profile")
        assert unauth_prof.status_code == 401
        unauth_dash = await client.get("/api/dashboard")
        assert unauth_dash.status_code == 401
        print("[PASS] Unauthenticated access strictly returns 401 Unauthorized.")

        print("\n==========================================")
        print("ALL MULTI-USER & STREAK TESTS PASSED 100%!")
        print("==========================================")

if __name__ == "__main__":
    asyncio.run(test_full_multiuser_and_streak())
