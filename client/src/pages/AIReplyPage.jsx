import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquareReply, Sparkles, Settings, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIReplyPage() {
  const navigate = useNavigate();
  const [tone, setTone] = useState('empathic');
  const [sampleReview, setSampleReview] = useState(
    'The product arrived 4 days late and the packaging was damaged. Very disappointed.'
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'AI Reply Studio | ReviewLens';
  }, []);

  const handleGenerate = () => {
    toast('Gemini AI engine is not connected. Configure your GEMINI_API_KEY in Settings to generate live replies.', {
      icon: '⚠️',
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Reply Studio</h2>
          <p className="text-xs md:text-sm text-[#9BAAC0]">
            Craft personalized, empathetic responses to customer complaints and negative feedback.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5B942]/10 text-[#F5B942] border border-[#F5B942]/20 self-start">
          <span className="h-2 w-2 rounded-full bg-[#F5B942]" />
          Gemini Engine: Disconnected
        </span>
      </div>

      {/* Reply Studio Form Canvas */}
      <div className="rounded-3xl bg-[#101A2B] border border-white/5 p-6 md:p-8 space-y-6 shadow-xl">
        {/* Customer Review Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            Customer Feedback / Review
          </label>
          <textarea
            rows={3}
            value={sampleReview}
            onChange={(e) => setSampleReview(e.target.value)}
            placeholder="Paste or enter customer review here..."
            className="w-full p-3 rounded-xl bg-[#080D19] border border-white/10 text-xs text-white placeholder-[#9BAAC0]/60 focus:border-[#9165F5] focus:outline-none"
          />
        </div>

        {/* Tone Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            Reply Tone & Demeanor
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'empathic', label: 'Empathetic & Solution-Focused' },
              { id: 'apologetic', label: 'Formal & Apologetic' },
              { id: 'concise', label: 'Direct & Concise' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={`p-3 rounded-xl text-xs font-medium border text-left transition-all ${
                  tone === t.id
                    ? 'border-[#9165F5] bg-[#9165F5]/10 text-white'
                    : 'border-white/5 bg-[#080D19] text-[#9BAAC0] hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => navigate('/settings')}
            className="text-xs font-semibold text-[#9165F5] hover:underline flex items-center gap-1.5"
          >
            <Settings className="h-4 w-4" />
            <span>Configure Gemini API Key in Settings</span>
          </button>

          <button
            onClick={handleGenerate}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#9165F5] hover:bg-[#9165F5]/90 flex items-center gap-2 shadow-lg shadow-[#9165F5]/20 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Draft AI Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
}
