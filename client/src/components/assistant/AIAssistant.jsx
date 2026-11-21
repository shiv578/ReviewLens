import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Send, Loader2, Sparkles, MessageSquareQuote } from 'lucide-react';
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
  const geminiModel = backendHealth?.gemini?.model || 'gemini-3.5-flash-lite';

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

    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text: userText, timestamp: timeNow }]);
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

  return (
    <div
      className="rounded-2xl flex flex-col h-[460px] shadow-lg overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '2px solid var(--accent)',
        boxShadow: '0 8px 24px -4px var(--accent-soft), 0 0 0 1px var(--accent-soft)',
      }}
    >
      {/* Header with Dashboard Theme Gradient Accent */}
      <div
        className="p-4 flex items-center justify-between transition-colors"
        style={{
          borderBottom: `1px solid var(--border)`,
          background: 'linear-gradient(180deg, var(--accent-soft) 0%, transparent 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-2xl flex items-center justify-center shadow-md transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
              color: 'var(--btn-text)',
            }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                ReviewLens Copilot
              </h4>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  border: `1px solid var(--border)`,
                }}
              >
                AI
              </span>
            </div>
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
              Intelligent Customer Feedback Assistant
            </span>
          </div>
        </div>

        {/* Live Status Badge */}
        {isGeminiReady ? (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm"
            style={{
              backgroundColor: 'rgba(56,161,105,0.12)',
              color: '#38A169',
              border: '1px solid rgba(56,161,105,0.3)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Gemini Active
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
            style={{
              backgroundColor: 'rgba(214,158,46,0.12)',
              color: '#D69E2E',
              border: '1px solid rgba(214,158,46,0.3)',
            }}
          >
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            Gemini Disconnected
          </span>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-transparent to-black/[0.01]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-end gap-2 max-w-[88%]">
              {msg.sender === 'assistant' && (
                <div
                  className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0 mb-1"
                  style={{
                    backgroundColor: 'var(--accent-soft)',
                    color: 'var(--accent)',
                    border: `1px solid var(--border)`,
                  }}
                >
                  <Brain className="h-3.5 w-3.5" />
                </div>
              )}

              <div
                className="rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm transition-all"
                style={
                  msg.sender === 'user'
                    ? {
                        background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
                        color: 'var(--btn-text)',
                        borderRadius: '16px 16px 3px 16px',
                        boxShadow: '0 4px 12px rgba(229,62,62,0.18)',
                      }
                    : msg.isWarning
                    ? {
                        backgroundColor: 'rgba(214,158,46,0.08)',
                        border: '1px solid rgba(214,158,46,0.25)',
                        color: 'var(--text-primary)',
                        borderRadius: '3px 16px 16px 16px',
                      }
                    : {
                        backgroundColor: 'var(--bg-surface)',
                        border: `1px solid var(--border)`,
                        color: 'var(--text-primary)',
                        borderRadius: '3px 16px 16px 16px',
                      }
                }
              >
                {msg.text}
                {msg.isWarning && (
                  <button
                    onClick={() => navigate('/settings')}
                    className="mt-1.5 block text-[11px] font-bold hover:underline"
                    style={{ color: 'var(--accent)' }}
                  >
                    Configure in Settings →
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-1 px-8">
              {msg.model && (
                <span
                  className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: 'var(--accent-soft)',
                    color: 'var(--accent)',
                    border: `1px solid var(--border)`,
                  }}
                >
                  {msg.model}
                </span>
              )}
              <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-end gap-2">
            <div
              className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0 mb-1"
              style={{
                backgroundColor: 'var(--accent-soft)',
                color: 'var(--accent)',
                border: `1px solid var(--border)`,
              }}
            >
              <Brain className="h-3.5 w-3.5 animate-pulse" />
            </div>
            <div
              className="rounded-2xl px-4 py-2.5 text-xs flex items-center gap-2 shadow-sm"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: `1px solid var(--border)`,
                color: 'var(--text-secondary)',
                borderRadius: '3px 16px 16px 16px',
              }}
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: 'var(--accent)' }} />
              <span className="font-medium">Gemini is synthesizing insights...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div
        className="px-4 py-2.5 overflow-x-auto flex items-center gap-2 no-scrollbar"
        style={{
          borderTop: `1px solid var(--border)`,
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider shrink-0" style={{ color: 'var(--accent)' }}>
          SUGGESTED:
        </span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => {
              setInput(q);
              sendMessage(q);
            }}
            className="whitespace-nowrap px-3.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 hover:shadow-md disabled:opacity-50"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#FFFFFF',
              border: `1px solid var(--accent2)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'none';
              e.currentTarget.style.transform = 'none';
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form with Themed Button & Focus Glow */}
      <form
        onSubmit={handleSend}
        className="p-3.5 flex items-center gap-2.5 transition-colors"
        style={{
          borderTop: `1px solid var(--border)`,
          backgroundColor: 'var(--bg-card)',
        }}
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isGeminiReady ? 'Ask Gemini about sentiment, recurring issues, or replies...' : 'Configure Gemini key in Settings...'}
            className="w-full pl-3.5 pr-3 py-2.5 rounded-xl text-xs transition-all focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--accent)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-soft)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="h-10 px-4 rounded-xl font-bold text-xs shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
            color: '#FFFFFF',
          }}
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
