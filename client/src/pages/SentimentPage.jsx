import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Upload, BarChart2, TrendingUp, AlertCircle } from 'lucide-react';
import SentimentPulse from '../components/dashboard/SentimentPulse';
import { useStats } from '../hooks/useStats';

export default function SentimentPage() {
  const navigate = useNavigate();
  const { stats, loading } = useStats();

  useEffect(() => {
    document.title = 'Sentiment Intelligence | ReviewLens';
  }, []);

  const total = stats?.totalReviews || 0;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sentiment Intelligence</h2>
          <p className="text-xs md:text-sm text-[#9BAAC0]">
            Granular breakdown of customer satisfaction across positive, neutral, and critical sentiment bands.
          </p>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#080D19] gradient-growth self-start shadow-md"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Dataset</span>
        </button>
      </div>

      {/* Main Sentiment Pulse Component */}
      <SentimentPulse stats={stats} loading={loading} />

      {/* Empty State when no reviews ingested */}
      {total === 0 && (
        <div className="rounded-3xl bg-[#101A2B] border border-white/5 p-12 text-center max-w-xl mx-auto">
          <div className="h-14 w-14 rounded-2xl bg-[#10D6A0]/10 text-[#10D6A0] flex items-center justify-center mx-auto mb-4 border border-[#10D6A0]/20">
            <Brain className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Awaiting Review Dataset</h3>
          <p className="text-xs text-[#9BAAC0] leading-relaxed mb-6">
            Upload your first CSV file with customer reviews to unlock sentiment clustering, satisfaction ratios, and real-time trend analytics.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#080D19] gradient-growth inline-flex items-center gap-2 shadow-lg shadow-[#10D6A0]/20"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Reviews Now</span>
          </button>
        </div>
      )}
    </div>
  );
}
