"""
Script to initialize the database with test data.
Run: python scripts/init_db.py

Note: video_duration (seconds) must match the actual video length for progress tracking to work correctly.
"""
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models import User, Course, CourseModule, CourseLesson, CourseResource
from app.core.security import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

db: Session = SessionLocal()


def init_test_data():
    # Create test user
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    if not test_user:
        test_user = User(
            email="test@example.com",
            username="testuser",
            hashed_password=get_password_hash("testpassword"),
            full_name="Test User",
            is_active=True
        )
        db.add(test_user)
        db.commit()
        print("✓ Created test user: test@example.com / testpassword")

    # Update ALL courses to English
    all_courses = db.query(Course).all()
    
    # Course mapping: Russian titles -> English titles
    course_translations = {
        "Основы Fortnite": {
            "title": "Fortnite Basics",
            "description": "Learn the basics of playing Fortnite from a professional. Master core mechanics, building techniques, and strategic gameplay.",
            "short_description": "Learn the basics of playing Fortnite from a professional",
            "price": 0.0,
            "currency": "USD"
        },
        "Тестовый курс Fortnite": {
            "title": "Fortnite Test Course",
            "description": "Free test course on Fortnite basics. Learn core mechanics, building, shooting and tactics. This course includes 4 video lessons for a quick start.",
            "short_description": "Free course to learn Fortnite basics",
            "price": 0.0,
            "currency": "USD"
        }
    }
    
    test_course = None
    
    for course in all_courses:
        # Check if course needs translation
        if course.title in course_translations:
            translation = course_translations[course.title]
            course.title = translation["title"]
            course.description = translation["description"]
            course.short_description = translation["short_description"]
            course.price = translation["price"]
            course.currency = translation["currency"]
            course.is_active = True
            if translation["title"] == "Fortnite Test Course":
                test_course = course
            print(f"✓ Updated course: {translation['title']}")
        elif course.title == "Fortnite Test Course":
            # Ensure English text is correct
            course.title = "Fortnite Test Course"
            course.description = "Free test course on Fortnite basics. Learn core mechanics, building, shooting and tactics. This course includes 4 video lessons for a quick start."
            course.short_description = "Free course to learn Fortnite basics"
            course.price = 0.0
            course.currency = "USD"
            course.is_active = True
            test_course = course
    
    # Create test course if it doesn't exist
    if not test_course:
        test_course = Course(
            title="Fortnite Test Course",
            description="Free test course on Fortnite basics. Learn core mechanics, building, shooting and tactics. This course includes 4 video lessons for a quick start.",
            short_description="Free course to learn Fortnite basics",
            price=0.0,
            currency="USD",
            image_url="https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            is_active=True
        )
        db.add(test_course)
        print("✓ Created new course: Fortnite Test Course")
    
    db.flush()

    # Setup modules and lessons for test course only
    if test_course:
        # One module with 4 lessons - update or create
        module1 = db.query(CourseModule).filter(
            CourseModule.course_id == test_course.id,
            CourseModule.order == 1
        ).first()
        
        if not module1:
            module1 = CourseModule(
                course_id=test_course.id,
                title="Game Basics",
                description="Intro module with basic lessons",
                order=1
            )
            db.add(module1)
        else:
            module1.title = "Game Basics"
            module1.description = "Intro module with basic lessons"
        db.flush()

        # 4 lessons — video_duration must match actual video length (in seconds)
        lessons_data = [
            {
                "title": "Lesson 1: Introduction to Fortnite",
                "description": "Getting to know the game, core mechanics and interface",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "video_duration": 212,  # 3:32 — must match video length
                "order": 1
            },
            {
                "title": "Lesson 2: Basic Controls",
                "description": "Learn basic character and camera controls",
                "video_url": "https://www.youtube.com/watch?v=jNQXAC9IVRw",
                "video_duration": 19,  # 0:19 — must match video length
                "order": 2
            },
            {
                "title": "Lesson 3: Building",
                "description": "Learn to build quickly for defense and movement",
                "video_url": "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
                "video_duration": 273,  # 4:33 — must match video length
                "order": 3
            },
            {
                "title": "Lesson 4: Tactics and Strategy",
                "description": "Advanced tactics and strategies for winning",
                "video_url": "https://www.youtube.com/watch?v=9bZkp7q19f0",
                "video_duration": 252,  # 4:12 — must match video length
                "order": 4
            }
        ]

        for lesson_data in lessons_data:
            # Check if lesson exists by order
            existing_lesson = db.query(CourseLesson).filter(
                CourseLesson.module_id == module1.id,
                CourseLesson.order == lesson_data["order"]
            ).first()
            
            if existing_lesson:
                # Update existing lesson
                existing_lesson.title = lesson_data["title"]
                existing_lesson.description = lesson_data["description"]
                existing_lesson.video_url = lesson_data["video_url"]
                existing_lesson.video_duration = lesson_data["video_duration"]
            else:
                # Create new lesson
                lesson = CourseLesson(
                    module_id=module1.id,
                    **lesson_data
                )
                db.add(lesson)

        # Test resources for the course
        resources_data = [
            {
                "title": "Settings Guide",
                "description": "PDF with recommended in-game settings",
                "resource_type": "pdf",
                "file_url": "https://example.com/guides/settings.pdf",
                "file_name": "fortnite_settings_guide.pdf",
                "order": 1
            },
            {
                "title": "Locations Map",
                "description": "Interactive map of all locations",
                "resource_type": "link",
                "file_url": "https://example.com/maps/fortnite-locations",
                "file_name": None,
                "order": 2
            },
            {
                "title": "Training Template",
                "description": "Excel template to track practice sessions",
                "resource_type": "template",
                "file_url": "https://example.com/templates/training.xlsx",
                "file_name": "training_template.xlsx",
                "order": 3
            },
            {
                "title": "Additional Materials",
                "description": "Links to extra videos and articles",
                "resource_type": "link",
                "file_url": "https://example.com/resources/additional",
                "file_name": None,
                "order": 4
            }
        ]

        for resource_data in resources_data:
            # Check if resource exists by order
            existing_resource = db.query(CourseResource).filter(
                CourseResource.course_id == test_course.id,
                CourseResource.order == resource_data["order"]
            ).first()
            
            if existing_resource:
                # Update existing resource
                existing_resource.title = resource_data["title"]
                existing_resource.description = resource_data["description"]
                existing_resource.resource_type = resource_data["resource_type"]
                existing_resource.file_url = resource_data["file_url"]
                existing_resource.file_name = resource_data["file_name"]
            else:
                # Create new resource
                resource = CourseResource(
                    course_id=test_course.id,
                    **resource_data
                )
                db.add(resource)

    db.commit()
    print("✓ Updated all courses to English")
    if test_course:
        print("✓ Updated/created free test course 'Fortnite Test Course' with 4 lessons and resources")

    print("\n✓ Initialization complete!")


if __name__ == "__main__":
    try:
        init_test_data()
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()
