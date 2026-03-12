import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const TOPICS = [
    { id: 'python', label: 'Python', color: 'bg-blue-500' },
    { id: 'javascript', label: 'JavaScript', color: 'bg-yellow-500' },
    { id: 'react', label: 'React', color: 'bg-cyan-500' },
    { id: 'dsa', label: 'DSA', color: 'bg-red-500' },
];

const QuizPage = () => {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [checkResult, setCheckResult] = useState(null);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);

    const startQuiz = async (topicId) => {
        setSelectedTopic(topicId);
        setLoading(true);
        setScore(0);
        setCurrentIndex(0);
        setFinished(false);
        try {
            const res = await axios.post('http://localhost:8000/quiz/generate', {
                topic: topicId,
                num_questions: 5,
            });
            setQuestions(res.data.questions);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const checkAnswer = async () => {
        if (selectedAnswer === null) return;
        setIsChecked(true);
        try {
            const res = await axios.post('http://localhost:8000/quiz/check', {
                topic: selectedTopic,
                question_index: questions[currentIndex].index,
                selected_answer: selectedAnswer,
            });
            setCheckResult(res.data);
            if (res.data.correct) {
                setScore(score + 1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const nextQuestion = () => {
        if (currentIndex + 1 >= questions.length) {
            setFinished(true);
        } else {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setIsChecked(false);
            setCheckResult(null);
        }
    };

    if (!selectedTopic) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Knowledge Quiz</h2>
                    <p className="text-gray-500 mb-8">Test your knowledge on various tech topics. Pick a topic to start!</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {TOPICS.map((topic) => (
                            <button key={topic.id} onClick={() => startQuiz(topic.id)}
                                className="p-6 rounded-xl bg-white border-2 border-gray-100 hover:border-indigo-300 hover:shadow-md transition text-center group">
                                <div className={`w-12 h-12 ${topic.color} rounded-xl mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition`}>
                                    {topic.label[0]}
                                </div>
                                <p className="font-bold text-gray-700">{topic.label}</p>
                                <p className="text-xs text-gray-400 mt-1">5 questions</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (finished) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-green-100 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl"
                        style={{ background: percentage >= 70 ? '#dcfce7' : percentage >= 40 ? '#fef3c7' : '#fee2e2' }}>
                        {percentage >= 70 ? '🏆' : percentage >= 40 ? '📚' : '💪'}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
                    <p className="text-gray-500 mb-4">{selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1)}</p>
                    <div className="inline-block bg-indigo-50 px-8 py-4 rounded-xl mb-6">
                        <p className={`text-5xl font-bold ${percentage >= 70 ? 'text-green-600' : percentage >= 40 ? 'text-amber-600' : 'text-red-600'}`}>{score}/{questions.length}</p>
                        <p className="text-sm text-gray-500 mt-1">{percentage}% correct</p>
                    </div>
                    <p className="text-gray-600 mb-6">
                        {percentage >= 80 ? 'Excellent! You really know your stuff!' :
                            percentage >= 60 ? 'Good job! Keep practicing to improve.' :
                                percentage >= 40 ? 'Not bad! Review the topics you missed.' :
                                    'Keep studying! Practice makes perfect.'}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => startQuiz(selectedTopic)}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
                            Retry Quiz
                        </button>
                        <button onClick={() => { setSelectedTopic(null); setQuestions([]); }}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">
                            Change Topic
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    if (!currentQ) return null;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Progress */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-500">Question {currentIndex + 1} of {questions.length}</span>
                    <span className="text-sm font-bold text-indigo-600">Score: {score}/{currentIndex + (isChecked ? 1 : 0)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>

            {/* Question Card */}
            <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50">
                <p className="text-lg font-bold text-gray-800 mb-6">{currentQ.question}</p>
                <div className="space-y-3">
                    {currentQ.options.map((option, i) => {
                        let btnClass = 'border-gray-200 hover:border-indigo-300 text-gray-700';
                        if (isChecked && checkResult) {
                            if (i === checkResult.correct_answer) {
                                btnClass = 'border-green-400 bg-green-50 text-green-800';
                            } else if (i === selectedAnswer && !checkResult.correct) {
                                btnClass = 'border-red-400 bg-red-50 text-red-800';
                            }
                        } else if (selectedAnswer === i) {
                            btnClass = 'border-indigo-500 bg-indigo-50 text-indigo-800';
                        }
                        return (
                            <button key={i} onClick={() => !isChecked && setSelectedAnswer(i)}
                                disabled={isChecked}
                                className={`w-full p-4 rounded-xl border-2 text-left transition font-medium ${btnClass}`}>
                                <span className="mr-3 text-sm font-bold text-gray-400">{String.fromCharCode(65 + i)}.</span>
                                {option}
                            </button>
                        );
                    })}
                </div>

                {/* Explanation */}
                {isChecked && checkResult && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className={`mt-4 p-4 rounded-xl ${checkResult.correct ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                        <p className={`font-bold mb-1 ${checkResult.correct ? 'text-green-700' : 'text-amber-700'}`}>
                            {checkResult.correct ? '✅ Correct!' : '❌ Incorrect'}
                        </p>
                        <p className="text-sm text-gray-600">{checkResult.explanation}</p>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <div className="mt-6">
                    {!isChecked ? (
                        <button onClick={checkAnswer} disabled={selectedAnswer === null}
                            className={`w-full py-3 rounded-xl font-bold text-white transition ${selectedAnswer === null ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                            Check Answer
                        </button>
                    ) : (
                        <button onClick={nextQuestion}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
                            {currentIndex + 1 < questions.length ? 'Next Question →' : 'See Results'}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default QuizPage;
