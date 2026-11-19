import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Send, Sparkles, Settings, User } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'What are the most common complaints?',
  'Which product has the most negative reviews?',
  'What do customers like the most?',
  'Summarise the delivery problems',
  'Which reviews need an urgent reply?',
];

export default function AIAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I'm your ReviewLens AI assistant. Connect your Gemini API key in Settings to start asking questions directly against your review data.",
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
        text: "The Gemini AI engine is currently in setup mode and disconnected. To query your review data, please configure your GEMINI_API_KEY in the Workspace Settings.",
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
    <div className="rounded-3xl bg-[#101A2B] border border-[#9165F5]/20 flex flex-col h-[520px] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#080D19]/40">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-[#9165F5]/10 flex items-center justify-center text-[#9165F5] border border-[#9165F5]/20">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide">Ask ReviewLens AI</h4>
            <span className="text-[10px] text-[#9BAAC0]">Review Intelligence Assistant</span>
          </div>
        </div>

        {/* Gemini Status Badge */}
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F5B942]/10 text-[#F5B942] border border-[#F5B942]/20">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F5B942]" />
          Gemini: Not Connected
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
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-[#10D6A0] to-[#20C5F5] text-[#080D19] font-medium rounded-tr-none'
                  : msg.isWarning
                  ? 'bg-[#F5B942]/10 border border-[#F5B942]/20 text-[#F4F7FC] rounded-tl-none'
                  : 'bg-[#080D19] border border-white/5 text-[#F4F7FC] rounded-tl-none'
              }`}
            >
              {msg.text}
              {msg.isWarning && (
                <button
                  onClick={() => navigate('/settings')}
                  className="mt-2 block text-[11px] font-semibold text-[#10D6A0] hover:underline"
                >
                  Go to Settings →
                </button>
              )}
            </div>
            <span className="text-[9px] text-[#9BAAC0]/60 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3 py-2 border-t border-white/5 bg-[#080D19]/40 overflow-x-auto flex gap-1.5 no-scrollbar">
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleQuestionClick(q)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/5 hover:bg-white/10 text-[#9BAAC0] hover:text-white border border-white/5 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-[#101A2B] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your reviews..."
          className="flex-1 px-3 py-2 rounded-xl bg-[#080D19] border border-white/10 text-xs text-white placeholder-[#9BAAC0]/60 focus:border-[#10D6A0] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-3.5 py-2 rounded-xl gradient-growth text-[#080D19] font-semibold text-xs disabled:opacity-40 disabled:pointer-events-none hover:opacity-95 transition-all flex items-center justify-center"
          aria-label="Send message"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
