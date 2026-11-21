import React from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  ThumbsUp,
  Minus,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { formatNumber, formatPercent } from '../../utils/formatters';

export default function StatsGrid({ stats, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className="h-36 rounded-2xl p-5 md:p-6 animate-pulse flex flex-col justify-between"
            style={{ backgroundColor: 'var(--bg-card)', border: `1px solid var(--border)` }}
          >
            <div className="h-4 w-20 rounded" style={{ backgroundColor: 'var(--bg-surface)' }} />
            <div className="h-8 w-16 rounded" style={{ backgroundColor: 'var(--bg-surface)' }} />
            <div className="h-2 w-full rounded" style={{ backgroundColor: 'var(--bg-surface)' }} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-4 rounded-xl text-xs flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(229,62,62,0.08)',
          border: `1px solid rgba(229,62,62,0.3)`,
          color: 'var(--sentiment-neg)',
        }}
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Error loading statistics: {error}</span>
        </div>
      </div>
    );
  }

  const total = stats?.totalReviews || 0;
  const positive = stats?.positive || 0;
  const neutral = stats?.neutral || 0;
  const negative = stats?.negative || 0;
  const needsReply = stats?.needsReply || 0;

  const cards = [
    {
      title: 'Total Reviews',
      value: total,
      pct: 100,
      sublabel: total > 0 ? 'All ingested' : 'No reviews',
      icon: MessageSquare,
      color: 'var(--accent)',
      badgeBg: 'var(--accent-soft)',
      barColor: 'var(--accent)',
    },
    {
      title: 'Positive',
      value: positive,
      pct: total > 0 ? (positive / total) * 100 : 0,
      sublabel: `${formatPercent(positive, total)} ratio`,
      icon: ThumbsUp,
      color: 'var(--sentiment-pos)',
      badgeBg: 'rgba(56,161,105,0.1)',
      barColor: 'var(--sentiment-pos)',
    },
    {
      title: 'Neutral',
      value: neutral,
      pct: total > 0 ? (neutral / total) * 100 : 0,
      sublabel: `${formatPercent(neutral, total)} ratio`,
      icon: Minus,
      color: 'var(--sentiment-neu)',
      badgeBg: 'rgba(214,158,46,0.1)',
      barColor: 'var(--sentiment-neu)',
    },
    {
      title: 'Negative',
      value: negative,
      pct: total > 0 ? (negative / total) * 100 : 0,
      sublabel: `${formatPercent(negative, total)} ratio`,
      icon: AlertCircle,
      color: 'var(--sentiment-neg)',
      badgeBg: 'rgba(229,62,62,0.1)',
      barColor: 'var(--sentiment-neg)',
    },
    {
      title: 'Needs Reply',
      value: needsReply,
      pct: negative > 0 ? (needsReply / negative) * 100 : 0,
      sublabel: needsReply > 0 ? 'Pending answer' : 'All clear',
      icon: HelpCircle,
      color: '#A855F7',
      badgeBg: 'rgba(168,85,247,0.1)',
      barColor: '#A855F7',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="rounded-2xl p-5 md:p-6 min-h-[140px] flex flex-col justify-between transition-all shadow-sm hover:shadow-md"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: `1px solid var(--border)`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide truncate" style={{ color: 'var(--text-secondary)' }}>
                {card.title}
              </span>
              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: card.badgeBg, color: card.color }}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="my-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {formatNumber(card.value)}
              </span>
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {card.sublabel}
              </span>
            </div>

            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(0, card.pct))}%`,
                  backgroundColor: card.barColor,
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
