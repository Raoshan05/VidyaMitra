import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const ROLES = [
    { id: 'frontend', label: 'Frontend Developer', color: 'indigo' },
    { id: 'backend', label: 'Backend Developer', color: 'green' },
    { id: 'data_science', label: 'Data Science', color: 'purple' },
    { id: 'general', label: 'General / Behavioral', color: 'amber' },
];

const InterviewTrainer = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scores, setScores] = useState([]);

    const startInterview = async (roleId) => {
        setSelectedRole(roleId);
        setLoading(true);
        setScores([]);
        setCurrentIndex(0);
        setFeedback(null);
        try {
            const res = await axios.post('http://localhost:8000/interview/start', {
                role: roleId,
                num_questions: 5,
            });
            setQuestions(res.data.questions);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async () => {
        if (!answer.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/interview/evaluate', {
                question: questions[currentIndex].question,
                answer: answer,
                role: selectedRole,
            });
            setFeedback(res.data);
            setScores([...scores, res.data.score]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const nextQuestion = () => {
        setCurrentIndex(currentIndex + 1);
        setAnswer('');
        setFeedback(null);
    };

    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    if (!selectedRole) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Mock Interview Trainer</h2>
                    <p className="text-gray-500 mb-8">Choose a role to practice interview questions with AI feedback.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ROLES.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => startInterview(role.id)}
                                className={`p-6 rounded-xl border-2 border-${role.color}-100 bg-${role.color}-50 hover:bg-${role.color}-100 transition text-left`}
                            >
                                <p className={`text-lg font-bold text-${role.color}-700`}>{role.label}</p>
                                <p className="text-sm text-gray-500 mt-1">5 interview questions</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (currentIndex >= questions.length && questions.length > 0) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-green-100 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">🎉</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Interview Complete!</h2>
                    <p className="text-gray-500 mb-6">Here's your performance summary</p>
                    <div className="inline-block bg-indigo-50 px-8 py-4 rounded-xl mb-6">
                        <p className="text-sm text-indigo-600 font-bold uppercase tracking-wider">Average Score</p>
                        <p className={`text-4xl font-bold ${avgScore >= 70 ? 'text-green-600' : avgScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{avgScore}%</p>
                    </div>
                    <div className="flex gap-2 justify-center flex-wrap mb-6">
                        {scores.map((s, i) => (
                            <span key={i} className={`px-3 py-1 rounded-full text-sm font-bold ${s >= 70 ? 'bg-green-100 text-green-700' : s >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                Q{i + 1}: {s}%
                            </span>
                        ))}
                    </div>
                    <button onClick={() => { setSelectedRole(null); setQuestions([]); }}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
                        Try Another Role
                    </button>
                </motion.div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Progress Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-500">Question {currentIndex + 1} of {questions.length}</span>
                    <span className="text-sm text-gray-400">{currentQ?.difficulty} • {currentQ?.topic}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>

            {/* Question */}
            <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50">
                <p className="text-lg font-bold text-gray-800 mb-6">{currentQ?.question}</p>
                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here... Be thorough and include examples."
                    className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                />
                {!feedback && (
                    <button onClick={submitAnswer} disabled={loading || !answer.trim()}
                        className={`w-full mt-4 py-3 rounded-xl font-bold text-white transition ${loading || !answer.trim() ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                        {loading ? 'Evaluating...' : 'Submit Answer'}
                    </button>
                )}
            </motion.div>

            {/* Feedback */}
            {feedback && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-2xl shadow-xl border ${feedback.score >= 70 ? 'bg-green-50 border-green-100' : feedback.score >= 50 ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Feedback</h3>
                        <span className={`text-2xl font-bold ${feedback.score >= 70 ? 'text-green-600' : feedback.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{feedback.score}%</span>
                    </div>
                    <p className="text-gray-700 mb-3">{feedback.feedback}</p>
                    <p className="text-sm text-indigo-600 font-medium">💡 {feedback.improvement_tip}</p>
                    <button onClick={nextQuestion}
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
                        {currentIndex + 1 < questions.length ? 'Next Question →' : 'See Results'}
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default InterviewTrainer;
