from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import secrets
import urllib.parse
from app.core.database import get_db
from app.core.security import get_password_hash, create_access_token
from app.core.config import settings
from app.core.email import send_email, get_password_reset_email_html, get_password_reset_email_text
from app.models.user import User
from app.models.password_reset import PasswordResetToken
from app.schemas.user import ForgotPasswordRequest, ResetPasswordRequest, Token
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/google")
async def google_auth():
    """
    Start Google OAuth authorization flow.
    """
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth is not configured"
        )
    
    # Generate state for CSRF protection
    state = secrets.token_urlsafe(32)
    
    # Google OAuth parameters (Google redirects to frontend, frontend sends code to backend)
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": f"{settings.FRONTEND_URL}/auth/google/callback",
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "consent"
    }
    
    # Store state in cookie (in production prefer Redis or DB)
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
    
    response = RedirectResponse(url=auth_url)
    response.set_cookie(key="oauth_state", value=state, httponly=True, max_age=600)  # 10 minutes
    return response


@router.post("/google/callback")
async def google_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Handle Google OAuth callback (called from frontend).
    """
    from pydantic import BaseModel
    
    class GoogleCallbackRequest(BaseModel):
        code: str
        state: str = None
    
    body = await request.json()
    callback_data = GoogleCallbackRequest(**body)
    code = callback_data.code
    state = callback_data.state
    
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth is not configured"
        )
    
    try:
        # Exchange code for token (redirect_uri is frontend URL since Google redirects there)
        import httpx as httpx_lib
        async with httpx_lib.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": f"{settings.FRONTEND_URL}/auth/google/callback",
                    "grant_type": "authorization_code",
                }
            )
            token_data = token_response.json()
            
            if "error" in token_data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"OAuth error: {token_data.get('error_description', 'Unknown error')}"
                )
            
            access_token = token_data["access_token"]
            
            # Get user info from Google
            user_info_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            user_info = user_info_response.json()
            
            google_id = user_info.get("id")
            email = user_info.get("email")
            full_name = user_info.get("name", "")
            picture = user_info.get("picture", "")
            
            if not google_id or not email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to get user information from Google"
                )
            
            # Find or create user
            user = db.query(User).filter(
                (User.google_id == google_id) | (User.email == email)
            ).first()
            
            if user:
                # Update existing user
                if not user.google_id:
                    user.google_id = google_id
                    user.auth_provider = "google"
                    if not user.full_name and full_name:
                        user.full_name = full_name
                db.commit()
                db.refresh(user)
            else:
                # Create new user (username from email)
                username_base = email.split("@")[0]
                username = username_base
                counter = 1
                while db.query(User).filter(User.username == username).first():
                    username = f"{username_base}{counter}"
                    counter += 1
                
                user = User(
                    email=email,
                    username=username,
                    google_id=google_id,
                    auth_provider="google",
                    full_name=full_name,
                    hashed_password=None,  # OAuth users have no password
                    is_active=True
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            
            # Create JWT token and return to frontend
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            jwt_token = create_access_token(
                data={"sub": str(user.id)}, expires_delta=access_token_expires
            )
            return {"access_token": jwt_token, "token_type": "bearer"}
            
    except Exception as e:
        logger.error(f"Error during Google OAuth: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during authentication"
        )


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Forgot password — send email with reset token.
    """
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        # Don't reveal whether the user exists (security best practice)
        return {"message": "If the email exists, a password reset link has been sent."}
    
    if user.auth_provider == "google":
        return {"message": "If the email exists, a password reset link has been sent."}
    
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    
    # Create reset token record
    reset_token = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=expires_at,
        used=False
    )
    db.add(reset_token)
    db.commit()
    
    reset_url = f"{settings.FRONTEND_URL}/auth/reset-password?token={token}"
    html_body = get_password_reset_email_html(reset_url)
    text_body = get_password_reset_email_text(reset_url)
    
    await send_email(
        to_email=user.email,
        subject="Password Reset - Fortnite Course",
        html_body=html_body,
        text_body=text_body
    )
    
    return {"message": "If the email exists, a password reset link has been sent."}


@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Reset password using token.
    """
    # Find token
    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == request.token,
        PasswordResetToken.used == False
    ).first()
    
    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    if reset_token.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired"
        )
    
    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.hashed_password = get_password_hash(request.new_password)
    user.auth_provider = "email"
    reset_token.used = True
    
    db.commit()
    
    return {"message": "Password has been reset successfully"}

