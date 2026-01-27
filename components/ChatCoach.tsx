
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
    <div className="flex flex-col h-[75vh] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">ZC</div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">ZenBoard Coach</h3>
          <p className="text-[10px] text-emerald-500 font-bold uppercase">Online & Listening</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
            }`}>
              {m.role === 'user' ? (
                <div>{m.text}</div>
              ) : (
                <div 
                  className="markdown-content" 
                  dangerouslySetInnerHTML={renderContent(m.text)} 
                />
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-3 rounded-2xl flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share your exam fear..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button 
          type="submit"
          className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </form>
    </div>
  );
};

export default ChatCoach;
