import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Upload, MessageSquare, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { formatRelativeTime, getSentimentColor, getSentimentLabel } from '../utils/formatters';

export default function ReviewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get('q') || '';
  const [search, setSearch] = useState(queryParam);
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Review Explorer | ReviewLens';
  }, []);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.q = search.trim();
      if (sentimentFilter !== 'all') params.sentiment = sentimentFilter;
      if (ratingFilter !== 'all') params.rating = ratingFilter;

      const response = await api.get('/reviews', { params });
      setReviews(response.data?.data || []);
      setError(null);
    } catch (err) {
      console.warn('Failed to query reviews:', err.message);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [search, sentimentFilter, ratingFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search) {
      setSearchParams({ q: search });
    } else {
      setSearchParams({});
    }
    fetchReviews();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Review Explorer</h2>
          <p className="text-xs md:text-sm text-[#9BAAC0]">
            Browse, search, and filter individual customer reviews across products and sentiment categories.
          </p>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#080D19] gradient-growth self-start shadow-md"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Reviews</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#101A2B] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BAAC0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search review text or product name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#080D19] border border-white/10 text-xs text-white placeholder-[#9BAAC0]/60 focus:border-[#10D6A0] focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080D19] border border-white/10 text-xs text-[#9BAAC0] focus:text-white focus:outline-none"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive Only</option>
            <option value="neutral">Neutral Only</option>
            <option value="negative">Negative Only</option>
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080D19] border border-white/10 text-xs text-[#9BAAC0] focus:text-white focus:outline-none"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="p-8 rounded-2xl bg-[#101A2B] border border-white/5 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-3xl bg-[#101A2B] border border-white/5 p-12 text-center max-w-lg mx-auto">
          <div className="h-14 w-14 rounded-2xl bg-white/5 text-[#9BAAC0] flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Reviews Found</h3>
          <p className="text-xs text-[#9BAAC0] leading-relaxed mb-6">
            {search || sentimentFilter !== 'all' || ratingFilter !== 'all'
              ? 'No reviews match your selected filter criteria. Try clearing filters or search keywords.'
              : 'Your workspace has no customer reviews yet. Ingest CSV data to populate the explorer.'}
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#080D19] gradient-growth inline-flex items-center gap-2 shadow-lg shadow-[#10D6A0]/20"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Reviews Dataset</span>
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#101A2B] border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080D19] border-b border-white/5 text-[#9BAAC0] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Review Text</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Sentiment</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {reviews.map((r) => {
                  const color = getSentimentColor(r.sentiment);
                  return (
                    <tr key={r._id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 max-w-md font-medium leading-relaxed">
                        "{r.reviewText}"
                      </td>
                      <td className="py-3 px-4 text-[#20C5F5] font-semibold whitespace-nowrap">
                        {r.productName}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {r.rating ? (
                          <span className="inline-flex items-center gap-1 text-[#F5B942]">
                            <Star className="h-3 w-3 fill-current" /> {r.rating}/5
                          </span>
                        ) : (
                          <span className="text-[#9BAAC0]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          style={{
                            color: color,
                            backgroundColor: `${color}15`,
                            borderColor: `${color}30`,
                          }}
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize"
                        >
                          {getSentimentLabel(r.sentiment)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#9BAAC0] whitespace-nowrap">
                        {formatRelativeTime(r.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
