from fastapi import APIRouter, UploadFile, File, HTTPException
import re

router = APIRouter()

# Common tech skills for detection
TECH_SKILLS = [
    "Python", "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js",
    "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin", "PHP", "Ruby",
    "SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Docker", "Kubernetes",
    "AWS", "Azure", "GCP", "Git", "Linux", "HTML", "CSS", "Tailwind",
    "FastAPI", "Django", "Flask", "Express", "Spring", "TensorFlow", "PyTorch",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "AI",
    "REST API", "GraphQL", "CI/CD", "Agile", "Scrum", "Data Science",
    "Pandas", "NumPy", "Scikit-learn", "Jupyter", "Power BI", "Tableau",
]


def extract_text_from_file(content: bytes, filename: str) -> str:
    """Extract text from uploaded file."""
    if filename.endswith(".txt"):
        return content.decode("utf-8", errors="ignore")
    elif filename.endswith(".pdf"):
        # Simple PDF text extraction
        text = content.decode("latin-1", errors="ignore")
        # Look for text in (brackets) which is common in uncompressed PDFs
        raw = re.findall(r"\((.*?)\)", text)
        extracted = " ".join(raw)
        
        # If regex fails, try a fallback to any printable characters
        if len(extracted.strip()) < 50:
            extracted = "".join(chr(c) if 32 <= c <= 126 or c in (10, 13) else " " for c in content)
            # Clean up excessive whitespace
            extracted = re.sub(r'\s+', ' ', extracted)
            
        return extracted if len(extracted.strip()) > 20 else "Could not extract enough text from PDF. Please try a .txt file if possible."
    else:
        # Fallback for other files
        try:
            return content.decode("utf-8", errors="ignore")
        except:
            return content.decode("latin-1", errors="ignore")


def detect_skills(text: str) -> list:
    """Detect skills mentioned in the resume text."""
    text_lower = text.lower()
    found = []
    for skill in TECH_SKILLS:
        # Use word boundaries for better accuracy
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found.append(skill)
    return found


def extract_name(text: str) -> str:
    """Try to extract name from the first few lines."""
    # Filter out empty lines and common headers
    lines = [l.strip() for l in text.strip().split("\n") if l.strip()]
    ignore_words = ["resume", "curriculum", "page", "contact", "email", "phone", "profile", "summary", "address", "location"]
    
    for line in lines[:8]: # Check first 8 lines
        line_lower = line.lower()
        if len(line) < 3 or len(line) > 40:
            continue
        if any(word in line_lower for word in ignore_words):
            continue
        # Avoid lines with numbers (usually phone/address) or symbols
        if any(c in line for c in ["@", "http", ":", "/", "\\", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]):
            continue
        # Should contain at least one space (First Last)
        if " " in line:
            return line
    return "Candidate"


def extract_email(text: str) -> str:
    """Extract email from text."""
    match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
    return match.group(0) if match else "Not found"


def extract_education_details(text: str) -> dict:
    """Extract education details (Institute, Degree, Grade)."""
    edu_keywords = ["university", "college", "institute", "school", "academy", "iit", "nit", "bits"]
    degree_keywords = ["b.tech", "m.tech", "b.e", "m.e", "bsc", "msc", "bachelor", "master", "phd", "bca", "mca", "diploma", "degree"]
    grade_patterns = [
        r"(gpa|cgpa|percentage|marks|aggregate|score):\s*([\d.]+/?\d*)",
        r"([\d.]+)\s*/\s*10",
        r"([\d.]+)\s*%",
        r"(grade):\s*([a-fA-F][+-]?)"
    ]
    
    text_lines = text.split("\n")
    institute = "Not found"
    degree = "Not found"
    grade = "Not found"
    
    for line in text_lines:
        line_lower = line.lower()
        
        # Detect Institute
        if institute == "Not found" and any(kw in line_lower for kw in edu_keywords):
            institute = line.strip()
            
        # Detect Degree
        if degree == "Not found" and any(kw in line_lower for kw in degree_keywords):
            degree = line.strip()
            
        # Detect Grade
        if grade == "Not found":
            for pattern in grade_patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    grade = match.group(0)
                    break
                    
    return {"institute": institute, "degree": degree, "grade": grade}


def extract_experience(text: str) -> str:
    """Extract experience summary."""
    exp_keywords = ["experience", "work history", "employment", "worked at", "intern"]
    lines = text.split("\n")
    for i, line in enumerate(lines):
        if any(kw in line.lower() for kw in exp_keywords):
            # Return this line + next few lines
            snippet = "\n".join(lines[i:i + 3]).strip()
            return snippet if snippet else "Not found"
    
    # Fallback to looking for years
    year_match = re.search(r"\d{4}\s*[-–]\s*(present|\d{4})", text, re.IGNORECASE)
    if year_match:
        return f"Historical experience detected around {year_match.group(0)}"
    return "Not found"


@router.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    """Parse a resume file and extract key information."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    allowed = (".pdf", ".txt", ".docx", ".doc")
    if not any(file.filename.lower().endswith(ext) for ext in allowed):
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Use: {', '.join(allowed)}")

    content = await file.read()
    text = extract_text_from_file(content, file.filename)
    
    edu_info = extract_education_details(text)

    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "institute": edu_info["institute"],
        "degree": edu_info["degree"],
        "grade": edu_info["grade"],
        "experience": extract_experience(text),
        "skills": detect_skills(text),
        "word_count": len(text.split()),
        "raw_text_preview": text[:500],
    }
