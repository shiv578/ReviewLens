import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Send, Sparkles, Loader2, Bot } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

const SUGGESTED_QUESTIONS = [
  'What are the common complaints?',
  'Top praised product?',
  'Reviews needing reply?',
];

export default function AIAssistant() {
  const navigate = useNavigate();
  const { backendHealth } = useApp();
  const isGeminiReady = Boolean(backendHealth?.gemini?.configured);
  const geminiModel = backendHealth?.gemini?.model || 'gemini-3.8-flash';

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "I'm your ReviewLens AI copilot powered by Google Gemini. Ask me anything about sentiment patterns, customer complaints, or review trends.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (userText) => {
    if (!userText.trim() || isLoading) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = Date.now();

    // Append user message
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: userText,
        timestamp: timeNow,
      },
    ]);

    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', { message: userText });
      const replyText = response.data?.reply || 'Received response from Gemini.';

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: replyText,
          model: response.data?.model || geminiModel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Gemini chat error:', err);
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err.code === 'ECONNABORTED'
          ? 'Gemini request timed out. Please try again.'
          : isGeminiReady
          ? 'Unable to reach backend API. Please make sure the server is running on port 5000.'
          : 'Gemini AI is not configured. Add your GEMINI_API_KEY in server/.env to enable live responses.');

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: errMsg,
          isWarning: !isGeminiReady,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input.trim());
  };

  const handleQuestionClick = (question) => {
    setInput(question);
    sendMessage(question);
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
        {isGeminiReady ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#10E599]/10 text-[#10E599] border border-[#10E599]/25 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10E599] animate-pulse" />
            Gemini Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/25">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FBBF24]" />
            Gemini Disconnected
          </span>
        )}
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
            <div className="flex items-center gap-1.5 mt-1 px-1">
              {msg.model && (
                <span className="text-[8px] uppercase tracking-wider px-1 py-0.2 rounded bg-white/5 text-[#00F0FF]">
                  {msg.model}
                </span>
              )}
              <span className="text-[9px] text-[#8E8E98]/70">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="bg-[#141418] border border-white/10 text-[#F4F4F6] rounded-xl rounded-tl-none px-3.5 py-2.5 text-xs flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#00F0FF]" />
              <span className="text-[#8E8E98]">Gemini is analyzing...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="px-3.5 py-2 border-t border-white/10 bg-[#000000]/60 overflow-x-auto flex gap-1.5 no-scrollbar">
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleQuestionClick(q)}
            className="whitespace-nowrap px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#141418] hover:bg-white/10 text-[#8E8E98] hover:text-white border border-white/5 transition-colors disabled:opacity-50"
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
          placeholder={isGeminiReady ? "Ask Gemini about reviews..." : "Configure Gemini key in Settings..."}
          className="flex-1 px-3.5 py-2 rounded-xl bg-[#000000] border border-white/10 text-xs text-white placeholder-[#8E8E98]/50 focus:border-[#00F0FF] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-3.5 py-2 rounded-xl gradient-growth text-black font-semibold text-xs disabled:opacity-40 disabled:pointer-events-none hover:opacity-95 transition-all flex items-center justify-center"
          aria-label="Send message"
        >
          {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        </button>
      </form>
    </div>
  );
}
