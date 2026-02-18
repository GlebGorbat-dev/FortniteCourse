from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    import logging
    logger = logging.getLogger(__name__)
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Логируем для отладки
    logger.debug(f"Validating token: {token[:20]}..." if token else "No token provided")
    
    payload = decode_access_token(token)
    if payload is None:
        logger.warning(f"Failed to decode token: {token[:20] if token else 'None'}...")
        raise credentials_exception
    
    # "sub" должен быть строкой согласно JWT стандарту, конвертируем в int
    user_id_str = payload.get("sub")
    if user_id_str is None:
        logger.warning(f"Token payload missing 'sub' field: {payload}")
        raise credentials_exception
    
    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
        logger.warning(f"Invalid user_id in token: {user_id_str} (type: {type(user_id_str)})")
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        logger.warning(f"User not found with ID: {user_id}")
        raise credentials_exception
    
    if not user.is_active:
        logger.warning(f"User {user_id} is inactive")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is inactive"
        )
    
    logger.debug(f"User authenticated: {user.email} (ID: {user.id})")
    return user

