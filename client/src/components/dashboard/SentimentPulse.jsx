import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { Brain } from 'lucide-react';
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
          { name: 'Positive', value: positive, color: 'var(--sentiment-pos)' },
          { name: 'Neutral', value: neutral, color: 'var(--sentiment-neu)' },
          { name: 'Negative', value: negative, color: 'var(--sentiment-neg)' },
        ]
      : [{ name: 'No Reviews', value: 1, color: 'var(--bg-surface)' }];

  let dominantSentiment = 'Awaiting Reviews';
  let dominantColor = 'var(--text-secondary)';
  if (total > 0) {
    if (positive >= neutral && positive >= negative) {
      dominantSentiment = 'Positive Sentiment';
      dominantColor = 'var(--sentiment-pos)';
    } else if (negative >= positive && negative >= neutral) {
      dominantSentiment = 'Needs Attention';
      dominantColor = 'var(--sentiment-neg)';
    } else {
      dominantSentiment = 'Neutral Sentiment';
      dominantColor = 'var(--sentiment-neu)';
    }
  }

  return (
    <div
      className="rounded-2xl p-6 md:p-7 min-h-[430px] flex flex-col justify-between shadow-sm transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-card)', border: `1px solid var(--border)` }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5" style={{ borderBottom: `1px solid var(--border)` }}>
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)', border: `1px solid var(--border)` }}
          >
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Sentiment Distribution</h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Real-time customer satisfaction breakdown</p>
          </div>
        </div>

        <div
          className="inline-flex p-1 rounded-xl"
          style={{ backgroundColor: 'var(--bg-surface)', border: `1px solid var(--border)` }}
        >
          {PERIODS.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
              style={
                selectedPeriod === period
                  ? { backgroundColor: 'var(--accent)', color: 'var(--btn-text)', fontWeight: 600 }
                  : { color: 'var(--text-secondary)' }
              }
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Donut + Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-4 flex-1">
        {/* Donut */}
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
                        <div
                          className="px-3 py-1.5 rounded-lg text-xs shadow-2xl"
                          style={{
                            backgroundColor: 'var(--bg-card)',
                            border: `1px solid var(--border)`,
                            color: 'var(--text-primary)',
                          }}
                        >
                          <span style={{ color: data.payload.color }} className="font-semibold">
                            {data.name}:{' '}
                          </span>
                          <span>{data.value} reviews</span>
                        </div>
                      );
                    }}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span style={{ color: dominantColor }} className="text-sm font-bold tracking-tight">
                {dominantSentiment}
              </span>
              <span className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {total > 0 ? `${formatNumber(total)} total` : '0 reviews'}
              </span>
            </div>
          </div>
        </div>

        {/* Rows */}
        <div className="sm:col-span-7 space-y-3">
          {[
            { label: 'Positive', value: positive, color: 'var(--sentiment-pos)' },
            { label: 'Neutral', value: neutral, color: 'var(--sentiment-neu)' },
            { label: 'Negative', value: negative, color: 'var(--sentiment-neg)' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="p-3.5 rounded-xl flex items-center justify-between text-xs sm:text-sm"
              style={{ backgroundColor: 'var(--bg-surface)', border: `1px solid var(--border)` }}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
              </div>
              <div className="flex items-center gap-3 font-semibold">
                <span style={{ color: 'var(--text-primary)' }}>{formatNumber(value)}</span>
                <span className="w-14 text-right" style={{ color }}>{formatPercent(value, total)}</span>
              </div>
            </div>
          ))}
          <p className="text-xs pt-1" style={{ color: 'var(--text-secondary)' }}>
            {total > 0
              ? `Aggregated over ${selectedPeriod}.`
              : 'Upload a CSV to generate sentiment trends.'}
          </p>
        </div>
      </div>
    </div>
  );
}
