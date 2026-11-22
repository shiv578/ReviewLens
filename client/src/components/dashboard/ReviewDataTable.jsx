import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  Copy,
  Check,
  Star,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Loader2,
  RefreshCw,
  X,
  ChevronDown,
  Languages,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ALL_TOPICS = ['quality', 'delivery', 'price', 'packaging', 'support', 'size_fit', 'other'];

export default function ReviewDataTable() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States (Requirement 7)
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Suggested Reply on-click state & language mode
  const [generatingReplyId, setGeneratingReplyId] = useState(null);
  const [expandedReplyId, setExpandedReplyId] = useState(null);
  const [replyLang, setReplyLang] = useState({}); // { [id]: 'english' | 'hindi' }
  const [replyCache, setReplyCache] = useState({}); // { [id]: { english: '...', hindi: '...' } }
  const [copiedId, setCopiedId] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (selectedProduct !== 'all') params.product = selectedProduct;
      if (selectedSentiment !== 'all') params.sentiment = selectedSentiment;
      if (selectedTopic !== 'all') params.topic = selectedTopic;
      params.limit = 50;

      const res = await api.get('/reviews', { params });
      setReviews(res.data?.data || []);
      if (res.data?.products?.length) setProducts(res.data.products);
      if (res.data?.topics?.length) setTopics(res.data.topics);
    } catch (err) {
      console.warn('Failed to load reviews table:', err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedProduct, selectedSentiment, selectedTopic]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Generate or toggle reply with multi-language mode (English / Hindi)
  const handleToggleOrGenerateReply = async (review, targetLang) => {
    const rId = review._id || review.reviewId;
    const currentLang = targetLang || replyLang[rId] || 'english';

    // If clicking main button and already open with same language, toggle closed
    if (expandedReplyId === rId && !targetLang) {
      setExpandedReplyId(null);
      return;
    }

    setExpandedReplyId(rId);

    // Check if we already have the reply cached in memory or review document
    const cachedText =
      replyCache[rId]?.[currentLang] ||
      (currentLang === 'english' ? review.suggestedReply : review.suggestedReplyHindi);

    if (cachedText) {
      setReplyCache((prev) => ({
        ...prev,
        [rId]: {
          ...prev[rId],
          [currentLang]: cachedText,
        },
      }));
      setReplyLang((prev) => ({ ...prev, [rId]: currentLang }));
      return;
    }

    // Fetch from Gemini via API with selected language mode
    setGeneratingReplyId(rId);
    setReplyLang((prev) => ({ ...prev, [rId]: currentLang }));

    try {
      const res = await api.post(`/reviews/${rId}/reply`, {
        reviewText: review.reviewText,
        productName: review.productName,
        tone: 'empathic',
        language: currentLang,
      });

      const replyText =
        res.data?.reply ||
        (currentLang === 'hindi'
          ? 'आपकी प्रतिक्रिया के लिए धन्यवाद। हम त्वरित सहायता के लिए प्रतिबद्ध हैं।'
          : 'Thank you for your feedback. We are committed to making this right.');

      setReplyCache((prev) => ({
        ...prev,
        [rId]: {
          ...prev[rId],
          [currentLang]: replyText,
        },
      }));

      // Update in-memory review record
      setReviews((prev) =>
        prev.map((r) =>
          r._id === review._id || r.reviewId === review.reviewId
            ? {
                ...r,
                ...(currentLang === 'hindi'
                  ? { suggestedReplyHindi: replyText }
                  : { suggestedReply: replyText }),
                replyStatus: 'drafted',
              }
            : r
        )
      );

      toast.success(`Drafted ${currentLang === 'hindi' ? 'Hindi' : 'English'} reply with Gemini!`);
    } catch (err) {
      console.error('Error generating reply on demand:', err);
      toast.error('Failed to generate reply: ' + (err.response?.data?.message || err.message));
    } finally {
      setGeneratingReplyId(null);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied reply to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetFilters = () => {
    setSelectedProduct('all');
    setSelectedSentiment('all');
    setSelectedTopic('all');
    setSearchQuery('');
  };

  return (
    <div className="rounded-2xl bg-[#0C0C0F] border border-white/10 p-6 md:p-7 shadow-xl space-y-5">
      {/* Table Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Customer Reviews Intelligence Table</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#00F0FF]">
              {reviews.length} loaded
            </span>
          </h3>
          <p className="text-xs text-[#8E8E98]">
            Filter by product, sentiment, or topic. Generate customized AI replies on-click for reviews needing response.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          disabled={loading}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8E8E98] hover:text-white transition-colors self-start"
          title="Refresh reviews"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#00F0FF]' : ''}`} />
        </button>
      </div>

      {/* Filter Toolbar (Requirement 7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8E8E98]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search review or summary..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#000000] border border-white/10 text-xs text-white placeholder-[#8E8E98]/50 focus:border-[#00F0FF] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E8E98] hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Filter 1: By Product (Requirement 7) */}
        <div>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#000000] border border-white/10 text-xs text-white focus:border-[#00F0FF] focus:outline-none"
          >
            <option value="all">All Products</option>
            {products.map((p, idx) => (
              <option key={idx} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Filter 2: By Sentiment (Requirement 7) */}
        <div>
          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#000000] border border-white/10 text-xs text-white focus:border-[#00F0FF] focus:outline-none"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
            <option value="analysis_failed">Analysis Failed</option>
          </select>
        </div>

        {/* Filter 3: By Topic (Requirement 7) */}
        <div>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#000000] border border-white/10 text-xs text-white focus:border-[#00F0FF] focus:outline-none"
          >
            <option value="all">All Topics</option>
            {ALL_TOPICS.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filters pill list */}
      {(selectedProduct !== 'all' || selectedSentiment !== 'all' || selectedTopic !== 'all' || searchQuery) && (
        <div className="flex items-center gap-2 pt-1 text-[11px] text-[#8E8E98]">
          <span>Active filters:</span>
          {selectedProduct !== 'all' && (
            <span className="px-2 py-0.5 rounded-md bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/25">
              Product: {selectedProduct}
            </span>
          )}
          {selectedSentiment !== 'all' && (
            <span className="px-2 py-0.5 rounded-md bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/25">
              Sentiment: {selectedSentiment}
            </span>
          )}
          {selectedTopic !== 'all' && (
            <span className="px-2 py-0.5 rounded-md bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/25">
              Topic: {selectedTopic}
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-[11px] text-[#FF4B72] hover:underline ml-1"
          >
            Reset all
          </button>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#141418] text-[#8E8E98] uppercase text-[10px] tracking-wider border-b border-white/10">
              <th className="p-3.5 font-semibold">ID & Product</th>
              <th className="p-3.5 font-semibold">Rating</th>
              <th className="p-3.5 font-semibold min-w-[220px]">Review Text</th>
              <th className="p-3.5 font-semibold">Sentiment</th>
              <th className="p-3.5 font-semibold">Topics</th>
              <th className="p-3.5 font-semibold min-w-[180px]">English Summary</th>
              <th className="p-3.5 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#8E8E98]">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-[#00F0FF]" />
                  <span>Loading review intelligence data...</span>
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#8E8E98]">
                  No reviews match the selected filter criteria. Upload reviews.csv to view data.
                </td>
              </tr>
            ) : (
              reviews.map((r, idx) => {
                const sentiment = r.sentiment || 'neutral';
                const sentimentColors = {
                  positive: 'bg-[#10E599]/15 text-[#10E599] border-[#10E599]/30',
                  neutral: 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30',
                  negative: 'bg-[#FF4B72]/15 text-[#FF4B72] border-[#FF4B72]/30',
                  unknown: 'bg-stone-500/15 text-stone-400 border-stone-500/30',
                  analysis_failed: 'bg-[#8E8E98]/15 text-[#8E8E98] border-[#8E8E98]/30',
                };

                const rId = r._id || r.reviewId;
                const isNeedsReply = Boolean(r.needs_reply);
                const currentLang = replyLang[rId] || 'english';
                const currentReplyText =
                  replyCache[rId]?.[currentLang] ||
                  (currentLang === 'english' ? r.suggestedReply : r.suggestedReplyHindi) ||
                  (currentLang === 'hindi' && r.suggestedReplyHindi ? r.suggestedReplyHindi : null) ||
                  replyCache[rId]?.english ||
                  r.suggestedReply;

                const hasExistingReply = Boolean(r.suggestedReply || r.suggestedReplyHindi || replyCache[rId]);
                const isGeneratingThis = generatingReplyId === rId;
                const isReplyExpanded = expandedReplyId === rId || (hasExistingReply && expandedReplyId === null && false);

                return (
                  <React.Fragment key={r._id || idx}>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      {/* ID & Product */}
                      <td className="p-3.5">
                        <span className="font-mono text-[10px] text-[#00F0FF] block font-bold">
                          {r.reviewId || `R${String(idx + 1).padStart(3, '0')}`}
                        </span>
                        <span className="font-semibold text-white truncate max-w-[140px] block" title={r.productName}>
                          {r.productName || 'General Product'}
                        </span>
                      </td>

                      {/* Rating (handles unknown rating as Requirement 1 specifies) */}
                      <td className="p-3.5 whitespace-nowrap">
                        {r.rating !== null && r.rating !== undefined ? (
                          <div className="flex items-center gap-1 text-[#FBBF24]">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span className="font-bold text-white text-xs">{r.rating}</span>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-[#8E8E98] border border-white/10 font-mono">
                            unknown
                          </span>
                        )}
                      </td>

                      {/* Review Text */}
                      <td className="p-3.5 text-[#E4E4E7] leading-relaxed max-w-xs">
                        <div className="line-clamp-2" title={r.reviewText}>
                          {r.reviewText}
                        </div>
                        {r.isDuplicate && (
                          <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] bg-white/10 text-[#8E8E98]">
                            duplicate
                          </span>
                        )}
                      </td>

                      {/* Sentiment */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            sentimentColors[sentiment] || sentimentColors.neutral
                          }`}
                        >
                          {sentiment}
                        </span>
                      </td>

                      {/* Topics */}
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[130px]">
                          {(r.topics || []).map((t, tidx) => (
                            <span
                              key={tidx}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-[#141418] text-[#8E8E98] border border-white/5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* English Summary */}
                      <td className="p-3.5 text-xs text-[#E4E4E7] leading-relaxed max-w-xs">
                        {r.summary || <span className="text-[#8E8E98] italic">No summary generated</span>}
                      </td>

                      {/* Action (On-click suggested reply - Requirement 7) */}
                      <td className="p-3.5 whitespace-nowrap">
                        {isNeedsReply ? (
                          <button
                            onClick={() => handleToggleOrGenerateReply(r)}
                            disabled={isGeneratingThis}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                              expandedReplyId === rId
                                ? 'bg-[#9165F5] text-white shadow-md'
                                : hasExistingReply
                                ? 'bg-[#9165F5]/15 text-[#9165F5] border border-[#9165F5]/30 hover:bg-[#9165F5]/25'
                                : 'bg-[#FF4B72]/15 text-[#FF4B72] border border-[#FF4B72]/30 hover:bg-[#FF4B72]/25'
                            }`}
                          >
                            {isGeneratingThis ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Drafting...</span>
                              </>
                            ) : expandedReplyId === rId ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>Hide Reply</span>
                              </>
                            ) : hasExistingReply ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>View Reply</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3 w-3" />
                                <span>Generate Reply</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#8E8E98]/60 flex items-center gap-1">
                            <span>No reply needed</span>
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Inline Suggested Reply Card with Bilingual Mode (English / Hindi) */}
                    {expandedReplyId === rId && (
                      <tr className="bg-[#101015]/80">
                        <td colSpan={7} className="p-4 border-b border-white/10">
                          <div className="rounded-xl bg-[#08080C] border border-[#9165F5]/40 p-4 space-y-3 shadow-lg">
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/5">
                              <span className="text-xs font-bold text-[#9165F5] uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5 text-[#9165F5]" />
                                Suggested Empathetic Reply for {r.reviewId || 'Review'}
                              </span>

                              <div className="flex items-center gap-2">
                                {/* Language Mode Selector: English / Hindi */}
                                <div className="flex items-center bg-[#141418] p-0.5 rounded-lg border border-white/10">
                                  <span className="px-2 text-[#8E8E98] flex items-center gap-1 text-[11px] font-medium">
                                    <Languages className="w-3.5 h-3.5 text-[#00F0FF]" />
                                    <span className="hidden sm:inline">Mode:</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleOrGenerateReply(r, 'english')}
                                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                                      currentLang === 'english'
                                        ? 'bg-[#9165F5] text-white shadow-sm'
                                        : 'text-[#8E8E98] hover:text-white'
                                    }`}
                                  >
                                    English
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleOrGenerateReply(r, 'hindi')}
                                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                                      currentLang === 'hindi'
                                        ? 'bg-[#FF4B72] text-white shadow-sm'
                                        : 'text-[#8E8E98] hover:text-white'
                                    }`}
                                  >
                                    हिन्दी (Hindi)
                                  </button>
                                </div>

                                {/* Copy Button */}
                                <button
                                  type="button"
                                  onClick={() => handleCopy(rId, currentReplyText)}
                                  disabled={!currentReplyText || isGeneratingThis}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/10 hover:bg-white/15 text-white transition-colors disabled:opacity-50"
                                >
                                  {copiedId === rId ? (
                                    <>
                                      <Check className="h-3 w-3 text-[#10E599]" />
                                      <span>Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" />
                                      <span>Copy Reply</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Reply Text Body */}
                            {isGeneratingThis ? (
                              <div className="py-4 flex items-center gap-2 text-xs text-[#8E8E98]">
                                <Loader2 className="w-4 h-4 animate-spin text-[#9165F5]" />
                                <span>
                                  Drafting empathetic reply in {currentLang === 'hindi' ? 'Hindi (हिन्दी)' : 'English'} with Gemini AI...
                                </span>
                              </div>
                            ) : (
                              <p className="text-xs text-white leading-relaxed whitespace-pre-line font-normal bg-[#0C0C10] p-3 rounded-lg border border-white/5">
                                {currentReplyText ||
                                  `No reply drafted in ${currentLang === 'hindi' ? 'Hindi' : 'English'} yet. Click the language button above to generate.`}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
