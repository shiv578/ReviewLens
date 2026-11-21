export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercent = (value, total) => {
  if (!total || total === 0 || !value || value === 0) return '0%';
  const pct = (value / total) * 100;
  return `${pct.toFixed(1)}%`;
};

export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return 'Never';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Never';

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

export const getSentimentColor = (sentiment) => {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return '#10E599'; // Cyber Emerald
    case 'neutral':
      return '#FBBF24'; // Cyber Amber
    case 'negative':
      return '#FF4B72'; // Cyber Rose
    default:
      return '#8E8E98'; // Muted Gray
  }
};

export const getSentimentLabel = (sentiment) => {
  if (!sentiment) return 'Unclassified';
  return sentiment.charAt(0).toUpperCase() + sentiment.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};
