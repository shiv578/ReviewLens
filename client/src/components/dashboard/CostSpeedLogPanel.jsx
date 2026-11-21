import React, { useState, useEffect } from 'react';
import { Gauge, Zap, Database, Clock, RefreshCw, Layers, TrendingUp } from 'lucide-react';
import api from '../../services/api';

export default function CostSpeedLogPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCostLog = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/stats/cost-log');
      if (res.data?.status === 'ok') {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load cost & speed log:', err);
      setError(err.message || 'Failed to fetch cost and speed log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCostLog();
  }, []);

  const summary = data?.summary || {
    totalBatches: 0,
    totalReviewsProcessed: 0,
    totalAiCalls: 0,
    totalCached: 0,
    totalProcessingTimeMs: 0,
    averageSpeedReviewsPerSec: 0,
    estimatedCostSavingsUsd: '0.00',
  };
  const batches = data?.batches || [];

  const cacheRate =
    summary.totalReviewsProcessed > 0
      ? Number(((summary.totalCached / summary.totalReviewsProcessed) * 100).toFixed(1))
      : 0;

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
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                AI Cost & Speed Telemetry
              </h3>
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  color: '#3b82f6',
                }}
              >
                {summary.averageSpeedReviewsPerSec} rev/s avg
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Tracks fresh Gemini LLM invocations, hash-based cache hits, and batch processing throughput.
            </p>
          </div>
        </div>

        <button
          onClick={fetchCostLog}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto transition-colors"
          style={{
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
          }}
          title="Refresh telemetry metrics"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div
          className="p-3.5 rounded-2xl"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-[11px] font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
            Fresh AI Calls Made
          </span>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xl font-bold tracking-tight text-amber-500">
              {summary.totalAiCalls}
            </span>
          </div>
          <span className="text-[10px] block mt-1" style={{ color: 'var(--text-secondary)' }}>
            Direct Gemini LLM calls
          </span>
        </div>

        <div
          className="p-3.5 rounded-2xl"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-[11px] font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
            Served From Cache
          </span>
          <div className="flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-500" />
            <span className="text-xl font-bold tracking-tight text-emerald-500">
              {summary.totalCached}
            </span>
          </div>
          <span className="text-[10px] block mt-1" style={{ color: 'var(--text-secondary)' }}>
            {cacheRate}% Cache hit efficiency
          </span>
        </div>

        <div
          className="p-3.5 rounded-2xl"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-[11px] font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
            Total Processing Time
          </span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-500" />
            <span className="text-xl font-bold tracking-tight text-cyan-500">
              {(summary.totalProcessingTimeMs / 1000).toFixed(1)}s
            </span>
          </div>
          <span className="text-[10px] block mt-1" style={{ color: 'var(--text-secondary)' }}>
            Across all upload batches
          </span>
        </div>

        <div
          className="p-3.5 rounded-2xl"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-[11px] font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
            Estimated Token Savings
          </span>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xl font-bold tracking-tight text-emerald-400">
              ${summary.estimatedCostSavingsUsd}
            </span>
          </div>
          <span className="text-[10px] block mt-1" style={{ color: 'var(--text-secondary)' }}>
            Saved by cache deduplication
          </span>
        </div>
      </div>

      {/* Batch Logs Table */}
      {loading ? (
        <div className="py-8 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 opacity-50" />
          Loading speed logs and batch audit history...
        </div>
      ) : batches.length === 0 ? (
        <div className="py-6 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
          No batch processing logs recorded yet. Upload a dataset to view live speed and cache analytics.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                <th className="pb-2.5 font-semibold">Dataset / File</th>
                <th className="pb-2.5 font-semibold">Total Reviews</th>
                <th className="pb-2.5 font-semibold">AI Calls</th>
                <th className="pb-2.5 font-semibold">Cache Hits</th>
                <th className="pb-2.5 font-semibold">Processing Time</th>
                <th className="pb-2.5 font-semibold">Throughput</th>
                <th className="pb-2.5 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {batches.map((b) => (
                <tr key={b.batchId} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>{b.fileName}</span>
                  </td>
                  <td className="py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {b.totalReviews}
                  </td>
                  <td className="py-3">
                    <span className="text-amber-500 font-bold">{b.aiCallsMade}</span>
                  </td>
                  <td className="py-3">
                    <span className="text-emerald-500 font-bold">{b.cachedCount}</span>
                  </td>
                  <td className="py-3 font-mono" style={{ color: 'var(--text-secondary)' }}>
                    {b.processingTimeMs >= 1000
                      ? `${(b.processingTimeMs / 1000).toFixed(2)}s`
                      : `${b.processingTimeMs}ms`}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400">
                      {b.reviewsPerSecond} rev/s
                    </span>
                  </td>
                  <td className="py-3" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(b.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
