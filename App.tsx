
import React, { useState, useEffect } from 'react';
import { AppState } from './types';
import Header from './components/Header';
import Home from './components/Home';
import ExamSimulator from './components/ExamSimulator';
import BreathingExercise from './components/BreathingExercise';
import ChatCoach from './components/ChatCoach';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppState>(AppState.HOME);

  const renderContent = () => {
    switch (activeTab) {
      case AppState.HOME:
        return <Home onStart={(tab) => setActiveTab(tab)} />;
      case AppState.SIMULATOR:
        return <ExamSimulator onBack={() => setActiveTab(AppState.HOME)} />;
      case AppState.BREATHING:
        return <BreathingExercise onBack={() => setActiveTab(AppState.HOME)} />;
      case AppState.COACH:
        return <ChatCoach onBack={() => setActiveTab(AppState.HOME)} />;
      default:
        return <Home onStart={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header currentTab={activeTab} setTab={setActiveTab} />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 pb-24">
        {renderContent()}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around md:hidden z-50">
        <button 
          onClick={() => setActiveTab(AppState.HOME)}
          className={`flex flex-col items-center gap-1 ${activeTab === AppState.HOME ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab(AppState.SIMULATOR)}
          className={`flex flex-col items-center gap-1 ${activeTab === AppState.SIMULATOR ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <span className="text-[10px] font-medium">Sim</span>
        </button>
        <button 
          onClick={() => setActiveTab(AppState.COACH)}
          className={`flex flex-col items-center gap-1 ${activeTab === AppState.COACH ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <span className="text-[10px] font-medium">Coach</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
