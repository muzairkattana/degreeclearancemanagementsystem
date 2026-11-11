import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

// Fallback local response generator when backend is temporarily unreachable
const getFallbackLocalResponse = (query) => {
  const q = query.toLowerCase();
  if (q.includes('step') || q.includes('apply') || q.includes('how') || q.includes('procedure') || q.includes('clearance')) {
    return `📋 UET Mardan Clearance Procedure:
1. Submit your clearance application under "Apply Clearance".
2. Parallel verification requests are sent to all 8 offices: Admission, Accounts, Library, Hostel, Store, Transport, FYP, and CLO.
3. Track each department's status on your dashboard in real time.
4. When all 8 departments approve, you can download your official verified Clearance Certificate PDF.`;
  }
  if (q.includes('fee') || q.includes('challan') || q.includes('account') || q.includes('pay') || q.includes('due')) {
    return `💰 Accounts Office Requirements:
- Clear all semester tuition, exam, and registration fees.
- Deposit the degree processing fee at Bank of Khyber.
- Upload your verified bank-stamped challan scan when applying.`;
  }
  if (q.includes('book') || q.includes('library') || q.includes('deposit')) {
    return `📚 Central Library Requirements:
- Return all issued textbooks, references, and project manuals.
- Pay any overdue fines at the main library desk.
- The Librarian will approve and authorize your library security deposit refund.`;
  }
  if (q.includes('hostel') || q.includes('room') || q.includes('mess') || q.includes('warden')) {
    return `🏢 Hostel Office Requirements:
- Hand over room keys and inventory to your respective Hostel Warden.
- Clear pending mess and utility dues.
- Day-scholar non-resident students are automatically marked clear by the Provost.`;
  }
  if (q.includes('fyp') || q.includes('project') || q.includes('thesis')) {
    return `🎓 FYP Coordinator Requirements:
- Submit hardbound final thesis book signed by supervisor & external examiner.
- Provide source code repository and report CD/softcopy to the department coordinator.`;
  }
  if (q.includes('cert') || q.includes('download') || q.includes('pdf')) {
    return `📄 Certificate Download:
- Once all 8 departments verify your dues, a green "Download Official Certificate (PDF)" button appears on your dashboard.
- The PDF contains official UET Mardan seals, issue IDs, and sign-offs for the Examination Branch.`;
  }
  return `🎓 UET Mardan AI Clearance Assistant:
I can help guide you through:
• Application steps & departmental verification
• Accounts & tuition fee challan requirements
• Library book returns & security clearance
• Hostel room handover rules
• FYP thesis approval & coordinator clearance
• Downloading your official degree clearance certificate.`;
};

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
      const aiReply = res.data?.data?.reply || getFallbackLocalResponse(userText);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      // Robust client-side knowledge fallback so the chatbot never shows an error
      const fallbackReply = getFallbackLocalResponse(userText);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: fallbackReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Launcher Button - Completely Rounded with Header Dark Blue */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
            className="w-14 h-14 rounded-full bg-[#00173b] hover:bg-[#0a2b5c] text-white shadow-2xl hover:shadow-[#00173b]/60 hover:scale-108 active:scale-95 transition-all duration-300 border-2 border-amber-400/40 flex items-center justify-center cursor-pointer group relative"
          >
            {/* Robot/Brain Icon */}
            <span className="material-symbols-outlined text-amber-400 text-2xl group-hover:rotate-12 transition-transform duration-300">
              smart_toy
            </span>

            {/* Glowing Active Status Pulse */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5 -mt-0.5 -mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#00173b]"></span>
            </span>

            {/* Hover Tooltip Label */}
            <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-[#00173b] text-white text-xs font-semibold whitespace-nowrap shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              AI Clearance Assistant
            </span>
          </button>
        )}
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[92vw] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header matching site header navy #00173b */}
          <div className="bg-[#00173b] p-4 text-white flex items-center justify-between border-b border-blue-900/50 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
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
              className="w-8 h-8 rounded-full hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
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
                      ? 'bg-[#00173b] text-white rounded-br-xs'
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
                <div className="w-3.5 h-3.5 border-2 border-[#00173b] border-t-transparent rounded-full animate-spin"></div>
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
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-300 hover:border-[#00173b] text-slate-700 hover:text-[#00173b] transition cursor-pointer font-medium"
            >
              📋 Clearance steps
            </button>
            <button
              onClick={() => {
                setInput('What are library clearance rules?');
              }}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-300 hover:border-[#00173b] text-slate-700 hover:text-[#00173b] transition cursor-pointer font-medium"
            >
              📚 Library dues
            </button>
            <button
              onClick={() => {
                setInput('How do I download my certificate?');
              }}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-300 hover:border-[#00173b] text-slate-700 hover:text-[#00173b] transition cursor-pointer font-medium"
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
              className="flex-1 py-2 px-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00173b] focus:border-[#00173b] bg-slate-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-[#00173b] hover:bg-[#0a2b5c] text-white disabled:opacity-40 transition cursor-pointer flex items-center justify-center shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
