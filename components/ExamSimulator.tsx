
import React, { useState } from 'react';
import { getSimulatedResponse } from '../services/geminiService';

interface ScenarioOption {
  id: string;
  label: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  options: ScenarioOption[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'jitter',
    title: 'Pre-Exam Jitters',
    description: "You are sitting at your desk, and the invigilator is about to distribute the question papers. Your heart is racing.",
    icon: '⏳',
    options: [
      { id: 'breathing', label: 'Tried deep breathing' },
      { id: 'notes', label: 'Panicked and re-read notes' },
      { id: 'fidget', label: 'Fidgeted with my pen' },
      { id: 'silent', label: 'Stayed quiet and prayed' },
      { id: 'blank', label: 'My mind went totally blank' }
    ]
  },
  {
    id: 'blackout',
    title: 'The Blackout',
    description: "You open the paper, see the first three questions, and realize you don't know the answer to any of them immediately.",
    icon: '😵',
    options: [
      { id: 'skip', label: 'Skipped to the next page' },
      { id: 'stare', label: 'Stared at it for 5 minutes' },
      { id: 'panic_start', label: 'Started the first one anyway' },
      { id: 'eyes_closed', label: 'Closed my eyes to reset' },
      { id: 'lost', label: 'Thought I was going to fail' }
    ]
  },
  {
    id: 'stuck',
    title: 'Tough Question Trap',
    description: "You've spent 15 minutes on a math problem and you're still not getting the answer. You feel panic rising.",
    icon: '🧩',
    options: [
      { id: 'move_on', label: 'Marked it and moved on' },
      { id: 'stubborn', label: 'Refused to leave it unfinished' },
      { id: 'scribble', label: 'Started scribbling messily' },
      { id: 'sweat', label: 'Started sweating/shaking' },
      { id: 'check_clock', label: 'Kept checking the clock' }
    ]
  },
  {
    id: 'timer',
    title: 'Running Out of Time',
    description: "The final bell rings in 15 minutes, but you still have two long-answer questions worth 10 marks left.",
    icon: '⏱️',
    options: [
      { id: 'bullets', label: 'Wrote in quick bullet points' },
      { id: 'fast', label: 'Scrawled as fast as possible' },
      { id: 'prioritize', label: 'Only did high-mark parts' },
      { id: 'freeze', label: 'Froze and did nothing' },
      { id: 'rush', label: 'Made a lot of silly mistakes' }
    ]
  }
];

const ExamSimulator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [userAction, setUserAction] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScenario || (selectedOptions.length === 0 && !userAction.trim())) return;

    setIsLoading(true);
    try {
      const selectedLabels = selectedScenario.options
        .filter(opt => selectedOptions.includes(opt.id))
        .map(opt => opt.label)
        .join(', ');
      
      const combinedInput = `My reactions were: ${selectedLabels}. Additional details: ${userAction}`;
      
      const feedback = await getSimulatedResponse(selectedScenario.description, combinedInput);
      setAiFeedback(feedback || "That's a good step. Remember to keep breathing.");
    } catch (err) {
      setAiFeedback("Great thinking. Practical tip: Focus on one step at a time.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSelectedScenario(null);
    setSelectedOptions([]);
    setUserAction('');
    setAiFeedback(null);
  };

  if (selectedScenario) {
    return (
      <div className="animate-in slide-in-from-right-4 duration-500 max-w-3xl mx-auto">
        <button 
          onClick={reset}
          className="text-slate-500 font-bold flex items-center gap-2 mb-6 hover:text-indigo-600 transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Scenarios
        </button>

        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-2xl">
          <div className="bg-indigo-600 p-8 lg:p-10 text-white relative">
            <div className="text-5xl mb-6">{selectedScenario.icon}</div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">{selectedScenario.title}</h2>
            <p className="text-indigo-100 italic leading-relaxed text-lg">"{selectedScenario.description}"</p>
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            </div>
          </div>

          <div className="p-8 lg:p-10">
            {!aiFeedback ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-slate-800 font-bold mb-4 text-sm uppercase tracking-wider">
                    Which of these sounds like you? (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {selectedScenario.options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleOption(opt.id)}
                        className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 border-2 ${
                          selectedOptions.includes(opt.id)
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105'
                            : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-3 text-sm uppercase tracking-wider">
                    Add any other details (Optional)
                  </label>
                  <textarea 
                    value={userAction}
                    onChange={(e) => setUserAction(e.target.value)}
                    placeholder="Briefly describe what you did or felt..."
                    className="w-full min-h-[100px] p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading || (selectedOptions.length === 0 && !userAction.trim())}
                  className="w-full bg-indigo-600 text-white font-bold py-5 rounded-[1.5rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed text-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Consulting Coach...
                    </span>
                  ) : 'Get Coaching Feedback'}
                </button>
              </form>
            ) : (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl"></div>
                  <h4 className="text-emerald-800 font-bold mb-4 flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    Coach's Analysis
                  </h4>
                  <p className="text-emerald-900 leading-relaxed text-lg italic font-medium">
                    "{aiFeedback}"
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => { setAiFeedback(null); setUserAction(''); setSelectedOptions([]); }}
                    className="flex-1 bg-white text-slate-600 font-bold py-4 rounded-2xl border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all"
                  >
                    Try Another Way
                  </button>
                  <button 
                    onClick={reset}
                    className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-lg"
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
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Rehearse the Moment 🎯</h2>
        <p className="text-slate-500 text-lg">Don't let exam stress surprise you. Practice your reaction to these common "panic triggers" now.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedScenario(s)}
            className="text-left bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-slate-50 rounded-full transition-all group-hover:scale-150 group-hover:bg-indigo-50/50"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{s.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-slate-500 leading-relaxed line-clamp-2 text-sm">{s.description}</p>
              <div className="mt-6 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Practice Reaction 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamSimulator;
