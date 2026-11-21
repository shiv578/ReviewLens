import React, { useEffect } from 'react';
import StatsGrid from '../components/dashboard/StatsGrid';
import SentimentPulse from '../components/dashboard/SentimentPulse';
import AIInsightsPanel from '../components/dashboard/AIInsightsPanel';
import AIAssistant from '../components/assistant/AIAssistant';
import ReviewDataTable from '../components/dashboard/ReviewDataTable';
import { useStats } from '../hooks/useStats';

export default function OverviewPage() {
  const { stats, loading: statsLoading, error: statsError } = useStats();

  useEffect(() => {
    document.title = 'Overview - ReviewLens AI Insights';
  }, []);

  const hasReviews = (stats?.totalReviews || 0) > 0;

  return (
    <div className="space-y-6 w-full pb-12">
      {/* 1. Summary Metrics Cards */}
      <StatsGrid stats={stats} loading={statsLoading} error={statsError} />

      {/* 2. Top 3 Complaints & Top 3 Praises */}
      <AIInsightsPanel hasData={hasReviews} stats={stats} />

      {/* 3. Sentiment Distribution Donut Chart & Live Gemini Copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sentiment Distribution Pulse */}
        <div className="lg:col-span-7 xl:col-span-8">
          <SentimentPulse stats={stats} loading={statsLoading} />
        </div>

        {/* Right Column: AI Assistant Copilot */}
        <div className="lg:col-span-5 xl:col-span-4">
          <AIAssistant />
        </div>
      </div>

      {/* 4. Full Review Data Table with Filter & One-Click AI Reply */}
      <ReviewDataTable />
    </div>
  );
}
