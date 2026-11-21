import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Send, Sparkles, Settings } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'What are the common complaints?',
  'Top praised product?',
  'Reviews needing reply?',
];

export default function AIAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "I'm your ReviewLens AI copilot. Configure your Gemini API key in Settings to query your review dataset.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessages = [
      ...messages,
      {
        id: Date.now(),
        sender: 'user',
        text: userText,
        timestamp: timeNow,
      },
      {
        id: Date.now() + 1,
        sender: 'assistant',
        text: "Gemini AI is currently disconnected. Add your GEMINI_API_KEY in Settings to enable live responses.",
        isWarning: true,
        timestamp: timeNow,
      },
    ];

    setMessages(newMessages);
    setInput('');
  };

  const handleQuestionClick = (question) => {
    setInput(question);
  };

  return (
    <div className="rounded-2xl bg-[#0C0C0F] border border-white/10 flex flex-col h-[430px] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#000000]/60">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] border border-[#00F0FF]/25">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide">ReviewLens Copilot</h4>
            <span className="text-[10px] text-[#8E8E98]">AI Review Assistant</span>
          </div>
        </div>

        {/* Status Pill */}
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/25">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FBBF24]" />
          Gemini Disconnected
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'gradient-growth text-black font-semibold rounded-tr-none shadow-md shadow-[#00F0FF]/15'
                  : msg.isWarning
                  ? 'bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[#F4F4F6] rounded-tl-none'
                  : 'bg-[#141418] border border-white/10 text-[#F4F4F6] rounded-tl-none'
              }`}
            >
              {msg.text}
              {msg.isWarning && (
                <button
                  onClick={() => navigate('/settings')}
                  className="mt-1.5 block text-[11px] font-semibold text-[#00F0FF] hover:underline"
                >
                  Configure in Settings →
                </button>
              )}
            </div>
            <span className="text-[9px] text-[#8E8E98]/70 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="px-3.5 py-2 border-t border-white/10 bg-[#000000]/60 overflow-x-auto flex gap-1.5 no-scrollbar">
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleQuestionClick(q)}
            className="whitespace-nowrap px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#141418] hover:bg-white/10 text-[#8E8E98] hover:text-white border border-white/5 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-[#0C0C0F] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-[#000000] border border-white/10 text-xs text-white placeholder-[#8E8E98]/50 focus:border-[#00F0FF] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-3.5 py-2 rounded-xl gradient-growth text-black font-semibold text-xs disabled:opacity-40 disabled:pointer-events-none hover:opacity-95 transition-all flex items-center justify-center"
          aria-label="Send message"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
