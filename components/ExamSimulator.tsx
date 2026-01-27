
import React, { useState } from 'react';
import { getSimulatedResponse } from '../services/geminiService';

const SCENARIOS = [
  {
    id: 'jitter',
    title: 'Pre-Exam Jitters',
    description: "You are sitting at your desk, and the invigilator is about to distribute the question papers. Your heart is racing.",
    icon: '⏳'
  },
  {
    id: 'blackout',
    title: 'The Blackout',
    description: "You open the paper, see the first three questions, and realize you don't know the answer to any of them immediately.",
    icon: '😵'
  },
  {
    id: 'stuck',
    title: 'Tough Question Trap',
    description: "You've spent 15 minutes on a math problem and you're still not getting the answer. You feel panic rising.",
    icon: '🧩'
  },
  {
    id: 'timer',
    title: 'Running Out of Time',
    description: "The final bell rings in 15 minutes, but you still have two long-answer questions worth 10 marks left.",
    icon: '⏱️'
  }
];

const ExamSimulator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedScenario, setSelectedScenario] = useState<typeof SCENARIOS[0] | null>(null);
  const [userAction, setUserAction] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScenario || !userAction.trim()) return;

    setIsLoading(true);
    try {
      const feedback = await getSimulatedResponse(selectedScenario.description, userAction);
      setAiFeedback(feedback || "That's a good step. Remember to keep breathing.");
    } catch (err) {
      setAiFeedback("Great thinking. Practical tip: Focus on one step at a time.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSelectedScenario(null);
    setUserAction('');
    setAiFeedback(null);
  };

  if (selectedScenario) {
    return (
      <div className="animate-in slide-in-from-right-4 duration-500">
        <button 
          onClick={reset}
          className="text-indigo-600 font-bold flex items-center gap-2 mb-6 hover:translate-x-[-4px] transition-transform"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Scenarios
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
          <div className="bg-indigo-600 p-8 text-white">
            <div className="text-4xl mb-4">{selectedScenario.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{selectedScenario.title}</h2>
            <p className="text-indigo-100 italic">"{selectedScenario.description}"</p>
          </div>

          <div className="p-8">
            {!aiFeedback ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-700 font-bold mb-3 text-sm uppercase tracking-wide">
                    How would you handle this in the exam hall?
                  </label>
                  <textarea 
                    value={userAction}
                    onChange={(e) => setUserAction(e.target.value)}
                    placeholder="e.g., I would take 3 deep breaths, skip the question, and look for something I know..."
                    className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  {isLoading ? 'Consulting Coach...' : 'Check my Strategy'}
                </button>
              </form>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <h4 className="text-emerald-800 font-bold mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Coach's Feedback
                  </h4>
                  <p className="text-emerald-900 leading-relaxed italic">
                    {aiFeedback}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => { setAiFeedback(null); setUserAction(''); }}
                    className="flex-1 bg-white text-slate-600 font-bold py-3 rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={reset}
                    className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700"
                  >
                    Next Scenario
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Practice for the Moment 🎯</h2>
        <p className="text-slate-500">Select a stressful situation and practice your emotional response.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedScenario(s)}
            className="text-left bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{s.icon}</div>
            <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
            <p className="text-slate-500 text-xs line-clamp-2">{s.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamSimulator;
