import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, ArrowRight, MessageSquare, Upload } from 'lucide-react';
import { formatRelativeTime, getSentimentColor, getSentimentLabel, truncateText } from '../../utils/formatters';

export default function RecentReviews({ reviews, loading, error }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl bg-[#101A2B] border border-[#20C5F5]/15 p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#20C5F5]/10 flex items-center justify-center text-[#20C5F5] border border-[#20C5F5]/20">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Recent Customer Reviews
            </h3>
            <p className="text-xs text-[#9BAAC0]">Live incoming feedback feed</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/reviews')}
          className="text-xs font-semibold text-[#10D6A0] hover:text-[#20C5F5] inline-flex items-center gap-1 transition-colors"
        >
          <span>Explore All Reviews</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="py-6 space-y-3">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="h-16 rounded-xl bg-[#080D19]/60 border border-white/5 p-3 animate-pulse flex items-center justify-between"
            >
              <div className="h-4 w-1/2 bg-white/10 rounded" />
              <div className="h-4 w-20 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-12 text-center flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#9BAAC0] mb-3">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">No Reviews Found</h4>
          <p className="text-xs text-[#9BAAC0] max-w-sm mb-4">
            Upload your first CSV dataset to explore customer feedback, sentiment trends, and AI-suggested replies.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#080D19] gradient-growth hover:opacity-95 transition-opacity"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Reviews Dataset</span>
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
                className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors rounded-xl px-2"
              >
                <div className="space-y-1 max-w-2xl">
                  <p className="text-xs font-medium text-white leading-relaxed">
                    "{truncateText(review.reviewText, 120)}"
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#9BAAC0]">
                    <span className="font-semibold text-[#20C5F5]">
                      {review.productName}
                    </span>
                    {review.rating && (
                      <span className="inline-flex items-center gap-1 text-[#F5B942]">
                        <Star className="h-3 w-3 fill-current" />
                        {review.rating}/5
                      </span>
                    )}
                    <span>•</span>
                    <span>{formatRelativeTime(review.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
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
