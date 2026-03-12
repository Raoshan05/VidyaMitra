import React from 'react';
import { Layout, FileText, UserCheck, TrendingUp, Settings, BookOpen } from 'lucide-react';

const Dashboard = ({ onNavigate }) => {
    const stats = [
        { label: 'Resumes Analyzed', value: '12', icon: FileText, color: 'bg-blue-500' },
        { label: 'Mock Interviews', value: '5', icon: UserCheck, color: 'bg-green-500' },
        { label: 'Career Growth', value: '+15%', icon: TrendingUp, color: 'bg-purple-500' },
    ];

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Layout, active: true },
        { id: 'resume', label: 'Resume Evaluator', icon: FileText },
        { id: 'interview', label: 'Interview Trainer', icon: UserCheck },
        { id: 'career', label: 'Career Planner', icon: TrendingUp },
        { id: 'quiz', label: 'Knowledge Quiz', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-indigo-600">VidyaMitra</h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => onNavigate(item.id)}
                            className={`flex items-center px-4 py-2 rounded-lg w-full transition ${item.active ? 'text-gray-700 bg-gray-100' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <item.icon className="w-5 h-5 mr-3" /> {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg w-full transition">
                        <Settings className="w-5 h-5 mr-3" /> Settings
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 italic">Welcome back, Aashwit</span>
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                            AG
                        </div>
                    </div>
                </header>

                <main className="p-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                                <div className={`${stat.color} p-4 rounded-lg text-white mr-4`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <button className="p-4 border border-indigo-100 bg-indigo-50 rounded-lg text-indigo-700 font-medium hover:bg-indigo-100 transition text-center" onClick={() => onNavigate('resume')}>
                                📄 Upload Resume
                            </button>
                            <button className="p-4 border border-green-100 bg-green-50 rounded-lg text-green-700 font-medium hover:bg-green-100 transition text-center" onClick={() => onNavigate('interview')}>
                                🎤 Mock Interview
                            </button>
                            <button className="p-4 border border-purple-100 bg-purple-50 rounded-lg text-purple-700 font-medium hover:bg-purple-100 transition text-center" onClick={() => onNavigate('career')}>
                                🗺️ Career Roadmap
                            </button>
                            <button className="p-4 border border-amber-100 bg-amber-50 rounded-lg text-amber-700 font-medium hover:bg-amber-100 transition text-center" onClick={() => onNavigate('quiz')}>
                                📝 Take a Quiz
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
