import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Upload, AlertTriangle, ThumbsUp, Package } from 'lucide-react';

export default function AIInsightsPanel({ hasData, stats }) {
  const navigate = useNavigate();

  const topComplaints = stats?.topComplaints || [];
  const topPraises = stats?.topPraises || [];

  return (
    <div
      className="rounded-2xl p-6 md:p-7 shadow-sm space-y-6 transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-card)', border: `1px solid var(--border)` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4" style={{ borderBottom: `1px solid var(--border)` }}>
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)', border: `1px solid var(--border)` }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Top Customer Insights Across All Products
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Automated synthesis of top 3 recurring complaints and top 3 praises
            </p>
          </div>
        </div>

        <span
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: 'var(--accent-soft)',
            border: `1px solid var(--border)`,
            color: 'var(--accent)',
          }}
        >
          Executive Summary
        </span>
      </div>

      {!hasData ? (
        <div className="py-8 text-center flex flex-col items-center justify-center max-w-md mx-auto">
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ backgroundColor: 'var(--bg-surface)', border: `1px solid var(--border)` }}
          >
            <Brain className="h-6 w-6" style={{ color: 'var(--accent)' }} />
          </div>
          <h4 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>No Insights Generated Yet</h4>
          <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
            Upload <code>reviews.csv</code> to automatically extract the top 3 complaints and top 3 praises across your products.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-md gradient-growth"
            style={{ color: 'var(--btn-text)' }}
          >
            <Upload className="h-4 w-4" />
            <span>Upload reviews.csv for Analysis</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Complaints */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--sentiment-neg)' }}>
              <AlertTriangle className="h-4 w-4" />
              <span>Top 3 Customer Complaints</span>
            </div>
            <div className="space-y-2.5">
              {topComplaints.length > 0 ? (
                topComplaints.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: `1px solid rgba(229,62,62,0.2)`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(229,62,62,0.4)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(229,62,62,0.2)'; }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                        <Package className="h-3.5 w-3.5" style={{ color: 'var(--text-secondary)' }} />
                        <span className="truncate max-w-[180px]">{item.productName || 'General Product'}</span>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider"
                        style={{
                          backgroundColor: 'rgba(229,62,62,0.12)',
                          color: 'var(--sentiment-neg)',
                          border: '1px solid rgba(229,62,62,0.3)',
                        }}
                      >
                        {item.topic}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      "{item.summary}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl text-xs text-center" style={{ backgroundColor: 'var(--bg-surface)', border: `1px solid var(--border)`, color: 'var(--text-secondary)' }}>
                  No severe complaints recorded in the current dataset.
                </div>
              )}
            </div>
          </div>

          {/* Praises */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--sentiment-pos)' }}>
              <ThumbsUp className="h-4 w-4" />
              <span>Top 3 Customer Praises</span>
            </div>
            <div className="space-y-2.5">
              {topPraises.length > 0 ? (
                topPraises.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: `1px solid rgba(56,161,105,0.2)`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(56,161,105,0.4)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(56,161,105,0.2)'; }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                        <Package className="h-3.5 w-3.5" style={{ color: 'var(--text-secondary)' }} />
                        <span className="truncate max-w-[180px]">{item.productName || 'General Product'}</span>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider"
                        style={{
                          backgroundColor: 'rgba(56,161,105,0.12)',
                          color: 'var(--sentiment-pos)',
                          border: '1px solid rgba(56,161,105,0.3)',
                        }}
                      >
                        {item.topic}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      "{item.summary}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl text-xs text-center" style={{ backgroundColor: 'var(--bg-surface)', border: `1px solid var(--border)`, color: 'var(--text-secondary)' }}>
                  No praise data recorded in the current dataset.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
