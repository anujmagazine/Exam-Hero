
import React, { useState, useEffect } from 'react';

type NoiseStep = 'Ready' | 'Notice' | 'Park' | 'Refocus' | 'Done';

const SELF_TALK_LINES = [
  "I only need to solve this question.",
  "Slow is steady.",
  "I’ve handled harder moments.",
  "One step at a time.",
  "Stay on this page. Nothing else matters.",
  "I am prepared for this moment."
];

const STEP_DURATIONS: Record<string, number> = {
  Notice: 4,
  Park: 4,
  Refocus: 5
};

const ClearTheNoise: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState<NoiseStep>('Ready');
  const [focusLine, setFocusLine] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  // Handle Step Transitions
  useEffect(() => {
    let timeout: any;
    
    if (step === 'Notice') {
      setTimeLeft(STEP_DURATIONS.Notice);
      timeout = setTimeout(() => setStep('Park'), STEP_DURATIONS.Notice * 1000);
    } else if (step === 'Park') {
      setTimeLeft(STEP_DURATIONS.Park);
      timeout = setTimeout(() => {
        setFocusLine(SELF_TALK_LINES[Math.floor(Math.random() * SELF_TALK_LINES.length)]);
        setStep('Refocus');
      }, STEP_DURATIONS.Park * 1000);
    } else if (step === 'Refocus') {
      setTimeLeft(STEP_DURATIONS.Refocus);
      timeout = setTimeout(() => setStep('Done'), STEP_DURATIONS.Refocus * 1000);
    }

    return () => clearTimeout(timeout);
  }, [step]);

  // Handle Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const start = () => {
    setStep('Notice');
  };

  const getHeading = () => {
    switch (step) {
      case 'Ready': return "Clear the Noise";
      case 'Notice': return "Notice the thought";
      case 'Park': return "Park it for later";
      case 'Refocus': return "Focus on this";
      case 'Done': return "Focus Locked";
      default: return "";
    }
  };

  const getSubtext = () => {
    switch (step) {
      case 'Ready': return "Stop spiraling thoughts and get back to your paper.";
      case 'Notice': return "Don't judge it. Just see it as noise.";
      case 'Park': return "Mentally file it away. You can deal with it after the exam.";
      case 'Refocus': return focusLine;
      case 'Done': return "You're back in the room. Go for the next mark.";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto px-6 text-center animate-in fade-in duration-700">
      <div className="mb-6">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-4 py-1.5 rounded-full">
          Mental Reset
        </span>
      </div>
      
      <div className="h-16 mb-4 flex flex-col items-center justify-center">
        <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 transition-all duration-500">
          {getHeading()}
        </h2>
        {timeLeft > 0 && (step !== 'Ready' && step !== 'Done') && (
          <span className="text-indigo-600 font-bold text-sm mt-1 animate-pulse">
            {timeLeft}s remaining
          </span>
        )}
      </div>

      {step === 'Ready' && (
        <div className="mb-4 max-w-md animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <p className="text-slate-600 leading-relaxed mb-4 text-sm lg:text-base">
            When your mind starts wandering to "what if" fears or distracting thoughts during an exam, you need to <strong>Clear the Noise</strong> to get back to the current question.
          </p>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left space-y-3">
            <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wide">How it works:</h4>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
              <p className="text-slate-600 text-xs lg:text-sm"><strong>Acknowledge:</strong> See the thought clearly without getting angry at it. (4s)</p>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
              <p className="text-slate-600 text-xs lg:text-sm"><strong>Park:</strong> Mentally put that thought in a "waiting room" for later. (4s)</p>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
              <p className="text-slate-600 text-xs lg:text-sm"><strong>Refocus:</strong> Repeat a simple anchor line to get back to work. (5s)</p>
            </div>
          </div>
        </div>
      )}

      {step !== 'Ready' && (
        <div className="h-32 mb-12 flex items-center justify-center max-w-lg">
          <p className={`text-lg lg:text-xl leading-relaxed transition-all duration-700 ${
            step === 'Refocus' ? 'text-indigo-600 font-bold scale-110' : 'text-slate-500'
          }`}>
            {getSubtext()}
          </p>
        </div>
      )}

      <div className={`relative flex items-center justify-center w-full transition-all duration-500 ${step === 'Ready' ? 'h-32 mb-6' : 'h-64 mb-16'}`}>
        {/* Animated Visuals */}
        <div className="absolute inset-0 flex items-center justify-center">
          {step === 'Ready' && (
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-3xl animate-pulse shadow-inner border border-indigo-100/50">
              🧠
            </div>
          )}
          {step === 'Notice' && (
            <div className="flex gap-1 animate-pulse relative">
              <div className="w-2 h-12 bg-slate-200 rounded-full rotate-12"></div>
              <div className="w-2 h-16 bg-slate-300 rounded-full -rotate-12"></div>
              <div className="w-2 h-10 bg-slate-200 rounded-full rotate-45"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-20 h-20 border-2 border-indigo-200 rounded-full border-t-indigo-600 animate-spin"></div>
              </div>
            </div>
          )}
          {step === 'Park' && (
            <div className="w-24 h-32 border-2 border-slate-200 rounded-lg flex items-center justify-center animate-bounce">
              <div className="w-16 h-1 bg-slate-200 rounded-full"></div>
            </div>
          )}
          {step === 'Refocus' && (
            <div className="relative">
              <div className="w-32 h-32 bg-indigo-600 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">🎯</div>
              </div>
            </div>
          )}
          {step === 'Done' && (
            <div className="text-emerald-500 scale-125 transition-transform duration-700">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-xs">
        {step === 'Ready' ? (
          <button 
            onClick={start}
            className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
          >
            Start Refocus
          </button>
        ) : step === 'Done' ? (
          <button 
            onClick={onBack}
            className="w-full bg-slate-800 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
          >
            Back to Work
          </button>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-slate-300 font-bold uppercase tracking-widest animate-pulse mb-2">
              Stay Focused
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-indigo-500 transition-all duration-1000 ease-linear"
                 style={{ width: `${(timeLeft / (STEP_DURATIONS[step] || 5)) * 100}%` }}
               ></div>
            </div>
          </div>
        )}
      </div>
      
      {(step === 'Ready' || step === 'Done') && (
        <button 
          onClick={onBack}
          className="mt-6 text-slate-400 font-semibold hover:text-slate-600 transition-colors text-sm"
        >
          Go back
        </button>
      )}
    </div>
  );
};

export default ClearTheNoise;
