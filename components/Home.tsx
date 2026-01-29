
import React from 'react';
import { AppState } from '../types';

interface HomeProps {
  onStart: (tab: AppState) => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
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
              onClick={() => onStart(AppState.BREATHING)}
              className="bg-indigo-500/30 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-full font-bold text-base hover:bg-white/20 transition-all hover:scale-105"
            >
              Deep Box Reset
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

        {/* Card 3: Calmness Lab (Consolidated) */}
        <section className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Quick Resets</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-1">
            Biological tools to lower your heart rate instantly. Choose the method that fits your moment.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => onStart(AppState.PHYSIOLOGICAL_SIGH)}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Rapid Sigh</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">20s</span>
            </button>
            <button 
              onClick={() => onStart(AppState.BREATHING)}
              className="w-full bg-slate-50 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <span>Box Breathing</span>
              <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full">4m</span>
            </button>
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
