from fastapi import APIRouter

router = APIRouter()


@router.get("/stats")
async def get_progress_stats():
    """Return user progress statistics for the dashboard."""
    return {
        "resumes_analyzed": 12,
        "mock_interviews": 5,
        "quizzes_taken": 8,
        "career_plans_generated": 3,
        "average_quiz_score": 72,
        "interview_score_trend": [65, 70, 72, 78, 85],
        "skills_learned": ["React", "Python", "FastAPI", "Docker", "SQL"],
        "recent_activity": [
            {"action": "Resume Analyzed", "timestamp": "2 hours ago", "details": "Score: 78/100"},
            {"action": "Mock Interview", "timestamp": "1 day ago", "details": "Frontend Developer - 85%"},
            {"action": "Quiz Completed", "timestamp": "2 days ago", "details": "Python Basics - 90%"},
            {"action": "Career Plan Generated", "timestamp": "3 days ago", "details": "Full-Stack Developer"},
        ]
    }
