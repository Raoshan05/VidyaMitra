import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const ROLES = [
    { id: 'frontend_developer', label: 'Frontend Developer' },
    { id: 'backend_developer', label: 'Backend Developer' },
    { id: 'fullstack_developer', label: 'Full-Stack Developer' },
    { id: 'data_scientist', label: 'Data Scientist' },
];

const SKILL_OPTIONS = [
    "HTML", "CSS", "JavaScript", "TypeScript", "React", "Angular", "Vue",
    "Node.js", "Python", "Java", "FastAPI", "Django", "Express",
    "SQL", "MongoDB", "PostgreSQL", "Docker", "Git", "AWS",
    "Machine Learning", "TensorFlow", "PyTorch", "Pandas", "NumPy",
];

const CareerPlanner = () => {
    const [targetRole, setTargetRole] = useState('fullstack_developer');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);

    const toggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const generatePlan = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/plan/generate', {
                current_skills: selectedSkills,
                target_role: targetRole,
                experience_level: 'beginner',
            });
            setRoadmap(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            {/* Input Section */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Career Roadmap Planner</h2>
                <p className="text-gray-500 mb-6">Select your target role and current skills to get a personalized learning path.</p>

                {/* Role Selection */}
                <div className="mb-6">
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">Target Role</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {ROLES.map((role) => (
                            <button key={role.id} onClick={() => setTargetRole(role.id)}
                                className={`p-3 rounded-xl text-sm font-medium transition border-2 ${targetRole === role.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                                {role.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Skills Selection */}
                <div className="mb-6">
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">Your Current Skills</p>
                    <div className="flex flex-wrap gap-2">
                        {SKILL_OPTIONS.map((skill) => (
                            <button key={skill} onClick={() => toggleSkill(skill)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition border ${selectedSkills.includes(skill) ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}>
                                {selectedSkills.includes(skill) ? '✓ ' : ''}{skill}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={generatePlan} disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold text-white transition ${loading ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                    {loading ? 'Generating...' : 'Generate My Roadmap'}
                </button>
            </div>

            {/* Roadmap Display */}
            {roadmap && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Skill Gap Analysis */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-purple-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Skill Gap Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-green-50 p-4 rounded-xl text-center">
                                <p className="text-2xl font-bold text-green-600">{roadmap.skill_analysis.skills_you_have.length}</p>
                                <p className="text-sm text-green-700">Skills You Have</p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-xl text-center">
                                <p className="text-2xl font-bold text-amber-600">{roadmap.skill_analysis.skills_to_learn.length}</p>
                                <p className="text-sm text-amber-700">Skills to Learn</p>
                            </div>
                            <div className="bg-indigo-50 p-4 rounded-xl text-center">
                                <p className="text-2xl font-bold text-indigo-600">{100 - roadmap.skill_analysis.gap_percentage}%</p>
                                <p className="text-sm text-indigo-700">Readiness</p>
                            </div>
                        </div>
                        {roadmap.skill_analysis.skills_to_learn.length > 0 && (
                            <div>
                                <p className="text-sm font-bold text-gray-500 mb-2">Skills to Learn:</p>
                                <div className="flex flex-wrap gap-2">
                                    {roadmap.skill_analysis.skills_to_learn.map(s => (
                                        <span key={s} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm border border-amber-200">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Roadmap Phases */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">{roadmap.roadmap.title}</h3>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">{roadmap.roadmap.duration}</span>
                        </div>
                        <div className="space-y-6">
                            {roadmap.roadmap.phases.map((phase, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                                    className="relative pl-8 border-l-2 border-indigo-200 pb-6 last:pb-0">
                                    <div className="absolute left-[-9px] top-0 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white"></div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-800">Phase {phase.phase}: {phase.title}</h4>
                                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{phase.duration}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {phase.skills.map(s => (
                                            <span key={s} className={`px-2 py-0.5 rounded text-xs font-medium ${selectedSkills.includes(s) ? 'bg-green-100 text-green-700 line-through' : 'bg-indigo-50 text-indigo-700'}`}>{s}</span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500">📚 {phase.resources.join(' • ')}</p>
                                    <p className="text-sm text-indigo-600 mt-1 font-medium">🛠️ Project: {phase.project}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default CareerPlanner;
