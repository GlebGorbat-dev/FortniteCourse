from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.course import Course
from app.models.resource import CourseResource
from app.schemas.resource import CourseResourceResponse

router = APIRouter()


@router.get("/course/{course_id}", response_model=list[CourseResourceResponse])
async def get_course_resources(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получение ресурсов курса (только для пользователей с доступом)"""
    # Проверка существования курса
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.is_active == True
    ).first()
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # All courses are free and accessible - no access check needed
    
    # Получаем ресурсы курса
    resources = db.query(CourseResource).filter(
        CourseResource.course_id == course_id
    ).order_by(CourseResource.order).all()
    
    return resources

