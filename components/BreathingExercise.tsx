
import React, { useState, useEffect } from 'react';

const BreathingExercise: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Ready'>('Ready');
  const [timer, setTimer] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t === 1) {
            if (phase === 'Inhale') { setPhase('Hold'); return 4; }
            if (phase === 'Hold') { setPhase('Exhale'); return 4; }
            if (phase === 'Exhale') { setPhase('Inhale'); return 4; }
            if (phase === 'Ready') { setPhase('Inhale'); return 4; }
            return 4;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggle = () => {
    if (!isActive) {
      setPhase('Inhale');
      setTimer(4);
    } else {
      setPhase('Ready');
    }
    setIsActive(!isActive);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in-95 duration-500">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Box Breathing 🌬️</h2>
        <p className="text-slate-500 max-w-sm">Use this 4-4-4 technique to lower your heart rate instantly whenever you feel overwhelmed.</p>
      </div>

      <div className="relative flex items-center justify-center w-64 h-64 mb-12">
        {/* Breathing Circle Background */}
        <div 
          className={`absolute inset-0 bg-indigo-100 rounded-full transition-all duration-[4000ms] ease-in-out ${
            phase === 'Inhale' ? 'scale-110 opacity-60' : 
            phase === 'Exhale' ? 'scale-50 opacity-100' : 'scale-75 opacity-80'
          }`}
        />
        
        {/* Central Counter */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-indigo-600 font-bold text-5xl mb-1">{isActive ? timer : '•'}</span>
          <span className="text-indigo-800 font-bold text-lg uppercase tracking-widest">{phase}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button 
          onClick={toggle}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
            isActive ? 'bg-white text-slate-600 border border-slate-200' : 'bg-indigo-600 text-white shadow-indigo-100'
          }`}
        >
          {isActive ? 'Stop' : 'Start Breathing'}
        </button>
        <button 
          onClick={onBack}
          className="w-full py-3 text-slate-400 font-semibold hover:text-slate-600 transition-colors"
        >
          Go Back
        </button>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-slate-900 font-bold">4 Sec</div>
          <div className="text-slate-400 text-[10px] uppercase">Inhale</div>
        </div>
        <div>
          <div className="text-slate-900 font-bold">4 Sec</div>
          <div className="text-slate-400 text-[10px] uppercase">Hold</div>
        </div>
        <div>
          <div className="text-slate-900 font-bold">4 Sec</div>
          <div className="text-slate-400 text-[10px] uppercase">Exhale</div>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
