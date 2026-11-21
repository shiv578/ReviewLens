import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { Brain, Info } from 'lucide-react';
import { formatNumber, formatPercent } from '../../utils/formatters';

const PERIODS = ['7 days', '30 days', '90 days'];

export default function SentimentPulse({ stats, loading }) {
  const [selectedPeriod, setSelectedPeriod] = useState('30 days');

  const positive = stats?.positive || 0;
  const neutral = stats?.neutral || 0;
  const negative = stats?.negative || 0;
  const total = positive + neutral + negative;

  const donutData =
    total > 0
      ? [
          { name: 'Positive', value: positive, color: '#10E599' },
          { name: 'Neutral', value: neutral, color: '#FBBF24' },
          { name: 'Negative', value: negative, color: '#FF4B72' },
        ]
      : [{ name: 'No Reviews', value: 1, color: '#1A1A22' }];

  let dominantSentiment = 'Awaiting Reviews';
  let dominantColor = '#8E8E98';
  if (total > 0) {
    if (positive >= neutral && positive >= negative) {
      dominantSentiment = 'Positive Sentiment';
      dominantColor = '#10E599';
    } else if (negative >= positive && negative >= neutral) {
      dominantSentiment = 'Needs Attention';
      dominantColor = '#FF4B72';
    } else {
      dominantSentiment = 'Neutral Sentiment';
      dominantColor = '#FBBF24';
    }
  }

  return (
    <div className="rounded-2xl bg-[#0C0C0F] border border-white/10 p-6 md:p-7 min-h-[430px] flex flex-col justify-between shadow-xl">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] border border-[#00F0FF]/25">
            <Brain className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Sentiment Distribution
            </h3>
            <p className="text-xs text-[#8E8E98]">
              Real-time customer satisfaction breakdown
            </p>
          </div>
        </div>

        {/* Date Filter Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-[#050507] border border-white/10">
          {PERIODS.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedPeriod === period
                  ? 'bg-[#00F0FF] text-black font-semibold shadow-md shadow-[#00F0FF]/20'
                  : 'text-[#8E8E98] hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Donut & Metrics Side by Side */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-4 flex-1">
        {/* Donut Chart */}
        <div className="sm:col-span-5 flex items-center justify-center relative">
          <div className="h-56 w-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={86}
                  paddingAngle={total > 0 ? 3 : 0}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {total > 0 && (
                  <RechartsTooltip
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const data = payload[0];
                      return (
                        <div className="px-3 py-1.5 rounded-lg bg-[#000000] border border-white/20 text-xs shadow-2xl">
                          <span style={{ color: data.payload.color }} className="font-semibold">
                            {data.name}:{' '}
                          </span>
                          <span className="text-white">{data.value} reviews</span>
                        </div>
                      );
                    }}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span
                style={{ color: dominantColor }}
                className="text-sm font-bold tracking-tight"
              >
                {dominantSentiment}
              </span>
              <span className="text-xs text-[#8E8E98] mt-1">
                {total > 0 ? `${formatNumber(total)} total` : '0 reviews'}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Metric Rows */}
        <div className="sm:col-span-7 space-y-3">
          {/* Positive */}
          <div className="p-3.5 rounded-xl bg-[#141418] border border-white/5 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-[#10E599]" />
              <span className="text-white font-medium">Positive</span>
            </div>
            <div className="flex items-center gap-3 font-semibold">
              <span className="text-white">{formatNumber(positive)}</span>
              <span className="text-[#10E599] w-14 text-right">
                {formatPercent(positive, total)}
              </span>
            </div>
          </div>

          {/* Neutral */}
          <div className="p-3.5 rounded-xl bg-[#141418] border border-white/5 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-[#FBBF24]" />
              <span className="text-white font-medium">Neutral</span>
            </div>
            <div className="flex items-center gap-3 font-semibold">
              <span className="text-white">{formatNumber(neutral)}</span>
              <span className="text-[#FBBF24] w-14 text-right">
                {formatPercent(neutral, total)}
              </span>
            </div>
          </div>

          {/* Negative */}
          <div className="p-3.5 rounded-xl bg-[#141418] border border-white/5 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-[#FF4B72]" />
              <span className="text-white font-medium">Negative</span>
            </div>
            <div className="flex items-center gap-3 font-semibold">
              <span className="text-white">{formatNumber(negative)}</span>
              <span className="text-[#FF4B72] w-14 text-right">
                {formatPercent(negative, total)}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#8E8E98] pt-1">
            {total > 0
              ? `Aggregated over ${selectedPeriod}.`
              : 'Upload a CSV to generate sentiment trends.'}
          </p>
        </div>
      </div>
    </div>
  );
}
