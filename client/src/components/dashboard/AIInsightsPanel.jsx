import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Upload, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AIInsightsPanel({ hasData }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-[#0C0C0F] border border-white/10 p-6 md:p-7 min-h-[220px] shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] border border-[#00F0FF]/25">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              AI Review Insights
            </h3>
            <p className="text-xs text-[#8E8E98]">
              Automated feedback synthesis powered by Gemini
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white">
          Executive Summary
        </span>
      </div>

      {!hasData ? (
        <div className="py-8 text-center flex flex-col items-center justify-center max-w-md mx-auto my-auto">
          <div className="h-12 w-12 rounded-2xl bg-white/5 text-[#8E8E98] flex items-center justify-center mb-3 border border-white/10">
            <Brain className="h-6 w-6 text-[#00F0FF]" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1.5">No Insights Generated Yet</h4>
          <p className="text-xs text-[#8E8E98] leading-relaxed mb-5">
            Upload customer reviews in CSV format. ReviewLens AI will automatically cluster complaints,
            extract sentiment drivers, and generate recommendations.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-colors"
          >
            <Upload className="h-4 w-4 text-[#00F0FF]" />
            <span>Upload Reviews for Analysis</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-[#141418] border border-white/5">
            <div className="flex items-center gap-2 text-[#10E599] text-xs font-semibold mb-1.5">
              <TrendingUp className="h-4 w-4" />
              <span>Top Praise Theme</span>
            </div>
            <p className="text-xs text-white leading-relaxed">Customer satisfaction high on delivery speed.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#141418] border border-white/5">
            <div className="flex items-center gap-2 text-[#FF4B72] text-xs font-semibold mb-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span>Critical Friction</span>
            </div>
            <p className="text-xs text-white leading-relaxed">Sizing inconsistency reported on recent apparel batches.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#141418] border border-white/5">
            <div className="flex items-center gap-2 text-[#00F0FF] text-xs font-semibold mb-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>Action Recommendation</span>
            </div>
            <p className="text-xs text-white leading-relaxed">Update size guide & offer swift exchange reply template.</p>
          </div>
        </div>
      )}
    </div>
  );
}
