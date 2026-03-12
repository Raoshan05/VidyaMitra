from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resume, evaluate, plan, quiz, interview, jobs, progress
from core.config import settings

app = FastAPI(title="Vidyamitra API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/resume", tags=["Resume"])
app.include_router(evaluate.router, prefix="/evaluate", tags=["Evaluation"])
app.include_router(plan.router, prefix="/plan", tags=["Career Plan"])
app.include_router(quiz.router, prefix="/quiz", tags=["Quiz"])
app.include_router(interview.router, prefix="/interview", tags=["Interview"])
app.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
app.include_router(progress.router, prefix="/progress", tags=["Progress"])

@app.get("/")
async def root():
    return {"message": "Vidyamitra AI API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
