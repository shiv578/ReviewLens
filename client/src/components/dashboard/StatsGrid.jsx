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
            className="h-36 rounded-2xl bg-[#0C0C0F] border border-white/10 p-5 md:p-6 animate-pulse flex flex-col justify-between"
          >
            <div className="h-4 w-20 bg-white/10 rounded" />
            <div className="h-8 w-16 bg-white/10 rounded" />
            <div className="h-2 w-full bg-white/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-[#FF4B72]/10 border border-[#FF4B72]/30 text-xs text-[#FF4B72] flex items-center justify-between">
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
      color: '#00F0FF',
      badgeBg: 'bg-[#00F0FF]/10',
      badgeText: 'text-[#00F0FF]',
      barColor: 'bg-[#00F0FF]',
    },
    {
      title: 'Positive',
      value: positive,
      pct: total > 0 ? (positive / total) * 100 : 0,
      sublabel: `${formatPercent(positive, total)} ratio`,
      icon: ThumbsUp,
      color: '#10E599',
      badgeBg: 'bg-[#10E599]/10',
      badgeText: 'text-[#10E599]',
      barColor: 'bg-[#10E599]',
    },
    {
      title: 'Neutral',
      value: neutral,
      pct: total > 0 ? (neutral / total) * 100 : 0,
      sublabel: `${formatPercent(neutral, total)} ratio`,
      icon: Minus,
      color: '#FBBF24',
      badgeBg: 'bg-[#FBBF24]/10',
      badgeText: 'text-[#FBBF24]',
      barColor: 'bg-[#FBBF24]',
    },
    {
      title: 'Negative',
      value: negative,
      pct: total > 0 ? (negative / total) * 100 : 0,
      sublabel: `${formatPercent(negative, total)} ratio`,
      icon: AlertCircle,
      color: '#FF4B72',
      badgeBg: 'bg-[#FF4B72]/10',
      badgeText: 'text-[#FF4B72]',
      barColor: 'bg-[#FF4B72]',
    },
    {
      title: 'Needs Reply',
      value: needsReply,
      pct: negative > 0 ? (needsReply / negative) * 100 : 0,
      sublabel: needsReply > 0 ? 'Pending answer' : 'All clear',
      icon: HelpCircle,
      color: '#A855F7',
      badgeBg: 'bg-[#A855F7]/10',
      badgeText: 'text-[#A855F7]',
      barColor: 'bg-[#A855F7]',
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
            className="rounded-2xl bg-[#0C0C0F] border border-white/10 p-5 md:p-6 min-h-[140px] flex flex-col justify-between hover:border-white/20 transition-all shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8E8E98] tracking-wide truncate">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.badgeBg} ${card.badgeText}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="my-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {formatNumber(card.value)}
              </span>
              <span className="text-xs text-[#8E8E98] font-medium">
                {card.sublabel}
              </span>
            </div>

            {/* Mini visual indicator bar */}
            <div className="w-full bg-[#18181E] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${card.barColor} transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(0, card.pct))}%` }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
