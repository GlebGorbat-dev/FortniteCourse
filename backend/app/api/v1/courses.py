from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.course import Course, CourseModule, CourseLesson
from app.schemas.course import CourseResponse, CourseListResponse, CourseDetailResponse

router = APIRouter()


@router.get("/", response_model=CourseListResponse)
async def get_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    courses = db.query(Course).filter(Course.is_active == True).offset(skip).limit(limit).all()
    total = db.query(Course).filter(Course.is_active == True).count()
    
    return CourseListResponse(courses=courses, total=total)


@router.get("/{course_id}", response_model=CourseDetailResponse)
async def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)  # Опционально для неавторизованных
):
    course = db.query(Course).filter(Course.id == course_id, Course.is_active == True).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Загружаем модули и уроки
    modules = db.query(CourseModule).filter(
        CourseModule.course_id == course_id
    ).order_by(CourseModule.order).all()
    
    for module in modules:
        lessons = db.query(CourseLesson).filter(
            CourseLesson.module_id == module.id
        ).order_by(CourseLesson.order).all()
        module.lessons = lessons
    
    course_detail = CourseDetailResponse(
        id=course.id,
        title=course.title,
        description=course.description,
        short_description=course.short_description,
        price=course.price,
        currency=course.currency,
        image_url=course.image_url,
        is_active=course.is_active,
        created_at=course.created_at,
        modules=modules
    )
    
    return course_detail



