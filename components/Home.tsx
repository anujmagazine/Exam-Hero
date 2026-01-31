
import React, { useState } from 'react';
import { AppState } from '../types';

interface HomeProps {
  onStart: (tab: AppState) => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  const [showResets, setShowResets] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 lg:p-12 text-white mb-10 shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6">Hello, Exam Hero! 🚀</h2>
          <p className="text-indigo-100 max-w-2xl text-lg leading-relaxed mb-8">
            Stress management can boost board exam marks by up to 6%. Let's turn that anxiety into focus and clarity.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onStart(AppState.PHYSIOLOGICAL_SIGH)}
              className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-base hover:bg-indigo-50 transition-all hover:scale-105 shadow-lg"
            >
              Rapid Sigh (20s)
            </button>
            <button 
              onClick={() => onStart(AppState.CLEAR_THE_NOISE)}
              className="bg-indigo-500/30 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-full font-bold text-base hover:bg-white/20 transition-all hover:scale-105"
            >
              Clear Noise (15s)
            </button>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Card 1: Practice Simulator */}
        <section className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col">
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Practice Simulator</h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed flex-1">
            Rehearse tough exam moments like "seeing a question you don't know" or "running out of time" so they don't surprise you later.
          </p>
          <button 
            onClick={() => onStart(AppState.SIMULATOR)}
            className="w-full bg-slate-50 text-slate-700 font-bold py-4 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Start Practice
          </button>
        </section>

        {/* Card 2: Talk to Coach */}
        <section className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Talk it Out</h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed flex-1">
            Got a specific fear? Chat with ZenBoard Coach to get personalized mental strategies and calming words.
          </p>
          <button 
            onClick={() => onStart(AppState.COACH)}
            className="w-full bg-slate-50 text-slate-700 font-bold py-4 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Chat with Coach
          </button>
        </section>

        {/* Card 3: Quick Resets (Expandable Square Layout) */}
        <section className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col overflow-hidden">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Quick Resets</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Choose a biology-backed tool to instantly settle your nerves.
          </p>
          
          <div className="mt-auto min-h-[180px] flex items-center justify-center relative">
            {!showResets ? (
              <button 
                onClick={() => setShowResets(true)}
                className="w-full h-full min-h-[160px] bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center group hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <span className="font-bold text-indigo-700">Reset Exercises</span>
                <span className="text-[10px] text-indigo-400 mt-1 uppercase tracking-wider">Tap to View Tools</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3 w-full animate-in zoom-in-95 duration-300">
                <button 
                  onClick={() => onStart(AppState.PHYSIOLOGICAL_SIGH)}
                  className="col-span-2 group flex flex-col items-center justify-center p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                >
                  <div className="text-2xl mb-1 group-hover:scale-125 transition-transform duration-300">🫁</div>
                  <span className="font-bold text-sm">Rapid Sigh</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full mt-1">20 Seconds</span>
                </button>
                
                <button 
                  onClick={() => onStart(AppState.CLEAR_THE_NOISE)}
                  className="group flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 text-slate-700 rounded-2xl hover:bg-slate-100 hover:border-slate-300 transition-all"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🔇</div>
                  <span className="font-bold text-[13px]">Clear Noise</span>
                  <span className="text-[10px] text-slate-400 mt-1">15s</span>
                </button>
                
                <button 
                  onClick={() => onStart(AppState.BREATHING)}
                  className="group flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 text-slate-700 rounded-2xl hover:bg-slate-100 hover:border-slate-300 transition-all"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🌬️</div>
                  <span className="font-bold text-[13px]">Box Breath</span>
                  <span className="text-[10px] text-slate-400 mt-1">4m</span>
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="mt-12 p-8 lg:p-10 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <h4 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
          Pro Tip of the Day
        </h4>
        <p className="text-slate-600 text-lg italic leading-relaxed max-w-4xl">
          "If you get stuck on a 5-mark question for more than 3 minutes without progress, skip it, leave space, and move on. Come back later. Your brain will keep working on it in the background while you secure easy marks elsewhere!"
        </p>
      </div>
    </div>
  );
};

export default Home;
