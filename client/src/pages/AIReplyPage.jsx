import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquareReply, Sparkles, Settings, Copy, Check, Loader2, RefreshCw, Languages } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export default function AIReplyPage() {
  const navigate = useNavigate();
  const { backendHealth } = useApp();
  const isGeminiReady = Boolean(backendHealth?.gemini?.configured);
  const geminiModel = backendHealth?.gemini?.model || 'gemini-3.8-flash';

  const [language, setLanguage] = useState('english');
  const [tone, setTone] = useState('empathic');
  const [productName, setProductName] = useState('Wireless Noise-Cancelling Headphones');
  const [sampleReview, setSampleReview] = useState(
    'The product arrived 4 days late and the packaging was damaged. The sound is fine, but for this price the unboxing experience was very disappointing.'
  );
  const [generatedReply, setGeneratedReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'AI Reply Studio | ReviewLens';
  }, []);

  const handleGenerate = async () => {
    if (!sampleReview.trim()) {
      toast.error('Please enter a customer review to draft a reply');
      return;
    }

    if (!isGeminiReady) {
      toast('Gemini AI engine is not connected. Configure your GEMINI_API_KEY in server/.env or Settings.', {
        icon: '⚠️',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post('/ai/reply', {
        reviewText: sampleReview,
        tone,
        productName: productName.trim() || undefined,
        language,
      });

      setGeneratedReply(response.data?.reply || '');
      toast.success(`Drafted ${language === 'hindi' ? 'Hindi' : 'English'} reply with ${response.data?.model || 'Gemini'}!`);
    } catch (err) {
      console.error('Error generating reply:', err);
      toast.error(err.response?.data?.message || 'Failed to generate reply from Gemini');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedReply) return;
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    toast.success('Copied reply to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Reply Studio</h2>
          <p className="text-xs md:text-sm text-[#8E8E98]">
            Craft personalized, empathetic responses to customer complaints and negative feedback using Google Gemini.
          </p>
        </div>

        {isGeminiReady ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#10E599]/10 text-[#10E599] border border-[#10E599]/25 self-start shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#10E599] animate-pulse" />
            Gemini Engine: Active ({geminiModel})
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20 self-start">
            <span className="h-2 w-2 rounded-full bg-[#FBBF24]" />
            Gemini Engine: Disconnected
          </span>
        )}
      </div>

      {/* Reply Studio Form Canvas */}
      <div className="rounded-2xl bg-[#0C0C0F] border border-white/10 p-6 md:p-8 space-y-6 shadow-xl">
        {/* Product Name Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            Product Name (Optional)
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. Wireless Pro Headphones"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#000000] border border-white/10 text-xs text-white placeholder-[#8E8E98]/60 focus:border-[#00F0FF] focus:outline-none"
          />
        </div>

        {/* Customer Review Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            Customer Feedback / Review
          </label>
          <textarea
            rows={4}
            value={sampleReview}
            onChange={(e) => setSampleReview(e.target.value)}
            placeholder="Paste or enter customer review here..."
            className="w-full p-3.5 rounded-xl bg-[#000000] border border-white/10 text-xs text-white placeholder-[#8E8E98]/60 focus:border-[#00F0FF] focus:outline-none"
          />
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Response Language Mode</span>
          </label>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              type="button"
              onClick={() => setLanguage('english')}
              className={`p-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                language === 'english'
                  ? 'border-[#9165F5] bg-[#9165F5]/15 text-white shadow-sm'
                  : 'border-white/5 bg-[#141418] text-[#8E8E98] hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hindi')}
              className={`p-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                language === 'hindi'
                  ? 'border-[#FF4B72] bg-[#FF4B72]/15 text-white shadow-sm'
                  : 'border-white/5 bg-[#141418] text-[#8E8E98] hover:text-white'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
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
                    ? 'border-[#00F0FF] bg-[#00F0FF]/10 text-white shadow-sm'
                    : 'border-white/5 bg-[#141418] text-[#8E8E98] hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="text-xs font-semibold text-[#00F0FF] hover:underline flex items-center gap-1.5"
          >
            <Settings className="h-4 w-4" />
            <span>Manage Model Settings</span>
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !sampleReview.trim()}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs text-black gradient-growth disabled:opacity-40 disabled:pointer-events-none hover:opacity-95 flex items-center gap-2 shadow-lg shadow-[#00F0FF]/20 transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Drafting with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-black" />
                <span>Draft AI Reply</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated AI Response Card */}
      {generatedReply && (
        <div className="rounded-2xl bg-[#0C0C0F] border border-[#00F0FF]/30 p-6 md:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF]">
                <MessageSquareReply className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                Generated Reply ({tone})
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#141418] hover:bg-white/10 text-white border border-white/10 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#10E599]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Response'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#000000] border border-white/10 text-xs leading-relaxed text-white whitespace-pre-line font-normal">
            {generatedReply}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#8E8E98] pt-1">
            <span>Powered by Google Gemini 3.8 Flash</span>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="text-[#00F0FF] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
