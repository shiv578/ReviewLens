import React from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  ThumbsUp,
  Minus,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';
import { formatNumber, formatPercent } from '../../utils/formatters';

export default function StatsGrid({ stats, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className="h-28 rounded-2xl bg-[#101A2B]/60 border border-white/5 p-4 animate-pulse flex flex-col justify-between"
          >
            <div className="h-4 w-20 bg-white/10 rounded" />
            <div className="h-7 w-16 bg-white/10 rounded" />
            <div className="h-3 w-12 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-8 rounded-2xl bg-[#F04470]/10 border border-[#F04470]/30 text-xs text-[#F04470] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
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
      sublabel: total > 0 ? 'All ingested reviews' : 'No reviews ingested',
      icon: MessageSquare,
      color: '#20C5F5',
      badgeBg: 'bg-[#20C5F5]/10',
      badgeText: 'text-[#20C5F5]',
    },
    {
      title: 'Positive Reviews',
      value: positive,
      sublabel: `${formatPercent(positive, total)} of total`,
      icon: ThumbsUp,
      color: '#10D6A0',
      badgeBg: 'bg-[#10D6A0]/10',
      badgeText: 'text-[#10D6A0]',
    },
    {
      title: 'Neutral Reviews',
      value: neutral,
      sublabel: `${formatPercent(neutral, total)} of total`,
      icon: Minus,
      color: '#F5B942',
      badgeBg: 'bg-[#F5B942]/10',
      badgeText: 'text-[#F5B942]',
    },
    {
      title: 'Negative Reviews',
      value: negative,
      sublabel: `${formatPercent(negative, total)} of total`,
      icon: AlertCircle,
      color: '#F04470',
      badgeBg: 'bg-[#F04470]/10',
      badgeText: 'text-[#F04470]',
    },
    {
      title: 'Needs Reply',
      value: needsReply,
      sublabel: needsReply > 0 ? 'Action required' : 'All addressed',
      icon: HelpCircle,
      color: '#9165F5',
      badgeBg: 'bg-[#9165F5]/10',
      badgeText: 'text-[#9165F5]',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-2xl bg-[#101A2B] border border-white/5 p-4 flex flex-col justify-between hover:border-white/10 transition-all shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#9BAAC0] tracking-wide truncate">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg ${card.badgeBg} ${card.badgeText}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="my-2">
              <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {formatNumber(card.value)}
              </span>
            </div>

            <div className="text-[11px] text-[#9BAAC0] truncate">
              {card.sublabel}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
