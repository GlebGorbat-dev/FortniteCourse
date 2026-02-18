from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.progress import Progress
from app.models.course import CourseLesson
from app.schemas.progress import ProgressResponse, ProgressUpdate

router = APIRouter()


@router.post("/update", response_model=ProgressResponse)
async def update_progress(
    progress_data: ProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check lesson exists
    lesson = db.query(CourseLesson).filter(CourseLesson.id == progress_data.lesson_id).first()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    # All courses are free and accessible - no access check needed
    
    # Cap watched time to video duration (never exceed video length)
    capped_duration = (
        min(progress_data.watched_duration, lesson.video_duration)
        if lesson.video_duration
        else progress_data.watched_duration
    )
    
    # Find or create progress record
    progress = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.lesson_id == progress_data.lesson_id
    ).first()
    
    if progress:
        # Keep max watched (don't decrease on seek), but never exceed video duration
        new_val = max(progress.watched_duration, capped_duration)
        if lesson.video_duration and new_val > lesson.video_duration:
            new_val = lesson.video_duration
        progress.watched_duration = new_val
        if progress_data.is_completed:
            progress.is_completed = True
    else:
        progress = Progress(
            user_id=current_user.id,
            lesson_id=progress_data.lesson_id,
            watched_duration=capped_duration,
            is_completed=progress_data.is_completed or False
        )
        db.add(progress)
    
    db.commit()
    db.refresh(progress)
    
    return progress


@router.get("/lesson/{lesson_id}", response_model=ProgressResponse)
async def get_lesson_progress(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    progress = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.lesson_id == lesson_id
    ).first()
    
    if not progress:
        from datetime import datetime
        return ProgressResponse(
            id=0,
            user_id=current_user.id,
            lesson_id=lesson_id,
            watched_duration=0,
            is_completed=False,
            last_watched_at=datetime.now()
        )
    
    return progress

