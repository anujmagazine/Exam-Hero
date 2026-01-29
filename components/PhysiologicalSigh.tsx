
import React, { useState, useEffect } from 'react';

type Step = 'Ready' | 'Inhale' | 'Top-up' | 'Exhale' | 'Finished';

const PhysiologicalSigh: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState<Step>('Ready');
  const [cycle, setCycle] = useState(1);
  const totalCycles = 2;

  useEffect(() => {
    let timeout: any;
    
    if (step === 'Inhale') {
      // Step 1: Inhale slowly through the nose (4 seconds)
      timeout = setTimeout(() => setStep('Top-up'), 4000);
    } else if (step === 'Top-up') {
      // Step 2: Take a short second inhale to top up the lungs (1 second)
      timeout = setTimeout(() => setStep('Exhale'), 1000);
    } else if (step === 'Exhale') {
      // Step 3: Long slow exhale through the mouth (8 seconds)
      timeout = setTimeout(() => {
        if (cycle < totalCycles) {
          setCycle(c => c + 1);
          setStep('Inhale');
        } else {
          setStep('Finished');
        }
      }, 8000);
    }

    return () => clearTimeout(timeout);
  }, [step, cycle]);

  const start = () => {
    setCycle(1);
    setStep('Inhale');
  };

  const getInstruction = () => {
    switch (step) {
      case 'Ready': return "The Rapid Biological Reset";
      case 'Inhale': return "Inhale slowly through your nose";
      case 'Top-up': return "Quick second inhale to top up";
      case 'Exhale': return "Long, slow exhale through the mouth";
      case 'Finished': return "Your body is settling. You’re in control.";
      default: return "";
    }
  };

  const getCircleScale = () => {
    switch (step) {
      case 'Ready': return 'scale-[0.6] opacity-20';
      case 'Inhale': return 'scale-100 opacity-60';
      case 'Top-up': return 'scale-110 opacity-90';
      case 'Exhale': return 'scale-[0.4] opacity-30';
      case 'Finished': return 'scale-90 opacity-100';
      default: return 'scale-75';
    }
  };

  const getCircleColor = () => {
    if (step === 'Finished') return 'bg-emerald-500';
    if (step === 'Exhale') return 'bg-indigo-400';
    return 'bg-indigo-600';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto px-6 text-center animate-in fade-in duration-700">
      <div className="mb-6">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-4 py-1.5 rounded-full">
          Neuroscience Tool
        </span>
      </div>
      
      <div className="h-24 mb-6 flex items-center justify-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 transition-all duration-500">
          {getInstruction()}
        </h2>
      </div>

      {step === 'Ready' && (
        <div className="mb-10 max-w-md animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <p className="text-slate-600 leading-relaxed">
            The <strong>Physiological Sigh</strong> is a real-time tool to lower your heart rate. 
            By adding a second "sniff" at the top of your breath, you re-inflate tiny air sacs in your lungs, 
            allowing you to offload maximum CO2 on the exhale. 
            <span className="block mt-2 font-medium text-indigo-600">It's a biological "off-switch" for stress.</span>
          </p>
        </div>
      )}

      <div className="relative flex items-center justify-center w-64 h-64 lg:w-80 lg:h-80 mb-12">
        {/* Outer Glow */}
        <div 
          className={`absolute inset-0 rounded-full transition-all duration-700 ease-out bg-indigo-200/20 blur-3xl ${step === 'Top-up' ? 'scale-125' : 'scale-100'}`}
        />
        
        {/* Main Animated Circle */}
        <div 
          className={`absolute inset-0 rounded-full transition-all duration-[4000ms] ${getCircleScale()} ${getCircleColor()} shadow-2xl shadow-indigo-200/50`}
          style={{ 
            transitionDuration: step === 'Top-up' ? '800ms' : step === 'Exhale' ? '8000ms' : '4000ms',
            transitionTimingFunction: step === 'Top-up' ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        
        {/* Inner Border Circle */}
        <div 
          className={`absolute inset-12 rounded-full transition-all duration-[4000ms] border-2 border-white/20 ${getCircleScale()}`}
          style={{ 
            transitionDuration: step === 'Top-up' ? '800ms' : step === 'Exhale' ? '8000ms' : '4000ms',
          }}
        />

        {/* Phase Progress (Cycle dots) */}
        {step !== 'Ready' && step !== 'Finished' && (
          <div className="absolute -bottom-8 flex gap-3">
             {[...Array(totalCycles)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-500 ${cycle > i ? 'bg-indigo-600 w-6' : 'bg-slate-200'}`} 
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-xs space-y-6">
        {step === 'Ready' ? (
          <button 
            onClick={start}
            className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
          >
            Start Reset
          </button>
        ) : step === 'Finished' ? (
          <button 
            onClick={onBack}
            className="w-full bg-emerald-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
          >
            I feel settled
          </button>
        ) : (
          <button 
            onClick={() => setStep('Ready')}
            className="text-slate-400 font-semibold hover:text-slate-600 transition-colors text-sm"
          >
            Reset
          </button>
        )}
        
        {(step === 'Ready' || step === 'Finished') && (
          <button 
            onClick={onBack}
            className="text-slate-400 font-semibold hover:text-slate-600 transition-colors text-sm"
          >
            Go back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default PhysiologicalSigh;
