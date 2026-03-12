# VidyaMitra AI - Comprehensive Learning & Career Platform

VidyaMitra is an all-in-one AI-powered platform designed to help students and professionals excel in their careers. It provides tools for resume evaluation, mock interviews, career roadmap generation, and skill-based quizzes.

## 🚀 Key Features

- **AI Resume Evaluator**: Upload your resume (PDF/TXT) to get an instant score and actionable feedback. Extracts name, institute, degree, and grades automatically.
- **Mock Interview Trainer**: Practice with role-specific interview questions (Frontend, Backend, Data Science, etc.) and receive AI-driven feedback on your responses.
- **Career Roadmap Planner**: Generate personalized learning paths based on your current skills and target role, complete with a skill gap analysis.
- **Interactive Knowledge Quizzes**: Test your knowledge in Python, JavaScript, React, and DSA with multiple-choice questions and detailed explanations.
- **Job Search Portal**: Browse and filter mock job listings by role, location, and job type.
- **Progress Dashboard**: Track your learning journey with real-time statistics on resumes analyzed, interviews completed, and quiz scores.

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Server**: Uvicorn
- **Utilities**: Pydantic, python-multipart, Requests

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide-React
- **Animations**: Framer Motion
- **API Client**: Axios

## 📂 Project Structure

```text
├── backend/            # FastAPI Backend
│   ├── core/           # Configuration and settings
│   ├── routers/        # API route handlers (resume, quiz, interview, etc.)
│   ├── main.py         # App entry point
│   └── requirements.txt
├── web/                # React Frontend
│   ├── src/
│   │   ├── components/ # Interactive UI modules
│   │   ├── App.js      # Main routing
│   │   └── index.css   # Tailwind directives
│   └── package.json
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js & npm

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *Note: If `python-multipart` installation fails via pip, manual installation may be required.*
4. Start the server:
   ```bash
   python main.py
   ```

### Frontend Setup
1. Navigate to the web folder:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Built with ❤️ by VidyaMitra Team
