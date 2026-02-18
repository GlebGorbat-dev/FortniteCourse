from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class LessonResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    video_url: str
    video_duration: Optional[int]
    order: int

    class Config:
        from_attributes = True


class ModuleResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    order: int
    lessons: List[LessonResponse]

    class Config:
        from_attributes = True


class CourseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    short_description: Optional[str]
    price: float
    currency: str
    image_url: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class CourseListResponse(BaseModel):
    courses: List[CourseResponse]
    total: int


class CourseDetailResponse(CourseResponse):
    modules: List[ModuleResponse]

