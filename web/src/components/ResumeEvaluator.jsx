import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ResumeEvaluator = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file first.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/resume/parse', formData);
            setResult(response.data);
        } catch (err) {
            setError('Failed to parse resume. Ensure the backend is running and the OpenAI key is set.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <Upload className="w-6 h-6 mr-3 text-indigo-600" /> AI Resume Evaluator
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 text-center hover:border-indigo-400 transition cursor-pointer relative">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <FileText className="w-12 h-12 mx-auto text-indigo-300 mb-4" />
                        <p className="text-gray-600">
                            {file ? file.name : "Drag and drop your resume or click to browse"}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Supported formats: PDF, DOCX, TXT</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-white transition flex items-center justify-center ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : "Analyze Resume"}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" /> {error}
                    </div>
                )}
            </div>

            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-green-50"
                >
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Analysis Results</h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" /> Parsed Successfully
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Candidate Name</p>
                                <p className="text-lg font-bold text-indigo-900">{result.name || "Candidate"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Institute</p>
                                <p className="text-gray-700 font-medium">{result.institute || "Not Detected"}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Degree</p>
                                    <p className="text-gray-700 text-sm">{result.degree || "Not Detected"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Grade/GPA</p>
                                    <p className="text-indigo-600 font-bold">{result.grade || "N/A"}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Experience</p>
                                <p className="text-gray-700 text-sm border-l-2 border-indigo-100 pl-3">{result.experience || "Not Detected"}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Detected Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {result.skills?.map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium border border-indigo-100">
                                        {skill}
                                    </span>
                                )) || "No skills detected"}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ResumeEvaluator;
