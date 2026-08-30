import httpx
import json

def run_smoke_test():
    base = "http://127.0.0.1:8000"

    print("\n--- 1. Testing Unauthenticated Request (Strict 401) ---")
    r_unauth = httpx.get(f"{base}/api/profile")
    print(f"GET /api/profile (No Token) -> Status: {r_unauth.status_code}")
    assert r_unauth.status_code == 401, "Expected 401 Unauthorized"

    print("\n--- 2. Authenticating Demo Session (Kishor G) ---")
    r_demo = httpx.post(f"{base}/api/auth/demo-login")
    assert r_demo.status_code == 200, f"Demo login failed: {r_demo.text}"
    token = r_demo.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"Demo token obtained for: {r_demo.json()['user']['name']}")

    endpoints = [
        ("GET", "/", {}),
        ("GET", "/docs", {}),
        ("GET", "/api/profile", headers),
        ("GET", "/api/dashboard", headers),
        ("GET", "/api/skill-dna", headers),
        ("GET", "/api/skill-gaps", headers),
        ("GET", "/api/profile/skill-dna", headers),
        ("GET", "/api/skills/gaps", headers),
        ("GET", "/api/roadmap", headers),
        ("GET", "/api/recommendations", headers),
        ("GET", "/api/assessment/history", headers),
    ]
    
    print("\n--- 3. Testing Authenticated HTTP Endpoints ---")
    for method, ep, h in endpoints:
        r = httpx.get(f"{base}{ep}", headers=h, timeout=10.0)
        print(f"{method} {ep} -> Status: {r.status_code}")
        assert r.status_code == 200, f"Endpoint {ep} failed with {r.status_code}"

    print("\n--- 4. Testing AI Mentor Chat ---")
    r_mentor = httpx.post(
        f"{base}/api/mentor/chat",
        json={"message": "What should I learn next?", "conversation_history": []},
        headers=headers,
        timeout=25.0
    )
    assert r_mentor.status_code == 200
    reply = r_mentor.json()["response"]
    print(f"Mentor Reply -> Status: 200 (Length: {len(reply)} chars)")
    assert len(reply) > 20

    print("\n--- 5. Testing 30-MCQ Diagnostic Assessment ---")
    r_tech = httpx.post(
        f"{base}/api/assessment/start-tech",
        json={"technology": "Python"},
        headers=headers,
        timeout=10.0
    )
    print(f"POST /api/assessment/start-tech -> Status: {r_tech.status_code}")
    assert r_tech.status_code == 200
    questions = r_tech.json().get("questions", [])
    print(f"Loaded Questions Count: {len(questions)}")
    assert len(questions) == 30, f"Expected 30 questions, got {len(questions)}"

    # Test submitting the assessment
    answers = [{"question_id": q["id"], "selected_option_index": q["correct_answer_index"]} for q in questions]
    r_submit = httpx.post(
        f"{base}/api/assessment/submit-tech",
        json={
            "technology": "Python",
            "questions": questions,
            "answers": answers,
            "duration_seconds": 900
        },
        headers=headers,
        timeout=10.0
    )
    print(f"POST /api/assessment/submit-tech -> Status: {r_submit.status_code}")
    assert r_submit.status_code == 200
    res_data = r_submit.json()
    print(f"Result Score: {res_data['score']}%, Correct: {res_data['correct_count']}/30")
    assert res_data["score"] == 100
    print("\n[SUCCESS] ALL END-TO-END SMOKE TESTS PASSED WITH 100% SUCCESS!\n")

if __name__ == "__main__":
    run_smoke_test()
