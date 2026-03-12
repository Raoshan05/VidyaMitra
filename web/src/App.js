import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ResumeEvaluator from './components/ResumeEvaluator';
import InterviewTrainer from './components/InterviewTrainer';
import CareerPlanner from './components/CareerPlanner';
import QuizPage from './components/QuizPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'resume':
        return <ResumeEvaluator />;
      case 'interview':
        return <InterviewTrainer />;
      case 'career':
        return <CareerPlanner />;
      case 'quiz':
        return <QuizPage />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      {currentPage === 'dashboard' ? (
        renderPage()
      ) : (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Top Navigation Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-indigo-600">VidyaMitra</h1>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500 capitalize">{currentPage.replace('_', ' ')}</span>
            </div>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition text-sm"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="flex-1 py-6">
            {renderPage()}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
