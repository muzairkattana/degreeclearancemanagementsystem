import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

export default function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your UET Mardan AI Clearance Assistant. How can I help you with your clearance or degree process today?',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: userTime }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userText });
      const aiReply = res.data?.data?.reply || 'I am processing your query. Please refer to university clearance policies.';
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Unable to reach AI knowledge assistant. Please check your internet connection.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200 border border-white/20 cursor-pointer font-medium text-sm group"
          >
            <span className="material-symbols-outlined text-amber-300 text-2xl group-hover:rotate-12 transition-transform">
              smart_toy
            </span>
            <span>Ask AI Assistant</span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </button>
        )}
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[92vw] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#00173b] p-4 text-white flex items-center justify-between border-b border-blue-900/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <span className="material-symbols-outlined text-xl">smart_toy</span>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  Clearance AI Assistant
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-semibold border border-emerald-500/30">
                    Online
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">UET Mardan Academic Advisor</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/80">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 p-2 text-slate-500 text-xs bg-white rounded-xl w-fit border border-slate-200">
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>AI assistant is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => {
                setInput('How does the clearance process work?');
              }}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-300 hover:border-blue-500 text-slate-600 hover:text-blue-600 transition cursor-pointer"
            >
              📋 Clearance steps
            </button>
            <button
              onClick={() => {
                setInput('What are library clearance rules?');
              }}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-300 hover:border-blue-500 text-slate-600 hover:text-blue-600 transition cursor-pointer"
            >
              📚 Library dues
            </button>
            <button
              onClick={() => {
                setInput('How do I download my certificate?');
              }}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-300 hover:border-blue-500 text-slate-600 hover:text-blue-600 transition cursor-pointer"
            >
              🎓 Certificate
            </button>
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about clearance..."
              className="flex-1 py-2 px-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-[#00173b] hover:bg-blue-900 text-white disabled:opacity-40 transition cursor-pointer flex items-center justify-center shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
