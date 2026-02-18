from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CourseResourceResponse(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str]
    resource_type: str
    file_url: Optional[str]
    file_name: Optional[str]
    order: int
    created_at: datetime

    class Config:
        from_attributes = True

