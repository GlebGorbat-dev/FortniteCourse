from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.progress import Progress
from app.models.course import Course, CourseModule, CourseLesson
from app.schemas.user import UserResponse
from app.schemas.progress import CourseProgressResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_account_info(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/courses", response_model=list)
async def get_user_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all active courses available to the user (all courses are free now)"""
    courses = db.query(Course).filter(
        Course.is_active == True
    ).all()
    
    return courses


@router.get("/progress/{course_id}", response_model=CourseProgressResponse)
async def get_course_progress(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # All courses are free and accessible
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        return {
            "course_id": course_id,
            "total_lessons": 0,
            "completed_lessons": 0,
            "total_duration": 0,
            "watched_duration": 0,
            "progress_percentage": 0.0
        }
    
    # Получаем все уроки курса
    modules = db.query(CourseModule).filter(CourseModule.course_id == course_id).all()
    all_lessons = []
    for module in modules:
        lessons = db.query(CourseLesson).filter(CourseLesson.module_id == module.id).all()
        all_lessons.extend(lessons)
    
    total_lessons = len(all_lessons)
    total_duration = sum(lesson.video_duration or 0 for lesson in all_lessons)
    
    # Получаем прогресс пользователя
    lesson_ids = [lesson.id for lesson in all_lessons]
    progress_records = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.lesson_id.in_(lesson_ids)
    ).all()
    
    # Создаем словарь для быстрого доступа к прогрессу по lesson_id
    progress_dict = {p.lesson_id: p for p in progress_records}
    
    # Подсчитываем завершенные уроки (90% просмотрено)
    completed_lessons = 0
    watched_duration = 0
    
    for lesson in all_lessons:
        progress = progress_dict.get(lesson.id)
        if progress:
            # Учитываем не больше длительности видео (чтобы прогресс не превышал 100%)
            effective = progress.watched_duration
            if lesson.video_duration and effective > lesson.video_duration:
                effective = lesson.video_duration
            watched_duration += effective
            # Урок считается завершенным, если просмотрено 90% или больше
            if lesson.video_duration and effective >= (lesson.video_duration * 0.9):
                completed_lessons += 1
    
    # Прогресс курса = сумма просмотренного времени / общая длительность, не более 100%
    progress_percentage = (
        (watched_duration / total_duration * 100) if total_duration > 0 else 0.0
    )
    progress_percentage = min(100.0, progress_percentage)
    
    return CourseProgressResponse(
        course_id=course_id,
        total_lessons=total_lessons,
        completed_lessons=completed_lessons,
        total_duration=total_duration,
        watched_duration=watched_duration,
        progress_percentage=round(progress_percentage, 2)
    )

