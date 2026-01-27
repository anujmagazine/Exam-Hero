
import React from 'react';
import { AppState } from '../types';

interface HomeProps {
  onStart: (tab: AppState) => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white mb-10 shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-3">Hello, Exam Hero! 🚀</h2>
          <p className="text-indigo-100 max-w-md leading-relaxed mb-6">
            Did you know that managing your stress can boost your board exam marks by up to 6%? Let's turn that anxiety into focus.
          </p>
          <button 
            onClick={() => onStart(AppState.BREATHING)}
            className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Calm Down Now
          </button>
        </div>
        
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Practice Simulator</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Rehearse tough exam moments like "seeing a question you don't know" or "running out of time" so they don't surprise you later.
          </p>
          <button 
            onClick={() => onStart(AppState.SIMULATOR)}
            className="w-full bg-slate-50 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Start Practice
          </button>
        </section>

        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Talk it Out</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Got a specific fear? Chat with ZenBoard Coach to get personalized mental strategies and calming words.
          </p>
          <button 
            onClick={() => onStart(AppState.COACH)}
            className="w-full bg-slate-50 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Chat with Coach
          </button>
        </section>
      </div>

      <div className="mt-10 p-6 bg-slate-100 rounded-3xl border border-slate-200">
        <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          Pro Tip of the Day
        </h4>
        <p className="text-slate-600 text-sm italic leading-relaxed">
          "If you get stuck on a 5-mark question for more than 3 minutes without progress, skip it, leave space, and move on. Come back later. Your brain will keep working on it in the background!"
        </p>
      </div>
    </div>
  );
};

export default Home;
