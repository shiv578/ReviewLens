import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw, Star, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import api from '../../services/api';

export default function RatingMismatchPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMismatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/mismatches');
      if (res.data?.status === 'ok') {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load rating mismatches:', err);
      setError(err.message || 'Failed to fetch rating mismatches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMismatches();
  }, []);

  const agreementRate = data?.agreementRate ?? 100;
  const mismatches = data?.mismatches || [];
  const totalRated = data?.totalRated || 0;
  const totalMismatches = data?.totalMismatches || 0;
  const highNeg = data?.breakdown?.highRatingNegative || 0;
  const lowPos = data?.breakdown?.lowRatingPositive || 0;

  return (
    <div
      className="rounded-3xl p-6 transition-all duration-300"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--accent)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Rating vs. Sentiment Mismatch Check
              </h3>
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                style={{
                  backgroundColor: agreementRate >= 90 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  color: agreementRate >= 90 ? '#10b981' : 'var(--accent)',
                }}
              >
                {agreementRate}% Agreement
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Detects contradictions where star ratings disagree with AI text sentiment (e.g. 5 stars with negative complaint text).
            </p>
          </div>
        </div>

        <button
          onClick={fetchMismatches}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto transition-colors"
          style={{
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
          }}
          title="Refresh mismatch scan"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Scan</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div
          className="p-3.5 rounded-2xl"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-[11px] font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
            Agreement Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: agreementRate >= 90 ? '#10b981' : 'var(--accent)' }}
            >
              {agreementRate}%
            </span>
          </div>
          <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${agreementRate}%`,
                backgroundColor: agreementRate >= 90 ? '#10b981' : 'var(--accent)',
              }}
            />
          </div>
        </div>

        <div
          className="p-3.5 rounded-2xl"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-[11px] font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
            Rated Reviews
          </span>
          <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {totalRated}
          </span>
          <span className="text-[10px] block mt-1" style={{ color: 'var(--text-secondary)' }}>
            Reviews with 1-5 stars
          </span>
        </div>

        <div
          className="p-3.5 rounded-2xl"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-[11px] font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
            Flagged Mismatches
          </span>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: totalMismatches > 0 ? 'var(--accent)' : '#10b981' }}
          >
            {totalMismatches}
          </span>
          <span className="text-[10px] block mt-1" style={{ color: 'var(--text-secondary)' }}>
            {totalMismatches === 0 ? 'No conflicts' : 'Require review'}
          </span>
        </div>

        <div
          className="p-3.5 rounded-2xl"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-[11px] font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
            High Rating / Negative
          </span>
          <span className="text-xl font-bold tracking-tight text-amber-500">
            {highNeg}
          </span>
          <span className="text-[10px] block mt-1" style={{ color: 'var(--text-secondary)' }}>
            4-5★ with critical text
          </span>
        </div>
      </div>

      {/* Flagged List / Table */}
      {loading ? (
        <div className="py-8 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 opacity-50" />
          Analyzing star ratings against AI sentiment models...
        </div>
      ) : mismatches.length === 0 ? (
        <div
          className="p-6 rounded-2xl text-center border"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderColor: 'rgba(16, 185, 129, 0.2)',
          }}
        >
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-emerald-500 mb-1">100% Harmonic Agreement</h4>
          <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            All reviewed star ratings correspond accurately to the sentiment expressed in review texts. No conflicting ratings detected.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                <th className="pb-2.5 font-semibold">ID</th>
                <th className="pb-2.5 font-semibold">Product</th>
                <th className="pb-2.5 font-semibold">Rating</th>
                <th className="pb-2.5 font-semibold">AI Sentiment</th>
                <th className="pb-2.5 font-semibold">Discrepancy</th>
                <th className="pb-2.5 font-semibold">Review Text Snippet</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {mismatches.map((m) => (
                <tr key={m._id || m.reviewId} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 font-mono font-bold" style={{ color: 'var(--accent)' }}>
                    {m.reviewId || 'N/A'}
                  </td>
                  <td className="py-3 font-medium max-w-[140px] truncate" style={{ color: 'var(--text-primary)' }}>
                    {m.productName || 'General'}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {m.rating}★
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className="px-2 py-0.5 rounded-full font-bold uppercase text-[10px]"
                      style={{
                        backgroundColor:
                          m.sentiment === 'positive'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : m.sentiment === 'negative'
                            ? 'rgba(239, 68, 68, 0.15)'
                            : 'rgba(245, 158, 11, 0.15)',
                        color:
                          m.sentiment === 'positive'
                            ? '#10b981'
                            : m.sentiment === 'negative'
                            ? 'var(--accent)'
                            : '#f59e0b',
                      }}
                    >
                      {m.sentiment}
                    </span>
                  </td>
                  <td className="py-3 font-medium" style={{ color: 'var(--accent)' }}>
                    {m.explanation || 'Rating disagrees with sentiment'}
                  </td>
                  <td className="py-3 max-w-[260px] truncate" style={{ color: 'var(--text-secondary)' }} title={m.reviewText}>
                    "{m.reviewText}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
