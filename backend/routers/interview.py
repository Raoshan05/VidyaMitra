from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import random

router = APIRouter()

INTERVIEW_QUESTIONS = {
    "frontend": [
        {"question": "Explain the Virtual DOM in React and how it improves performance.", "difficulty": "medium",
         "topic": "React"},
        {"question": "What is the difference between CSS Grid and Flexbox? When would you use each?",
         "difficulty": "easy", "topic": "CSS"},
        {"question": "How does JavaScript event delegation work and why is it useful?", "difficulty": "medium",
         "topic": "JavaScript"},
        {"question": "Explain the concept of closures in JavaScript with an example.", "difficulty": "medium",
         "topic": "JavaScript"},
        {"question": "What are React hooks? Explain useState and useEffect with examples.", "difficulty": "easy",
         "topic": "React"},
        {"question": "How would you optimize the performance of a React application?", "difficulty": "hard",
         "topic": "React"},
        {"question": "Explain the difference between server-side rendering and client-side rendering.",
         "difficulty": "medium", "topic": "Web"},
    ],
    "backend": [
        {"question": "What is the difference between REST and GraphQL? When would you choose one over the other?",
         "difficulty": "medium", "topic": "API Design"},
        {"question": "Explain database indexing. How does it improve query performance?", "difficulty": "medium",
         "topic": "Database"},
        {"question": "What is middleware in web frameworks? Give examples of when you'd use it.",
         "difficulty": "easy", "topic": "Web Frameworks"},
        {"question": "Explain the CAP theorem and its implications for distributed systems.", "difficulty": "hard",
         "topic": "Distributed Systems"},
        {"question": "How do you handle authentication and authorization in a REST API?", "difficulty": "medium",
         "topic": "Security"},
        {"question": "What are microservices? What are the pros and cons compared to monolithic architecture?",
         "difficulty": "hard", "topic": "Architecture"},
    ],
    "data_science": [
        {"question": "Explain the bias-variance tradeoff in machine learning.", "difficulty": "medium",
         "topic": "ML Theory"},
        {"question": "What is the difference between supervised and unsupervised learning? Give examples.",
         "difficulty": "easy", "topic": "ML Basics"},
        {"question": "How do you handle missing data in a dataset?", "difficulty": "easy", "topic": "Data Processing"},
        {"question": "Explain gradient descent and its variants (SGD, Adam).", "difficulty": "hard",
         "topic": "Optimization"},
        {"question": "What evaluation metrics would you use for an imbalanced classification problem?",
         "difficulty": "medium", "topic": "Evaluation"},
    ],
    "general": [
        {"question": "Tell me about a challenging project you worked on. How did you overcome the difficulties?",
         "difficulty": "easy", "topic": "Behavioral"},
        {"question": "How do you stay up to date with new technologies?", "difficulty": "easy",
         "topic": "Behavioral"},
        {"question": "Describe a time when you had to learn a new technology quickly.", "difficulty": "easy",
         "topic": "Behavioral"},
        {"question": "How do you approach debugging a complex issue?", "difficulty": "medium",
         "topic": "Problem Solving"},
        {"question": "What is your approach to writing clean, maintainable code?", "difficulty": "medium",
         "topic": "Best Practices"},
    ],
}

EVALUATION_CRITERIA = {
    "excellent": {
        "score": 90,
        "feedback": "Excellent answer! You demonstrated deep understanding with clear examples.",
        "tip": "Keep up the great work. Consider adding real-world scenarios to make your answers even stronger."
    },
    "good": {
        "score": 75,
        "feedback": "Good answer with solid understanding, but could be more detailed.",
        "tip": "Try to include specific examples from your experience and mention trade-offs."
    },
    "average": {
        "score": 55,
        "feedback": "Decent attempt, but the answer lacks depth and specific details.",
        "tip": "Study the core concepts more thoroughly and practice explaining them with examples."
    },
    "needs_work": {
        "score": 35,
        "feedback": "The answer is too brief or misses key concepts.",
        "tip": "Review the fundamentals of this topic and practice structuring your answers clearly."
    },
}


class InterviewStartRequest(BaseModel):
    role: str = "general"
    num_questions: int = 5


class AnswerEvaluateRequest(BaseModel):
    question: str
    answer: str
    role: Optional[str] = "general"


@router.post("/start")
async def start_interview(req: InterviewStartRequest):
    """Generate interview questions for a specific role."""
    role = req.role.lower().replace(" ", "_")
    questions = INTERVIEW_QUESTIONS.get(role, INTERVIEW_QUESTIONS["general"])
    selected = random.sample(questions, min(req.num_questions, len(questions)))

    return {
        "role": req.role,
        "questions": selected,
        "total_questions": len(selected),
        "instructions": "Answer each question thoroughly. Aim for 2-4 sentences per answer with specific examples.",
    }


@router.post("/evaluate")
async def evaluate_answer(req: AnswerEvaluateRequest):
    """Evaluate an interview answer."""
    answer_length = len(req.answer.split())

    if answer_length >= 50:
        level = "excellent"
    elif answer_length >= 25:
        level = "good"
    elif answer_length >= 10:
        level = "average"
    else:
        level = "needs_work"

    result = EVALUATION_CRITERIA[level].copy()

    # Add contextual tips based on answer content
    keywords_present = any(kw in req.answer.lower() for kw in
                           ["example", "for instance", "in my experience", "specifically", "because"])
    if keywords_present and level in ("good", "average"):
        score = int(result["score"])
        result["score"] = score + 10
        feedback = str(result["feedback"])
        result["feedback"] = feedback + " Good use of examples!"

    return {
        "question": req.question,
        "score": result["score"],
        "feedback": result["feedback"],
        "improvement_tip": result["tip"],
        "answer_word_count": answer_length,
    }
