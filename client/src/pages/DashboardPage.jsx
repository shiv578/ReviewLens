import React, { useEffect } from 'react';
import HeroSection from '../components/dashboard/HeroSection';
import StatsGrid from '../components/dashboard/StatsGrid';
import SentimentPulse from '../components/dashboard/SentimentPulse';
import AIInsightsPanel from '../components/dashboard/AIInsightsPanel';
import AIAssistant from '../components/assistant/AIAssistant';
import RecentReviews from '../components/dashboard/RecentReviews';
import { useStats } from '../hooks/useStats';
import { useRecentReviews } from '../hooks/useRecentReviews';

export default function DashboardPage() {
  const { stats, loading: statsLoading, error: statsError } = useStats();
  const { reviews, loading: reviewsLoading, error: reviewsError } = useRecentReviews();

  useEffect(() => {
    document.title = 'Dashboard | ReviewLens AI';
  }, []);

  const hasReviews = (stats?.totalReviews || 0) > 0;

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <HeroSection lastAnalysis={stats?.lastAnalysis} />

      {/* 2. Key Metrics Bar */}
      <StatsGrid stats={stats} loading={statsLoading} error={statsError} />

      {/* 3. Core Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sentiment Pulse & AI Insights */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <SentimentPulse stats={stats} loading={statsLoading} />
          <AIInsightsPanel hasData={hasReviews} />
        </div>

        {/* Right Column: AI Assistant Copilot */}
        <div className="lg:col-span-5 xl:col-span-4">
          <AIAssistant />
        </div>
      </div>

      {/* 4. Live Review Feed */}
      <RecentReviews
        reviews={reviews}
        loading={reviewsLoading}
        error={reviewsError}
      />
    </div>
  );
}
