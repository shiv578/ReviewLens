import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, BarChart2, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export default function HeroSection({ lastAnalysis }) {
  const navigate = useNavigate();

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 md:p-8 min-h-[140px] flex items-center shadow-sm transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: `1px solid var(--border)`,
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        {/* Left */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: 'var(--accent-soft)',
                color: 'var(--accent)',
                border: `1px solid var(--border)`,
              }}
            >
              <Sparkles className="h-3 w-3" />
              Intelligence Workspace
            </span>
            <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <Clock className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
              Last analyzed:{' '}
              <strong className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {lastAnalysis ? formatRelativeTime(lastAnalysis) : 'Awaiting initial dataset'}
              </strong>
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Customer Feedback &amp; Sentiment Intelligence
          </h2>

          <p className="text-xs md:text-sm max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Monitor real-time sentiment distribution, extract recurring complaints, and draft empathetic customer responses.
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <button
            onClick={() => navigate('/sentiment')}
            className="px-4 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
            style={{
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: `1px solid var(--border)`,
            }}
          >
            <BarChart2 className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
            <span>Sentiment Studio</span>
          </button>

          <button
            onClick={() => navigate('/upload')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 gradient-growth shadow-md"
            style={{ color: 'var(--btn-text)' }}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Dataset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
