import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, ArrowRight, MessageSquare, Upload } from 'lucide-react';
import { formatRelativeTime, getSentimentColor, getSentimentLabel, truncateText } from '../../utils/formatters';

export default function RecentReviews({ reviews, loading, error }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-[#0C0C0F] border border-white/10 p-6 md:p-7 min-h-[220px] shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] border border-[#00F0FF]/25">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Recent Customer Reviews
            </h3>
            <p className="text-xs text-[#8E8E98]">Live feedback activity feed</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/reviews')}
          className="text-xs font-semibold text-[#00F0FF] hover:underline inline-flex items-center gap-1.5 transition-colors"
        >
          <span>View Explorer</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="py-6 space-y-3">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="h-14 rounded-xl bg-[#141418] border border-white/5 p-3 animate-pulse flex items-center justify-between"
            >
              <div className="h-3.5 w-1/2 bg-white/10 rounded" />
              <div className="h-3.5 w-16 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-center flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-2xl bg-[#141418] border border-white/10 flex items-center justify-center text-[#8E8E98] mb-3">
            <MessageSquare className="h-5 w-5 text-[#00F0FF]" />
          </div>
          <h4 className="text-xs font-semibold text-white mb-1">No Reviews Ingested Yet</h4>
          <p className="text-[11px] text-[#8E8E98] max-w-sm mb-4">
            Upload your first CSV dataset to explore customer feedback, sentiment trends, and AI-suggested replies.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-black gradient-growth hover:opacity-95 transition-opacity"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Dataset</span>
          </button>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {reviews.map((review) => {
            const sentiment = review.sentiment || 'neutral';
            const color = getSentimentColor(sentiment);

            return (
              <div
                key={review._id || review.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors rounded-xl px-2.5"
              >
                <div className="space-y-1 max-w-2xl">
                  <p className="text-xs font-medium text-white leading-relaxed">
                    "{truncateText(review.reviewText, 110)}"
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8E8E98]">
                    <span className="font-semibold text-[#00F0FF]">
                      {review.productName}
                    </span>
                    {review.rating && (
                      <span className="inline-flex items-center gap-1 text-[#FBBF24]">
                        <Star className="h-3 w-3 fill-current" />
                        {review.rating}/5
                      </span>
                    )}
                    <span>•</span>
                    <span>{formatRelativeTime(review.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span
                    style={{
                      color: color,
                      backgroundColor: `${color}15`,
                      borderColor: `${color}30`,
                    }}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border capitalize"
                  >
                    {getSentimentLabel(sentiment)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
