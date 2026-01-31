
import React, { useState, useEffect, useRef } from 'react';
import { generateSpeech, decodeBase64, decodeAudioData } from '../services/geminiService';

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
  Notice: 6,
  Park: 6,
  Refocus: 7
};

const STEP_SCRIPTS: Record<string, string> = {
  Notice: "Notice the thought popping up. Don't fight it. Just see it as noise, like a passing cloud in the sky.",
  Park: "Now, mentally put that thought in a waiting room outside this hall. Tell yourself: I can deal with this after the exam. It can wait.",
  Refocus: "Good. Now, focus back on your paper. Repeat this anchor with me: I only need to solve this one question."
};

const ClearTheNoise: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState<NoiseStep>('Ready');
  const [focusLine, setFocusLine] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const playVoiceInstruction = async (text: string) => {
    if (!audioContextRef.current) return;
    setIsVoiceLoading(true);
    try {
      const base64Audio = await generateSpeech(text);
      if (base64Audio) {
        const audioBuffer = await decodeAudioData(
          decodeBase64(base64Audio),
          audioContextRef.current,
          24000,
          1
        );
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start();
      }
    } catch (error) {
      console.error("Audio playback failed", error);
    } finally {
      setIsVoiceLoading(false);
    }
  };

  // Handle Step Transitions
  useEffect(() => {
    let timeout: any;
    
    if (step === 'Notice') {
      setTimeLeft(STEP_DURATIONS.Notice);
      playVoiceInstruction(STEP_SCRIPTS.Notice);
      timeout = setTimeout(() => setStep('Park'), STEP_DURATIONS.Notice * 1000);
    } else if (step === 'Park') {
      setTimeLeft(STEP_DURATIONS.Park);
      playVoiceInstruction(STEP_SCRIPTS.Park);
      timeout = setTimeout(() => {
        const line = SELF_TALK_LINES[Math.floor(Math.random() * SELF_TALK_LINES.length)];
        setFocusLine(line);
        setStep('Refocus');
      }, STEP_DURATIONS.Park * 1000);
    } else if (step === 'Refocus') {
      setTimeLeft(STEP_DURATIONS.Refocus);
      playVoiceInstruction(STEP_SCRIPTS.Refocus);
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
      case 'Park': return "Mentally file it away. It can wait.";
      case 'Refocus': return focusLine;
      case 'Done': return "You're back. Go for the next mark.";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto px-6 text-center animate-in fade-in duration-700">
      <div className="mb-6 flex flex-col items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-4 py-1.5 rounded-full">
          Voice Guided Reset
        </span>
        {isVoiceLoading && (
          <div className="flex gap-1 animate-pulse">
            <div className="w-1 h-3 bg-indigo-400 rounded-full"></div>
            <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
            <div className="w-1 h-3 bg-indigo-400 rounded-full"></div>
          </div>
        )}
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
            Turn on your sound. A voice coach will now guide you through clearing your mind and getting back to your exam paper.
          </p>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left space-y-3 shadow-inner">
            <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wide flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" /></svg>
              Step-by-Step Guide:
            </h4>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
              <p className="text-slate-600 text-xs lg:text-sm"><strong>Acknowledge:</strong> See the thought as simple noise.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
              <p className="text-slate-600 text-xs lg:text-sm"><strong>Park:</strong> File the thought in a mental box for later.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
              <p className="text-slate-600 text-xs lg:text-sm"><strong>Refocus:</strong> Listen to the anchor phrase and repeat it.</p>
            </div>
          </div>
        </div>
      )}

      {step !== 'Ready' && (
        <div className="h-32 mb-12 flex items-center justify-center max-w-lg">
          <p className={`text-xl lg:text-2xl leading-relaxed transition-all duration-700 ${
            step === 'Refocus' ? 'text-indigo-600 font-bold scale-110' : 'text-slate-500'
          }`}>
            {getSubtext()}
          </p>
        </div>
      )}

      <div className={`relative flex items-center justify-center w-full transition-all duration-500 ${step === 'Ready' ? 'h-32 mb-6' : 'h-64 mb-16'}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          {step === 'Ready' && (
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-3xl animate-pulse shadow-inner border border-indigo-100/50">
              🧠
            </div>
          )}
          {step === 'Notice' && (
            <div className="flex gap-1 animate-pulse relative">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-16 bg-slate-200 rounded-full" style={{ animationDelay: `${i * 0.1}s`, height: `${10 + Math.random() * 40}px` }}></div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-24 h-24 border-2 border-indigo-200 rounded-full border-t-indigo-600 animate-spin"></div>
              </div>
            </div>
          )}
          {step === 'Park' && (
            <div className="w-32 h-32 flex flex-col items-center justify-center animate-bounce">
              <div className="w-24 h-24 bg-slate-100 border-2 border-slate-300 rounded-2xl flex items-center justify-center">
                 <div className="w-12 h-2 bg-slate-300 rounded-full"></div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Storing Noise</div>
            </div>
          )}
          {step === 'Refocus' && (
            <div className="relative">
              <div className="w-40 h-40 bg-indigo-600 rounded-full animate-ping opacity-10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl shadow-xl shadow-indigo-200">
                  🎯
                </div>
              </div>
            </div>
          )}
          {step === 'Done' && (
            <div className="text-emerald-500 scale-125 transition-transform duration-700">
              <svg className="w-28 h-28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-xs">
        {step === 'Ready' ? (
          <button 
            onClick={start}
            className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            Start Session
          </button>
        ) : step === 'Done' ? (
          <button 
            onClick={onBack}
            className="w-full bg-slate-800 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
          >
            Back to Paper
          </button>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-slate-400 font-bold uppercase tracking-widest animate-pulse mb-3 text-xs">
              Follow the Coach's Voice
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
               <div 
                 className="h-full bg-indigo-500 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(99,102,241,0.5)]"
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
