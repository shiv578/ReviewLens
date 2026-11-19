import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Upload, FileText, CheckCircle2 } from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Analysis History | ReviewLens';
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Analysis History</h2>
          <p className="text-xs md:text-sm text-[#9BAAC0]">
            Audit previous CSV uploads, batch completion statuses, and past sentiment breakdowns.
          </p>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#080D19] gradient-growth self-start shadow-md"
        >
          <Upload className="h-4 w-4" />
          <span>Upload New Batch</span>
        </button>
      </div>

      {/* Empty State */}
      <div className="rounded-3xl bg-[#101A2B] border border-white/5 p-12 text-center max-w-lg mx-auto">
        <div className="h-14 w-14 rounded-2xl bg-[#9165F5]/10 text-[#9165F5] flex items-center justify-center mx-auto mb-4 border border-[#9165F5]/20">
          <History className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Past Analysis Runs</h3>
        <p className="text-xs text-[#9BAAC0] leading-relaxed mb-6">
          Every time you upload a review CSV file and trigger AI intelligence extraction, the job record, review count, and timestamps will be preserved here.
        </p>
        <button
          onClick={() => navigate('/upload')}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#080D19] gradient-growth inline-flex items-center gap-2 shadow-lg shadow-[#10D6A0]/20"
        >
          <Upload className="h-4 w-4" />
          <span>Start First Upload</span>
        </button>
      </div>
    </div>
  );
}
