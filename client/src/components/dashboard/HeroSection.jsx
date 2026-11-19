import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Upload, BarChart2, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export default function HeroSection({ lastAnalysis }) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101A2B] via-[#0D1524] to-[#101A2B] border border-[#20C5F5]/15 p-6 md:p-8 lg:p-10 mb-8 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 -mt-12 w-96 h-96 bg-[#10D6A0]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 -mb-12 w-80 h-80 bg-[#20C5F5]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Vision & Actions */}
        <div className="lg:col-span-7 space-y-5 text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10D6A0]/10 border border-[#10D6A0]/20 text-[#10D6A0] text-xs font-semibold tracking-wide"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Customer Review Intelligence</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight"
          >
            Turn Customer Feedback into{' '}
            <span className="gradient-growth-text">Business Growth</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-[#9BAAC0] max-w-xl leading-relaxed"
          >
            AI-powered insights to understand your customers better. Detect sentiment, uncover hidden
            complaints, and draft personalized review responses with Google Gemini.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <button
              onClick={() => navigate('/upload')}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-xs md:text-sm text-[#080D19] gradient-growth shadow-lg shadow-[#10D6A0]/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Reviews</span>
            </button>

            <button
              onClick={() => navigate('/sentiment')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs md:text-sm text-white bg-[#101A2B] border border-[#20C5F5]/30 hover:border-[#20C5F5] hover:bg-white/5 active:scale-[0.98] transition-all"
            >
              <BarChart2 className="h-4 w-4 text-[#20C5F5]" />
              <span>View Analytics</span>
            </button>
          </motion.div>

          {/* Real Analysis Timestamp */}
          <div className="pt-2 flex items-center gap-2 text-xs text-[#9BAAC0]">
            <Clock className="h-3.5 w-3.5 text-[#10D6A0]" />
            <span>
              Last Analysis:{' '}
              <strong className="text-white font-medium">
                {lastAnalysis ? formatRelativeTime(lastAnalysis) : 'No analysis runs yet'}
              </strong>
            </span>
          </div>
        </div>

        {/* Right Column: Abstract Visual Analytics Canvas */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
            {/* Outer Pulsing Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-[#20C5F5]/20"
            />

            {/* Middle Rotating Ring with Orbiting Nodes */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-4 rounded-full border border-[#10D6A0]/20"
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#10D6A0] shadow-md shadow-[#10D6A0]/60" />
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#20C5F5] shadow-md shadow-[#20C5F5]/60" />
            </motion.div>

            {/* Inner Core Pulse */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative h-32 w-32 rounded-3xl bg-gradient-to-tr from-[#101A2B] to-[#16243C] border border-[#20C5F5]/30 flex flex-col items-center justify-center p-4 text-center shadow-2xl"
            >
              <div className="h-10 w-10 rounded-2xl gradient-growth flex items-center justify-center shadow-md mb-2">
                <Sparkles className="h-5 w-5 text-[#080D19]" />
              </div>
              <span className="text-[11px] font-bold text-white tracking-wider uppercase">
                ReviewLens
              </span>
              <span className="text-[9px] text-[#10D6A0] font-medium">Core Intelligence</span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
