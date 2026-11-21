import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, BarChart2, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export default function HeroSection({ lastAnalysis }) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0C0C0F] border border-white/10 p-6 md:p-8 min-h-[140px] flex items-center shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        {/* Left: Clean Heading & Metadata */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-semibold border border-[#00F0FF]/25">
              <Sparkles className="h-3 w-3" />
              Cyber Intelligence Workspace
            </span>
            <span className="text-xs text-[#8E8E98] flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#00F0FF]" />
              Last analyzed:{' '}
              <strong className="text-white font-medium">
                {lastAnalysis ? formatRelativeTime(lastAnalysis) : 'Awaiting initial dataset'}
              </strong>
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Customer Feedback & Sentiment Intelligence
          </h2>

          <p className="text-xs md:text-sm text-[#8E8E98] max-w-xl">
            Monitor real-time sentiment distribution, extract recurring complaints, and draft empathetic customer responses.
          </p>
        </div>

        {/* Right: Focused Primary Actions */}
        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <button
            onClick={() => navigate('/sentiment')}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <BarChart2 className="h-3.5 w-3.5 text-[#00F0FF]" />
            <span>Sentiment Studio</span>
          </button>

          <button
            onClick={() => navigate('/upload')}
            className="px-4.5 py-2.5 rounded-xl text-xs font-semibold text-black gradient-growth shadow-md shadow-[#00F0FF]/20 hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Dataset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
