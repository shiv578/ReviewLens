import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Upload, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AIInsightsPanel({ hasData }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl bg-[#101A2B] border border-[#9165F5]/25 p-6 mb-8 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#9165F5]/10 flex items-center justify-center text-[#9165F5] border border-[#9165F5]/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              AI Business Insights
            </h3>
            <p className="text-xs text-[#9BAAC0]">
              Automated feedback synthesis powered by Google Gemini
            </p>
          </div>
        </div>

        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#9165F5]/10 text-[#9165F5] border border-[#9165F5]/20">
          Executive Summary
        </span>
      </div>

      {!hasData ? (
        <div className="py-10 text-center flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="h-12 w-12 rounded-2xl bg-[#9165F5]/10 border border-[#9165F5]/20 flex items-center justify-center text-[#9165F5] mb-4">
            <Brain className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-white mb-2">No Insights Generated Yet</h4>
          <p className="text-xs text-[#9BAAC0] leading-relaxed mb-6">
            Upload customer reviews in CSV format. The ReviewLens AI engine will analyze feedback patterns,
            extract recurring customer complaints, and formulate prioritized action recommendations.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#9165F5]/20 hover:bg-[#9165F5]/30 border border-[#9165F5]/40 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Reviews for Analysis</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-[#080D19]/60 border border-white/5">
            <div className="flex items-center gap-2 text-[#10D6A0] text-xs font-semibold mb-2">
              <TrendingUp className="h-4 w-4" />
              <span>Top Praise Theme</span>
            </div>
            <p className="text-xs text-white font-medium">Customer satisfaction high on delivery speed.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#080D19]/60 border border-white/5">
            <div className="flex items-center gap-2 text-[#F04470] text-xs font-semibold mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Critical Friction</span>
            </div>
            <p className="text-xs text-white font-medium">Sizing inconsistency reported on recent apparel batches.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#080D19]/60 border border-white/5">
            <div className="flex items-center gap-2 text-[#20C5F5] text-xs font-semibold mb-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Recommended Action</span>
            </div>
            <p className="text-xs text-white font-medium">Update size guide & offer swift exchange reply template.</p>
          </div>
        </div>
      )}
    </div>
  );
}
