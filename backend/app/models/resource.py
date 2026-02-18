from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class ResourceType(str, enum.Enum):
    PDF = "pdf"
    LINK = "link"
    FILE = "file"
    TEMPLATE = "template"


class CourseResource(Base):
    __tablename__ = "course_resources"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    resource_type = Column(String, nullable=False)  # pdf, link, file, template
    file_url = Column(String, nullable=True)  # URL файла или ссылка
    file_name = Column(String, nullable=True)  # Имя файла для скачивания
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    course = relationship("Course", back_populates="resources")

