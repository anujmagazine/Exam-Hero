
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { startChatCoach } from '../services/geminiService';
import { marked } from 'marked';

const ChatCoach: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hey there! I'm ZenBoard Coach. Board exams can feel like a lot, but I'm here to help you stay calm and focused. \n\nWhat's on your mind? Fear of a certain subject? Running out of time?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [chatInstance, setChatInstance] = useState<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let currentChat = chatInstance;
      if (!currentChat) {
        currentChat = await startChatCoach([]);
        setChatInstance(currentChat);
      }

      const result = await currentChat.sendMessage({ message: input });
      const modelMsg: Message = { role: 'model', text: result.text || "I'm listening. Tell me more.", timestamp: new Date() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: "I'm having a little trouble connecting, but remember: exams are just a measure of one day's performance. Take a deep breath and keep going!",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderContent = (text: string) => {
    // Synchronous parse for simple strings in marked v12
    const html = marked.parse(text) as string;
    return { __html: html };
  };

  return (
    <div className="flex flex-col h-[70vh] lg:h-[80vh] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 lg:p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm lg:text-base font-bold shadow-md shadow-indigo-100">ZC</div>
          <div>
            <h3 className="text-base font-bold text-slate-900">ZenBoard Coach</h3>
            <p className="text-[10px] lg:text-xs text-emerald-500 font-bold uppercase tracking-wider">Online & Listening</p>
          </div>
        </div>
        <div className="hidden lg:block text-xs font-medium text-slate-400 italic">
          Your private mental health space
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 bg-slate-50/30">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] lg:max-w-[75%] p-5 lg:p-6 rounded-2xl text-base leading-relaxed shadow-sm transition-all ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                {m.role === 'user' ? (
                  <div className="font-medium">{m.text}</div>
                ) : (
                  <div 
                    className="markdown-content prose prose-slate max-w-none" 
                    dangerouslySetInnerHTML={renderContent(m.text)} 
                  />
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl flex gap-1.5 border border-slate-100 shadow-sm">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      <div className="p-4 lg:p-8 border-t border-slate-100 bg-white">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your exam fear..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-base focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-6 lg:px-8 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatCoach;
