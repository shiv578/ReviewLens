import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3, Upload, ShieldCheck, Cpu } from 'lucide-react';
import HeroSection from '../components/dashboard/HeroSection';
import StatsGrid from '../components/dashboard/StatsGrid';
import SentimentPulse from '../components/dashboard/SentimentPulse';
import AIInsightsPanel from '../components/dashboard/AIInsightsPanel';
import AIAssistant from '../components/assistant/AIAssistant';
import RecentReviews from '../components/dashboard/RecentReviews';
import { useStats } from '../hooks/useStats';
import { useRecentReviews } from '../hooks/useRecentReviews';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { stats, loading: statsLoading, error: statsError } = useStats();
  const { reviews, loading: reviewsLoading, error: reviewsError } = useRecentReviews();

  useEffect(() => {
    document.title = 'ReviewLens | AI Review Insights Workspace';
  }, []);

  const hasReviews = (stats?.totalReviews || 0) > 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Canvas */}
      <HeroSection lastAnalysis={stats?.lastAnalysis} />

      {/* Quick Statistics Grid */}
      <StatsGrid stats={stats} loading={statsLoading} error={statsError} />

      {/* Signature Intelligence Row: Sentiment Pulse + Right Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <SentimentPulse stats={stats} loading={statsLoading} />
          <AIInsightsPanel hasData={hasReviews} />
        </div>

        <div className="lg:col-span-4 sticky top-20">
          <AIAssistant />
        </div>
      </div>

      {/* Recent Reviews Activity Feed */}
      <RecentReviews
        reviews={reviews}
        loading={reviewsLoading}
        error={reviewsError}
      />

      {/* Final Action / Deep Dive Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#101A2B] via-[#0D1524] to-[#101A2B] border border-[#20C5F5]/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-lg font-bold text-white tracking-tight">
            Ready to explore your entire feedback dataset?
          </h4>
          <p className="text-xs text-[#9BAAC0]">
            Search, filter by rating and sentiment, or configure AI-generated auto-replies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/reviews')}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition-all"
          >
            <BarChart3 className="h-4 w-4 text-[#20C5F5]" />
            <span>Open Review Explorer</span>
          </button>
          <button
            onClick={() => navigate('/upload')}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-[#080D19] gradient-growth flex items-center gap-2 shadow-lg shadow-[#10D6A0]/20 hover:opacity-95 transition-all"
          >
            <Upload className="h-4 w-4" />
            <span>Upload New Batch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
