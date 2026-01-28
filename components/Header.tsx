
import React, { useState, useEffect } from 'react';
import { AppState } from '../types';

interface HeaderProps {
  currentTab: AppState;
  setTab: (tab: AppState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentTab, setTab }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center transition-all duration-300">
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
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 mr-2">
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

          <button 
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9L4 4m0 0l5 0M4 4l0 5m11-5l5 5m0 0l-5 0m5 0l0-5m-5 11l-5 5m0 0l5 0m-5 0l0-5m11-5l5 5m0 0l-5 0m5 0l0-5" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
