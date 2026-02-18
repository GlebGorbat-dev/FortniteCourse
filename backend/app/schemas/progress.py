from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProgressResponse(BaseModel):
    id: int
    user_id: int
    lesson_id: int
    watched_duration: int
    is_completed: bool
    last_watched_at: datetime

    class Config:
        from_attributes = True


class ProgressUpdate(BaseModel):
    lesson_id: int
    watched_duration: int
    is_completed: Optional[bool] = False


class CourseProgressResponse(BaseModel):
    course_id: int
    total_lessons: int
    completed_lessons: int
    total_duration: int
    watched_duration: int
    progress_percentage: float

