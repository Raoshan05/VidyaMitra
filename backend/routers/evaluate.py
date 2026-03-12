from fastapi import APIRouter, UploadFile, File, HTTPException
from .resume import extract_text_from_file, detect_skills
import re

router = APIRouter()


def calculate_resume_score(text: str, skills: list) -> dict:
    """Score a resume based on multiple criteria."""
    scores = {}
    suggestions = []

    # Length score (ideal: 300-800 words)
    word_count = len(text.split())
    if word_count < 150:
        scores["length"] = 40
        suggestions.append("Your resume is too short. Aim for 300-800 words with detailed descriptions.")
    elif word_count < 300:
        scores["length"] = 65
        suggestions.append("Your resume could be more detailed. Add project descriptions and achievements.")
    elif word_count <= 800:
        scores["length"] = 95
    else:
        scores["length"] = 75
        suggestions.append("Your resume is quite long. Try to keep it concise (1-2 pages).")

    # Skills score
    if len(skills) >= 8:
        scores["skills"] = 95
    elif len(skills) >= 5:
        scores["skills"] = 80
    elif len(skills) >= 2:
        scores["skills"] = 60
        suggestions.append("Add more relevant technical skills to strengthen your profile.")
    else:
        scores["skills"] = 30
        suggestions.append("Very few skills detected. List your technical skills clearly in a dedicated section.")

    # Contact info score
    has_email = bool(re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text))
    has_phone = bool(re.search(r"[\+]?[\d\s\-\(\)]{10,}", text))
    has_linkedin = "linkedin" in text.lower()
    contact_score = sum([has_email * 35, has_phone * 35, has_linkedin * 30])
    scores["contact_info"] = max(contact_score, 20)
    if not has_email:
        suggestions.append("Add your email address to make it easy for recruiters to contact you.")
    if not has_linkedin:
        suggestions.append("Add your LinkedIn profile URL to boost credibility.")

    # Structure score (headings, sections)
    structure_keywords = ["education", "experience", "skills", "projects", "certifications", "summary", "objective"]
    found_sections = sum(1 for kw in structure_keywords if kw in text.lower())
    scores["structure"] = min(found_sections * 20, 100)
    if found_sections < 3:
        suggestions.append("Add clear section headings (Education, Experience, Skills, Projects) to improve readability.")

    # Action verbs score
    action_verbs = ["developed", "built", "designed", "implemented", "managed", "led",
                    "created", "improved", "optimized", "deployed", "achieved", "increased"]
    verb_count = sum(1 for v in action_verbs if v in text.lower())
    scores["impact_language"] = min(verb_count * 15, 100)
    if verb_count < 3:
        suggestions.append("Use strong action verbs (developed, implemented, achieved) to describe your accomplishments.")

    # Overall score
    overall = round(sum(scores.values()) / len(scores))

    return {
        "overall_score": overall,
        "breakdown": scores,
        "suggestions": suggestions,
        "skill_count": len(skills),
        "word_count": word_count,
    }


@router.post("/resume")
async def evaluate_resume(file: UploadFile = File(...)):
    """Evaluate a resume and provide a score with suggestions."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    content = await file.read()
    text = extract_text_from_file(content, file.filename)
    skills = detect_skills(text)
    result = calculate_resume_score(text, skills)
    result["detected_skills"] = skills

    return result
