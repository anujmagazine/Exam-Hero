
import React, { useState, useEffect, useRef } from 'react';
import { generateSpeech, decodeBase64, decodeAudioData } from '../services/geminiService';

type NoiseStep = 'Ready' | 'Notice' | 'Park' | 'Refocus' | 'Done';

const SELF_TALK_LINES = [
  "I only need to solve this question.",
  "Slow is steady.",
  "I’ve handled harder moments.",
  "One step at a time.",
  "Nothing else matters except this page.",
  "I am prepared and I am here."
];

// Generous durations for a truly meditative experience
const STEP_DURATIONS: Record<string, number> = {
  Notice: 18, // Extra time to settle
  Park: 18,
  Refocus: 22
};

const STEP_SCRIPTS: Record<string, string> = {
  Notice: "Take a slow breath. Notice that thought or worry popping up right now. Don't fight it. Just see it as a bit of noise, like a passing car or a distant bird. It is just noise.",
  Park: "Now, imagine a small box waiting for you outside this room. Mentally place that noise inside that box. Tell yourself: I will pick this up after my exam. Right now, it stays there.",
  Refocus: "Open your eyes. Look at your paper. You are centered. You are here. Repeat this anchor with me: I only need to solve this one question. Just this one. You've got this."
};

const ClearTheNoise: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState<NoiseStep>('Ready');
  const [focusLine, setFocusLine] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const currentRequestCounter = useRef(0);
  const stepRef = useRef<NoiseStep>('Ready');

  // Sync stepRef for async checks in playVoiceInstruction
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // Initialize AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    return () => {
      stopCurrentAudio();
      audioContextRef.current?.close();
    };
  }, []);

  const stopCurrentAudio = () => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
        activeSourceRef.current.disconnect();
      } catch (e) {
        // Source already finished or not started
      }
      activeSourceRef.current = null;
    }
  };

  const playVoiceInstruction = async (text: string, targetStep: NoiseStep) => {
    if (!audioContextRef.current) return;
    
    // Increment local ID to track this specific call
    const requestId = currentRequestCounter.current;

    setIsVoiceLoading(true);
    try {
      // Ensure context is running - critical for timely start
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const base64Audio = await generateSpeech(text);
      
      // ABORT if the step changed or a new request started while we were waiting for API
      if (requestId !== currentRequestCounter.current || stepRef.current !== targetStep) {
        return;
      }

      if (base64Audio) {
        const audioBuffer = await decodeAudioData(
          decodeBase64(base64Audio),
          audioContextRef.current,
          24000,
          1
        );

        // Final sanity check before physical playback
        if (requestId !== currentRequestCounter.current || stepRef.current !== targetStep) {
          return;
        }

        // Double check audio context state
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        activeSourceRef.current = source;
        source.start(0); // Start immediately
      }
    } catch (error) {
      console.error("Audio playback failed", error);
    } finally {
      // Only clear loading state if this is still the relevant request
      if (requestId === currentRequestCounter.current) {
        setIsVoiceLoading(false);
      }
    }
  };

  // Main Logic Effect: Handles transitions, timers, and audio triggers
  useEffect(() => {
    let timeout: any;
    
    // CRITICAL: Stop any audio and invalidate previous fetches IMMEDIATELY on step change
    stopCurrentAudio();
    currentRequestCounter.current++; 

    if (step === 'Notice') {
      setTimeLeft(STEP_DURATIONS.Notice);
      playVoiceInstruction(STEP_SCRIPTS.Notice, 'Notice');
      timeout = setTimeout(() => setStep('Park'), STEP_DURATIONS.Notice * 1000);
    } else if (step === 'Park') {
      setTimeLeft(STEP_DURATIONS.Park);
      playVoiceInstruction(STEP_SCRIPTS.Park, 'Park');
      timeout = setTimeout(() => {
        const line = SELF_TALK_LINES[Math.floor(Math.random() * SELF_TALK_LINES.length)];
        setFocusLine(line);
        setStep('Refocus');
      }, STEP_DURATIONS.Park * 1000);
    } else if (step === 'Refocus') {
      setTimeLeft(STEP_DURATIONS.Refocus);
      playVoiceInstruction(STEP_SCRIPTS.Refocus, 'Refocus');
      timeout = setTimeout(() => setStep('Done'), STEP_DURATIONS.Refocus * 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [step]);

  // Dedicated Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const start = async () => {
    // Resume context on user gesture to ensure first instruction is timely
    if (audioContextRef.current) {
      await audioContextRef.current.resume();
    }
    setStep('Notice');
  };

  const getHeading = () => {
    switch (step) {
      case 'Ready': return "Clear the Noise";
      case 'Notice': return "Notice the thought";
      case 'Park': return "Park it for later";
      case 'Refocus': return "Anchor yourself";
      case 'Done': return "Focus Restored";
      default: return "";
    }
  };

  const getSubtext = () => {
    switch (step) {
      case 'Ready': return "Stop spiraling thoughts and get back to your paper.";
      case 'Notice': return "Just observe the thought without judgment.";
      case 'Park': return "Mentally file it away in a safe box.";
      case 'Refocus': return focusLine;
      case 'Done': return "You're back. Go for the next mark.";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto px-6 text-center animate-in fade-in duration-700">
      <div className="mb-6 flex flex-col items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-4 py-1.5 rounded-full">
          Guided Mental Reset
        </span>
        {isVoiceLoading && (
          <div className="flex gap-1 animate-pulse h-5 items-end">
            <div className="w-1 h-3 bg-indigo-300 rounded-full animate-[bounce_0.8s_infinite_0ms]"></div>
            <div className="w-1 h-5 bg-indigo-400 rounded-full animate-[bounce_0.8s_infinite_200ms]"></div>
            <div className="w-1 h-4 bg-indigo-300 rounded-full animate-[bounce_0.8s_infinite_400ms]"></div>
          </div>
        )}
      </div>
      
      <div className="h-20 mb-4 flex flex-col items-center justify-center">
        <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 transition-all duration-500">
          {getHeading()}
        </h2>
        {timeLeft > 0 && (step !== 'Ready' && step !== 'Done') && (
          <span className="text-indigo-600 font-bold text-sm mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
            Mind settling... {timeLeft}s
          </span>
        )}
      </div>

      {step === 'Ready' && (
        <div className="mb-4 max-w-md animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <p className="text-slate-600 leading-relaxed mb-6 text-sm lg:text-base">
            Turn on your volume. We've slowed down this exercise to ensure your brain has time to actually settle. Follow the coach's pace.
          </p>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-left space-y-4 shadow-sm">
            <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
              Slow & Steady Reset:
            </h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                <p className="text-slate-600 text-xs lg:text-sm"><strong>Acknowledge (18s):</strong> Give yourself space to notice the noise.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                <p className="text-slate-600 text-xs lg:text-sm"><strong>Archive (18s):</strong> Mentally put the noise in a box for later.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                <p className="text-slate-600 text-xs lg:text-sm"><strong>Anchor (22s):</strong> Re-lock your focus back on the marks.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step !== 'Ready' && (
        <div className="h-32 mb-8 flex items-center justify-center max-w-lg">
          <p className={`text-xl lg:text-2xl leading-relaxed transition-all duration-1000 ${
            step === 'Refocus' ? 'text-indigo-600 font-bold scale-105' : 'text-slate-500'
          }`}>
            {getSubtext()}
          </p>
        </div>
      )}

      <div className={`relative flex items-center justify-center w-full transition-all duration-700 ${step === 'Ready' ? 'h-32 mb-6' : 'h-64 mb-12'}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          {step === 'Ready' && (
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-3xl animate-pulse shadow-inner border border-indigo-100/50">
              🧠
            </div>
          )}
          {step === 'Notice' && (
            <div className="flex items-center justify-center gap-1.5 relative">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-1 bg-slate-200 rounded-full animate-[pulse_3s_infinite]" style={{ animationDelay: `${i * 0.15}s`, height: `${20 + Math.random() * 50}px` }}></div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-36 h-36 border border-indigo-100 rounded-full border-t-indigo-500 animate-[spin_8s_linear_infinite]"></div>
              </div>
            </div>
          )}
          {step === 'Park' && (
            <div className="w-40 h-40 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-1000">
              <div className="w-28 h-28 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-center shadow-xl relative overflow-hidden">
                 <div className="w-16 h-1 bg-slate-50 rounded-full absolute top-8"></div>
                 <div className="text-5xl animate-bounce">📦</div>
              </div>
              <div className="text-[10px] text-slate-400 mt-5 font-bold uppercase tracking-[0.2em]">Stored Away</div>
            </div>
          )}
          {step === 'Refocus' && (
            <div className="relative">
              <div className="w-56 h-56 bg-indigo-600 rounded-full animate-[ping_5s_ease-in-out_infinite] opacity-5"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 bg-indigo-600 text-white rounded-full flex items-center justify-center text-4xl shadow-2xl shadow-indigo-200 transform transition-transform duration-1000 scale-110">
                  🎯
                </div>
              </div>
            </div>
          )}
          {step === 'Done' && (
            <div className="flex flex-col items-center animate-in zoom-in duration-700">
              <div className="text-emerald-500 mb-4">
                <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Calm restored</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-xs">
        {step === 'Ready' ? (
          <button 
            onClick={start}
            className="group w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            Start Session
          </button>
        ) : step === 'Done' ? (
          <button 
            onClick={onBack}
            className="w-full bg-slate-800 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
          >
            I'm ready now
          </button>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-5">
              Instruction playing...
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
               <div 
                 className="h-full bg-indigo-500 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                 style={{ width: `${(timeLeft / (STEP_DURATIONS[step] || 18)) * 100}%` }}
               ></div>
            </div>
          </div>
        )}
      </div>
      
      {(step === 'Ready' || step === 'Done') && (
        <button 
          onClick={onBack}
          className="mt-10 text-slate-400 font-semibold hover:text-slate-600 transition-colors text-sm underline underline-offset-4 decoration-slate-200"
        >
          Cancel and go back
        </button>
      )}
    </div>
  );
};

export default ClearTheNoise;
