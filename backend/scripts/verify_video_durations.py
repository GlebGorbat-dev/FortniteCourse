"""
Verify that course_lessons.video_duration in the DB matches the actual video length.
Progress tracking (completion, watched_duration cap) depends on video_duration being correct.

Run: python scripts/verify_video_durations.py

Optional: set YOUTUBE_API_KEY in .env to fetch real durations from YouTube and report mismatches.
Without the key, the script only lists current DB values as a reminder to keep them in sync.
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.course import CourseLesson


def extract_youtube_id(url: str):
    """Extract YouTube video ID from URL."""
    if not url:
        return None
    patterns = [
        r"(?:youtube\.com/watch\?v=)([a-zA-Z0-9_-]{11})",
        r"(?:youtu\.be/)([a-zA-Z0-9_-]{11})",
        r"(?:youtube\.com/embed/)([a-zA-Z0-9_-]{11})",
    ]
    for pattern in patterns:
        m = re.search(pattern, url)
        if m:
            return m.group(1)
    return None


def fetch_youtube_duration(api_key: str, video_id: str) -> int | None:
    """Fetch video duration in seconds from YouTube Data API v3."""
    try:
        import httpx
        resp = httpx.get(
            "https://www.googleapis.com/youtube/v3/videos",
            params={"id": video_id, "part": "contentDetails", "key": api_key},
            timeout=10,
        )
        if resp.status_code != 200:
            return None
        data = resp.json()
        items = data.get("items", [])
        if not items:
            return None
        duration_iso = items[0].get("contentDetails", {}).get("duration", "")
        if not duration_iso:
            return None
        # Parse ISO 8601 duration (e.g. PT3M33S, PT1H2M10S)
        total_seconds = 0
        if "H" in duration_iso:
            h = re.search(r"(\d+)H", duration_iso)
            if h:
                total_seconds += int(h.group(1)) * 3600
        if "M" in duration_iso:
            m = re.search(r"(\d+)M", duration_iso)
            if m:
                total_seconds += int(m.group(1)) * 60
        if "S" in duration_iso:
            s = re.search(r"(\d+)S", duration_iso)
            if s:
                total_seconds += int(s.group(1))
        return total_seconds
    except Exception:
        return None


def main():
    db: Session = SessionLocal()
    try:
        lessons = db.query(CourseLesson).order_by(CourseLesson.id).all()
        if not lessons:
            print("No lessons in database.")
            return

        api_key = os.environ.get("YOUTUBE_API_KEY")
        print("Lesson video_duration check (DB must match actual video length for progress to work correctly)\n")
        print(f"{'ID':<6} {'Title':<40} {'video_duration':<16} {'YouTube':<10} {'Note'}")
        print("-" * 100)

        all_ok = True
        for lesson in lessons:
            yt_id = extract_youtube_id(lesson.video_url)
            db_dur = lesson.video_duration
            title_short = (lesson.title[:37] + "...") if len(lesson.title) > 40 else lesson.title
            actual_seconds = None
            if api_key and yt_id:
                actual_seconds = fetch_youtube_duration(api_key, yt_id)

            if actual_seconds is not None:
                match = db_dur == actual_seconds
                if not match:
                    all_ok = False
                note = "OK" if match else f"MISMATCH: actual={actual_seconds}s"
            else:
                note = "Set video_duration to actual length when changing video_url" if yt_id else "N/A (not YouTube)"

            print(f"{lesson.id:<6} {title_short:<40} {str(db_dur):<16} {yt_id or '—':<10} {note}")

        print("-" * 100)
        if all_ok and api_key:
            print("All checked lessons have video_duration matching YouTube.")
        elif not api_key:
            print("Tip: set YOUTUBE_API_KEY to verify durations against YouTube.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
