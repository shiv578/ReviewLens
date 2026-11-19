import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Brain, Calendar, Info } from 'lucide-react';
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
          { name: 'Positive', value: positive, color: '#10D6A0' },
          { name: 'Neutral', value: neutral, color: '#F5B942' },
          { name: 'Negative', value: negative, color: '#F04470' },
        ]
      : [{ name: 'No Reviews', value: 1, color: '#1A273D' }];

  // Compute primary sentiment category
  let dominantSentiment = 'Awaiting Data';
  let dominantColor = '#9BAAC0';
  if (total > 0) {
    if (positive >= neutral && positive >= negative) {
      dominantSentiment = 'Positive';
      dominantColor = '#10D6A0';
    } else if (negative >= positive && negative >= neutral) {
      dominantSentiment = 'Needs Attention';
      dominantColor = '#F04470';
    } else {
      dominantSentiment = 'Neutral';
      dominantColor = '#F5B942';
    }
  }

  return (
    <div className="rounded-3xl bg-[#101A2B] border border-[#20C5F5]/15 p-6 mb-8 shadow-xl">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#10D6A0]/10 flex items-center justify-center text-[#10D6A0] border border-[#10D6A0]/20">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Sentiment Pulse
            </h3>
            <p className="text-xs text-[#9BAAC0]">
              Overall customer sentiment distribution & trend analysis
            </p>
          </div>
        </div>

        {/* Date Filter Buttons */}
        <div className="inline-flex p-1 rounded-xl bg-[#080D19] border border-white/5">
          {PERIODS.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                selectedPeriod === period
                  ? 'bg-[#10D6A0] text-[#080D19] font-semibold shadow-sm'
                  : 'text-[#9BAAC0] hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Donut + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
        {/* Donut Chart Visualization */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="h-56 w-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={88}
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
                        <div className="px-3 py-1.5 rounded-lg bg-[#080D19] border border-white/10 text-xs shadow-lg">
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
              <span className="text-xs uppercase tracking-wider text-[#9BAAC0] font-medium">
                Pulse
              </span>
              <span
                style={{ color: dominantColor }}
                className="text-base font-extrabold tracking-tight mt-0.5"
              >
                {dominantSentiment}
              </span>
              <span className="text-[11px] text-[#9BAAC0]">
                {total > 0 ? `${formatNumber(total)} reviews` : '0 reviews'}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Metrics & Sentiment Trend Details */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-3">
            {/* Positive Bar */}
            <div className="p-3 rounded-xl bg-[#080D19]/60 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#10D6A0]" />
                <span className="text-xs font-medium text-white">Positive Reviews</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-white">{formatNumber(positive)}</span>
                <span className="text-[#10D6A0] w-12 text-right">
                  {formatPercent(positive, total)}
                </span>
              </div>
            </div>

            {/* Neutral Bar */}
            <div className="p-3 rounded-xl bg-[#080D19]/60 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#F5B942]" />
                <span className="text-xs font-medium text-white">Neutral Reviews</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-white">{formatNumber(neutral)}</span>
                <span className="text-[#F5B942] w-12 text-right">
                  {formatPercent(neutral, total)}
                </span>
              </div>
            </div>

            {/* Negative Bar */}
            <div className="p-3 rounded-xl bg-[#080D19]/60 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#F04470]" />
                <span className="text-xs font-medium text-white">Negative Reviews</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-white">{formatNumber(negative)}</span>
                <span className="text-[#F04470] w-12 text-right">
                  {formatPercent(negative, total)}
                </span>
              </div>
            </div>
          </div>

          {/* Empty / Real Status Info */}
          <div className="pt-2 flex items-center gap-2 text-xs text-[#9BAAC0]">
            <Info className="h-4 w-4 text-[#20C5F5]" />
            <span>
              {total > 0
                ? `Calculated from ${formatNumber(total)} validated reviews across ${selectedPeriod}.`
                : 'No reviews ingested yet. Upload CSV files to activate live sentiment trending.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
