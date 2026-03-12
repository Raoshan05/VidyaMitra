from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import random

router = APIRouter()

QUIZ_BANK = {
    "python": [
        {"question": "What is the output of `print(type([]))`?", "options": ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'set'>"], "answer": 0, "explanation": "[] creates an empty list, so type() returns <class 'list'>."},
        {"question": "Which keyword is used to define a function in Python?", "options": ["function", "def", "func", "define"], "answer": 1, "explanation": "Python uses the 'def' keyword to define functions."},
        {"question": "What does `len('Hello')` return?", "options": ["4", "5", "6", "Error"], "answer": 1, "explanation": "'Hello' has 5 characters, so len() returns 5."},
        {"question": "Which of these is immutable in Python?", "options": ["List", "Dictionary", "Set", "Tuple"], "answer": 3, "explanation": "Tuples are immutable - they cannot be modified after creation."},
        {"question": "What is a list comprehension?", "options": ["A way to create lists using a for loop in one line", "A method to sort lists", "A way to delete list items", "A type of linked list"], "answer": 0, "explanation": "List comprehensions provide a concise way to create lists: [x for x in range(10)]"},
        {"question": "What does the `__init__` method do in a Python class?", "options": ["Deletes an object", "Initializes the object", "Prints the object", "Copies the object"], "answer": 1, "explanation": "__init__ is the constructor that initializes a new object when a class is instantiated."},
    ],
    "javascript": [
        {"question": "What is the output of `typeof null`?", "options": ["'null'", "'undefined'", "'object'", "'boolean'"], "answer": 2, "explanation": "This is a well-known JavaScript quirk - typeof null returns 'object'."},
        {"question": "What does `===` do in JavaScript?", "options": ["Assignment", "Loose equality", "Strict equality", "Not equal"], "answer": 2, "explanation": "=== checks for strict equality - both value AND type must match."},
        {"question": "Which method adds an element to the end of an array?", "options": ["unshift()", "push()", "pop()", "shift()"], "answer": 1, "explanation": "push() adds one or more elements to the end of an array."},
        {"question": "What is a closure in JavaScript?", "options": ["A syntax error", "A function that has access to its outer scope variables", "A way to close the browser", "A type of loop"], "answer": 1, "explanation": "A closure is a function that remembers and can access variables from its lexical scope."},
        {"question": "What does `async/await` do?", "options": ["Makes code run faster", "Handles asynchronous operations in a synchronous-looking way", "Creates new threads", "Stops code execution"], "answer": 1, "explanation": "async/await is syntactic sugar for Promises, making async code easier to read and write."},
    ],
    "react": [
        {"question": "What is JSX?", "options": ["A database", "JavaScript XML - a syntax extension for React", "A CSS framework", "A testing library"], "answer": 1, "explanation": "JSX is a syntax extension that lets you write HTML-like code in JavaScript for React components."},
        {"question": "What hook is used for side effects in React?", "options": ["useState", "useEffect", "useRef", "useMemo"], "answer": 1, "explanation": "useEffect handles side effects like data fetching, subscriptions, and DOM updates."},
        {"question": "What is the virtual DOM?", "options": ["A real DOM copy", "A lightweight copy of the actual DOM for efficient updates", "A browser API", "A database"], "answer": 1, "explanation": "The Virtual DOM is a lightweight JavaScript representation of the real DOM, used for efficient diffing and updates."},
        {"question": "How do you pass data from parent to child in React?", "options": ["Events", "Props", "State", "Context only"], "answer": 1, "explanation": "Props (properties) are used to pass data from parent components to child components."},
        {"question": "What does useState return?", "options": ["An object", "A string", "An array with state value and setter function", "A boolean"], "answer": 2, "explanation": "useState returns an array: [currentValue, setterFunction], commonly destructured as [state, setState]."},
    ],
    "dsa": [
        {"question": "What is the time complexity of binary search?", "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"], "answer": 1, "explanation": "Binary search halves the search space each step, giving O(log n) time complexity."},
        {"question": "Which data structure uses FIFO (First In, First Out)?", "options": ["Stack", "Queue", "Tree", "Graph"], "answer": 1, "explanation": "Queues follow FIFO - the first element added is the first one removed."},
        {"question": "What is the worst-case time complexity of quicksort?", "options": ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], "answer": 2, "explanation": "Quicksort's worst case is O(n²), which occurs when the pivot is always the smallest or largest element."},
        {"question": "What data structure would you use to check for balanced parentheses?", "options": ["Queue", "Array", "Stack", "Linked List"], "answer": 2, "explanation": "A stack is ideal because you push opening brackets and pop when you find matching closing brackets."},
        {"question": "What is a hash table's average time complexity for lookup?", "options": ["O(n)", "O(log n)", "O(1)", "O(n²)"], "answer": 2, "explanation": "Hash tables provide O(1) average-case lookup using hash functions to map keys to indices."},
    ],
}


class QuizRequest(BaseModel):
    topic: str = "python"
    num_questions: int = 5


class QuizAnswerRequest(BaseModel):
    topic: str
    question_index: int
    selected_answer: int


@router.post("/generate")
async def generate_quiz(req: QuizRequest):
    """Generate a quiz on a specific topic."""
    topic = req.topic.lower().replace(" ", "_")
    questions = QUIZ_BANK.get(topic, QUIZ_BANK["python"])
    
    # Keep track of original indices
    indexed_questions = list(enumerate(questions))
    selected = random.sample(indexed_questions, min(req.num_questions, len(indexed_questions)))

    # Remove answers from the response (client-side quiz)
    quiz_questions = []
    for orig_idx, q in selected:
        quiz_questions.append({
            "index": orig_idx,
            "question": q["question"],
            "options": q["options"],
        })

    return {
        "topic": req.topic,
        "questions": quiz_questions,
        "total_questions": len(quiz_questions),
        "available_topics": list(QUIZ_BANK.keys()),
    }


@router.post("/check")
async def check_answer(req: QuizAnswerRequest):
    """Check a quiz answer."""
    topic = req.topic.lower().replace(" ", "_")
    questions = QUIZ_BANK.get(topic, QUIZ_BANK["python"])

    if req.question_index >= len(questions):
        return {"correct": False, "feedback": "Invalid question index."}

    q = questions[req.question_index]
    is_correct = req.selected_answer == q["answer"]

    return {
        "correct": is_correct,
        "correct_answer": q["answer"],
        "explanation": q["explanation"],
    }
