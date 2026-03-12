from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

CAREER_ROADMAPS = {
    "frontend_developer": {
        "title": "Frontend Developer Roadmap",
        "duration": "6-8 months",
        "phases": [
            {
                "phase": 1, "title": "Foundation", "duration": "4-6 weeks",
                "skills": ["HTML5 & Semantic HTML", "CSS3 (Flexbox, Grid, Animations)", "JavaScript ES6+"],
                "resources": ["MDN Web Docs", "freeCodeCamp", "JavaScript.info"],
                "project": "Build a responsive portfolio website"
            },
            {
                "phase": 2, "title": "React Ecosystem", "duration": "6-8 weeks",
                "skills": ["React (Hooks, Context)", "React Router", "State Management (Redux/Zustand)", "Tailwind CSS"],
                "resources": ["React Official Docs", "Scrimba React Course", "Kent C. Dodds Blog"],
                "project": "Build a task management app with React"
            },
            {
                "phase": 3, "title": "Advanced Frontend", "duration": "4-6 weeks",
                "skills": ["TypeScript", "Next.js", "Testing (Jest, React Testing Library)", "Performance Optimization"],
                "resources": ["TypeScript Handbook", "Next.js Docs", "Testing Library Docs"],
                "project": "Build a full-stack blog with Next.js"
            },
            {
                "phase": 4, "title": "Professional Skills", "duration": "Ongoing",
                "skills": ["Git & GitHub workflows", "CI/CD basics", "Accessibility (a11y)", "Design Systems"],
                "resources": ["GitHub Learning Lab", "Vercel Docs", "Web.dev"],
                "project": "Contribute to an open-source project"
            },
        ]
    },
    "backend_developer": {
        "title": "Backend Developer Roadmap",
        "duration": "6-8 months",
        "phases": [
            {
                "phase": 1, "title": "Programming Foundation", "duration": "4-6 weeks",
                "skills": ["Python (or Node.js)", "Data Structures & Algorithms", "OOP Concepts"],
                "resources": ["Python Official Tutorial", "LeetCode", "NeetCode"],
                "project": "Build a CLI tool or automation script"
            },
            {
                "phase": 2, "title": "Web Frameworks & APIs", "duration": "6-8 weeks",
                "skills": ["FastAPI / Express.js", "REST API Design", "Authentication (JWT, OAuth)", "Middleware & Error Handling"],
                "resources": ["FastAPI Docs", "REST API Tutorial", "Auth0 Docs"],
                "project": "Build a REST API for a blog platform"
            },
            {
                "phase": 3, "title": "Databases & DevOps", "duration": "4-6 weeks",
                "skills": ["PostgreSQL / MongoDB", "ORM (SQLAlchemy / Prisma)", "Docker", "Cloud Basics (AWS/GCP)"],
                "resources": ["PostgreSQL Tutorial", "Docker Docs", "AWS Free Tier"],
                "project": "Dockerize your API and deploy to cloud"
            },
            {
                "phase": 4, "title": "System Design", "duration": "4 weeks",
                "skills": ["Caching (Redis)", "Message Queues", "Microservices", "Load Balancing"],
                "resources": ["System Design Primer", "ByteByteGo", "Designing Data-Intensive Applications"],
                "project": "Design a scalable URL shortener"
            },
        ]
    },
    "data_scientist": {
        "title": "Data Science Roadmap",
        "duration": "8-10 months",
        "phases": [
            {
                "phase": 1, "title": "Math & Python", "duration": "4-6 weeks",
                "skills": ["Python for Data Science", "Statistics & Probability", "Linear Algebra Basics"],
                "resources": ["Khan Academy", "3Blue1Brown", "Python Data Science Handbook"],
                "project": "Analyze a public dataset with Pandas"
            },
            {
                "phase": 2, "title": "Machine Learning", "duration": "8-10 weeks",
                "skills": ["Scikit-learn", "Supervised Learning", "Unsupervised Learning", "Feature Engineering"],
                "resources": ["Andrew Ng's ML Course", "Kaggle Learn", "Hands-On ML Book"],
                "project": "Build a prediction model on Kaggle"
            },
            {
                "phase": 3, "title": "Deep Learning & NLP", "duration": "6-8 weeks",
                "skills": ["TensorFlow / PyTorch", "Neural Networks", "NLP Basics", "Computer Vision"],
                "resources": ["Fast.ai", "DeepLearning.AI", "Hugging Face Course"],
                "project": "Build a sentiment analysis model"
            },
            {
                "phase": 4, "title": "MLOps & Deployment", "duration": "4 weeks",
                "skills": ["Model Deployment", "MLflow", "Docker for ML", "A/B Testing"],
                "resources": ["MLOps Zoomcamp", "Weights & Biases", "BentoML Docs"],
                "project": "Deploy a model as an API"
            },
        ]
    },
    "fullstack_developer": {
        "title": "Full-Stack Developer Roadmap",
        "duration": "8-10 months",
        "phases": [
            {
                "phase": 1, "title": "Frontend Basics", "duration": "6 weeks",
                "skills": ["HTML, CSS, JavaScript", "React Basics", "Responsive Design"],
                "resources": ["The Odin Project", "freeCodeCamp", "Scrimba"],
                "project": "Build a responsive landing page"
            },
            {
                "phase": 2, "title": "Backend Basics", "duration": "6 weeks",
                "skills": ["Node.js / Python", "Express / FastAPI", "REST APIs", "Database (PostgreSQL)"],
                "resources": ["Node.js Docs", "FastAPI Tutorial", "PostgreSQL Tutorial"],
                "project": "Build a CRUD API"
            },
            {
                "phase": 3, "title": "Full-Stack Integration", "duration": "6 weeks",
                "skills": ["Authentication", "State Management", "API Integration", "Deployment"],
                "resources": ["Full Stack Open", "Vercel Docs", "Railway.app"],
                "project": "Build a full-stack e-commerce app"
            },
            {
                "phase": 4, "title": "Advanced Topics", "duration": "4 weeks",
                "skills": ["TypeScript", "Docker", "CI/CD", "Testing"],
                "resources": ["TypeScript Handbook", "GitHub Actions Docs"],
                "project": "Add CI/CD to your project"
            },
        ]
    },
}


class CareerPlanRequest(BaseModel):
    current_skills: List[str] = []
    target_role: str = "fullstack_developer"
    experience_level: Optional[str] = "beginner"


@router.post("/generate")
async def generate_career_plan(req: CareerPlanRequest):
    """Generate a personalized career roadmap."""
    role_key = req.target_role.lower().replace(" ", "_")
    roadmap = CAREER_ROADMAPS.get(role_key, CAREER_ROADMAPS["fullstack_developer"])

    # Analyze skill gaps
    all_roadmap_skills = []
    for phase in roadmap["phases"]:
        all_roadmap_skills.extend(phase["skills"])

    current_lower = [s.lower() for s in req.current_skills]
    skill_gaps = [s for s in all_roadmap_skills if s.lower() not in current_lower]
    already_known = [s for s in all_roadmap_skills if s.lower() in current_lower]

    return {
        "roadmap": roadmap,
        "skill_analysis": {
            "current_skills": req.current_skills,
            "skills_you_have": already_known,
            "skills_to_learn": skill_gaps,
            "gap_percentage": round(len(skill_gaps) / max(len(all_roadmap_skills), 1) * 100),
        },
        "experience_level": req.experience_level,
        "available_roles": list(CAREER_ROADMAPS.keys()),
    }
