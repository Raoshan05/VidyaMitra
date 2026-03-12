from fastapi import APIRouter
from typing import Optional
import random

router = APIRouter()

MOCK_JOBS = [
    {"title": "Frontend Developer", "company": "TechCorp", "location": "Bangalore", "type": "Full-time", "salary": "₹8-12 LPA", "skills": ["React", "JavaScript", "CSS", "TypeScript"], "posted": "2 days ago"},
    {"title": "Backend Engineer", "company": "DataFlow Inc", "location": "Hyderabad", "type": "Full-time", "salary": "₹10-15 LPA", "skills": ["Python", "FastAPI", "PostgreSQL", "Docker"], "posted": "1 day ago"},
    {"title": "Full Stack Developer", "company": "StartupXYZ", "location": "Remote", "type": "Full-time", "salary": "₹12-18 LPA", "skills": ["React", "Node.js", "MongoDB", "AWS"], "posted": "3 days ago"},
    {"title": "Data Scientist", "company": "AI Labs", "location": "Pune", "type": "Full-time", "salary": "₹15-22 LPA", "skills": ["Python", "TensorFlow", "SQL", "Machine Learning"], "posted": "1 week ago"},
    {"title": "ML Engineer Intern", "company": "InnoTech", "location": "Delhi", "type": "Internship", "salary": "₹25,000/month", "skills": ["Python", "PyTorch", "Deep Learning"], "posted": "5 days ago"},
    {"title": "React Developer", "company": "WebSolutions", "location": "Mumbai", "type": "Full-time", "salary": "₹7-10 LPA", "skills": ["React", "Redux", "JavaScript", "REST API"], "posted": "4 days ago"},
    {"title": "DevOps Engineer", "company": "CloudFirst", "location": "Remote", "type": "Full-time", "salary": "₹14-20 LPA", "skills": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"], "posted": "2 days ago"},
    {"title": "Python Developer", "company": "CodeBase", "location": "Bangalore", "type": "Full-time", "salary": "₹9-13 LPA", "skills": ["Python", "Django", "REST API", "PostgreSQL"], "posted": "6 days ago"},
    {"title": "Software Engineer Intern", "company": "MegaCorp", "location": "Gurgaon", "type": "Internship", "salary": "₹30,000/month", "skills": ["Java", "Spring", "SQL"], "posted": "3 days ago"},
    {"title": "AI Research Intern", "company": "DeepMind India", "location": "Bangalore", "type": "Internship", "salary": "₹50,000/month", "skills": ["Python", "Deep Learning", "NLP", "PyTorch"], "posted": "1 day ago"},
]


@router.get("/search")
async def search_jobs(query: Optional[str] = None, location: Optional[str] = None, job_type: Optional[str] = None):
    """Search for jobs with optional filters."""
    results = MOCK_JOBS.copy()

    if query:
        q = query.lower()
        results = [j for j in results if q in j["title"].lower() or
                   any(q in s.lower() for s in j["skills"])]

    if location:
        loc = location.lower()
        results = [j for j in results if loc in j["location"].lower()]

    if job_type:
        jt = job_type.lower()
        results = [j for j in results if jt in j["type"].lower()]

    return {
        "jobs": results,
        "total": len(results),
        "filters_applied": {
            "query": query,
            "location": location,
            "job_type": job_type,
        }
    }
