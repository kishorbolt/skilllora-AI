import os
import hmac
import hashlib
import json
import base64
import time
import secrets
from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, LearnerProfile

SECRET_KEY = os.getenv("SECRET_KEY", "skillora-super-secret-jwt-key-2026-production")

class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using PBKDF2 HMAC-SHA256 with random salt."""
        salt = secrets.token_hex(16)
        key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return f"{salt}:{key.hex()}"

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify plain password against stored salt:hash string."""
        if not hashed_password or ":" not in hashed_password:
            return False
        try:
            salt, key_hex = hashed_password.split(":", 1)
            key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000)
            return hmac.compare_digest(key.hex(), key_hex)
        except Exception:
            return False

    @staticmethod
    def create_token(user_id: int, email: str, expires_in_seconds: int = 86400 * 30) -> str:
        """Generate a signed secure token containing user identity and expiration."""
        payload = {
            "user_id": user_id,
            "email": email,
            "exp": int(time.time()) + expires_in_seconds
        }
        payload_bytes = json.dumps(payload, separators=(',', ':')).encode('utf-8')
        payload_b64 = base64.urlsafe_b64encode(payload_bytes).decode('utf-8').rstrip('=')
        
        signature = hmac.new(SECRET_KEY.encode('utf-8'), payload_b64.encode('utf-8'), hashlib.sha256).hexdigest()
        return f"{payload_b64}.{signature}"

    @staticmethod
    def decode_token(token: str) -> Optional[Dict[str, Any]]:
        """Validate signature and decode token payload."""
        if not token or "." not in token:
            return None
        try:
            payload_b64, signature = token.split(".", 1)
            expected_sig = hmac.new(SECRET_KEY.encode('utf-8'), payload_b64.encode('utf-8'), hashlib.sha256).hexdigest()
            if not hmac.compare_digest(signature, expected_sig):
                return None

            # Add padding back if necessary
            padding = 4 - (len(payload_b64) % 4)
            if padding and padding < 4:
                payload_b64 += '=' * padding

            payload_bytes = base64.urlsafe_b64decode(payload_b64)
            payload = json.loads(payload_bytes.decode('utf-8'))

            if payload.get("exp", 0) < time.time():
                return None # Expired

            return payload
        except Exception:
            return None

def get_current_user(
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None),
    x_user_email: Optional[str] = Header(None)
) -> User:
    """
    Authenticate user strictly via Authorization Bearer token (or x_user_email header for internal testing).
    Zero fallback to demo user - returns 401 Unauthorized if unauthenticated.
    """
    token = None
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization[7:].strip()

    if token:
        payload = AuthService.decode_token(token)
        if payload and "user_id" in payload:
            user = db.query(User).filter(User.id == payload["user_id"]).first()
            if user:
                return user

    if x_user_email:
        user = db.query(User).filter(User.email == x_user_email.strip().lower()).first()
        if user:
            return user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or active session. Please sign in."
    )

def get_current_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> LearnerProfile:
    """
    Retrieve or initialize the authenticated learner profile.
    """
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == current_user.id).first()
    if not profile:
        profile = LearnerProfile(
            user_id=current_user.id,
            career_goal="AI Engineer",
            learning_objective="Master required domain competencies with verified Skill DNA.",
            current_role="Learner",
            target_role="AI Engineer",
            daily_study_hours=2.0,
            target_deadline="March 2027",
            current_streak=0,
            longest_streak=0,
            total_learning_days=0
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return profile
