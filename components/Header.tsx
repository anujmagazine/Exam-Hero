
import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
  currentTab: AppState;
  setTab: (tab: AppState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentTab, setTab }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setTab(AppState.HOME)}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
            Z
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">ZenBoard</h1>
            <p className="text-[10px] font-medium text-slate-500 tracking-wider uppercase">Exam Calmness Coach</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setTab(AppState.HOME)}
            className={`text-sm font-semibold ${currentTab === AppState.HOME ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'} transition-colors`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setTab(AppState.SIMULATOR)}
            className={`text-sm font-semibold ${currentTab === AppState.SIMULATOR ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'} transition-colors`}
          >
            Practice Simulator
          </button>
          <button 
            onClick={() => setTab(AppState.COACH)}
            className={`text-sm font-semibold ${currentTab === AppState.COACH ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'} transition-colors`}
          >
            Talk to Coach
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
