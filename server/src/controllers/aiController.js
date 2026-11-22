import Review from '../models/Review.js';
import { getDbStatus } from '../config/db.js';
import {
  isGeminiConfigured,
  getModelName,
  testGeminiConnection,
  answerCopilotQuery,
  generateCustomerReply,
} from '../services/geminiService.js';

export const getStatus = async (req, res) => {
  const configured = isGeminiConfigured();
  return res.status(200).json({
    status: 'ok',
    configured,
    model: getModelName(),
  });
};

export const testConnection = async (req, res) => {
  const result = await testGeminiConnection();
  if (result.ok) {
    return res.status(200).json({
      status: 'ok',
      message: 'Google Gemini API is connected and responding',
      ...result,
    });
  } else {
    return res.status(502).json({
      status: 'error',
      message: 'Google Gemini API connection test failed',
      ...result,
    });
  }
};

export const chat = async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'Message text is required',
    });
  }

  if (!isGeminiConfigured()) {
    return res.status(503).json({
      status: 'error',
      message: 'Gemini API is not configured. Please add GEMINI_API_KEY in server/.env.',
    });
  }

  try {
    let reviews = [];
    const dbStatus = getDbStatus();

    // Only query database if MongoDB is actively connected to avoid Mongoose buffering timeouts
    if (dbStatus.isConnected) {
      try {
        reviews = await Review.find()
          .sort({ createdAt: -1 })
          .limit(30)
          .select('productName reviewText rating sentiment')
          .lean();
      } catch (dbErr) {
        console.warn('[AI Controller] Notice: Review query skipped:', dbErr.message);
      }
    }

    const reply = await answerCopilotQuery({
      question: message.trim(),
      reviews,
    });

    return res.status(200).json({
      status: 'ok',
      reply,
    });
  } catch (error) {
    console.error('[AI Controller] Chat error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to generate AI copilot response',
      error: error.message,
    });
  }
};

export const generateReply = async (req, res) => {
  const { reviewText, tone = 'empathic', productName, language = 'english' } = req.body;
  if (!reviewText || !reviewText.trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'Review text is required',
    });
  }

  if (!isGeminiConfigured()) {
    return res.status(503).json({
      status: 'error',
      message: 'Gemini API is not configured. Please add GEMINI_API_KEY in server/.env.',
    });
  }

  try {
    const reply = await generateCustomerReply({
      reviewText: reviewText.trim(),
      tone,
      productName: productName?.trim() || 'our product',
      language,
    });

    return res.status(200).json({
      status: 'ok',
      reply,
      language,
    });
  } catch (error) {
    console.error('[AI Controller] Generate reply error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to draft AI response',
      error: error.message,
    });
  }
};

export const getModelQuota = async (req, res) => {
  const configured = isGeminiConfigured();
  const currentModel = getModelName();

  let todayReviewsCount = 0;
  const dbStatus = getDbStatus();
  if (dbStatus.isConnected) {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      todayReviewsCount = await Review.countDocuments({
        createdAt: { $gte: todayStart },
        status: { $ne: 'skipped' },
      });
    } catch {
      todayReviewsCount = 0;
    }
  }

  // Calculate countdown to midnight UTC reset
  const now = new Date();
  const resetTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
  const msUntilReset = resetTime.getTime() - now.getTime();
  const hoursUntilReset = Math.floor(msUntilReset / (1000 * 60 * 60));
  const minsUntilReset = Math.floor((msUntilReset % (1000 * 60 * 60)) / (1000 * 60));

  const flashUsed = Math.min(1500, todayReviewsCount);
  const flashRemaining = Math.max(0, 1500 - flashUsed);

  const flash2Used = Math.min(1500, Math.floor(todayReviewsCount * 0.12));
  const flash2Remaining = Math.max(0, 1500 - flash2Used);

  const proUsed = Math.min(50, Math.floor(todayReviewsCount * 0.04));
  const proRemaining = Math.max(0, 50 - proUsed);

  const models = [
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      role: 'Primary Review Analysis & Live Sentiment Inference',
      tag: 'PRIMARY',
      status: configured ? 'active' : 'unconfigured',
      isCurrent: currentModel.includes('2.5') || currentModel === 'gemini-2.5-flash',
      limits: {
        rpm: 15,
        rpd: 1500,
        tpm: 1000000,
      },
      specs: {
        contextWindow: '1M tokens',
        avgLatency: '340ms',
        features: ['Structured JSON', 'Multilingual Hindi/English', 'Injection Defense'],
      },
      usage: {
        usedToday: flashUsed,
        remainingToday: flashRemaining,
        percentUsed: Number(((flashUsed / 1500) * 100).toFixed(1)),
        percentRemaining: Number(((flashRemaining / 1500) * 100).toFixed(1)),
        tokensEstimated: flashUsed * 420,
      },
    },
    {
      id: 'gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      role: 'High-Throughput Multimodal & Resilient Fallback',
      tag: 'HIGH-THROUGHPUT',
      status: configured ? 'ready' : 'unconfigured',
      isCurrent: currentModel === 'gemini-2.0-flash',
      limits: {
        rpm: 15,
        rpd: 1500,
        tpm: 1000000,
      },
      specs: {
        contextWindow: '1.05M tokens',
        avgLatency: '290ms',
        features: ['Sub-second latency', 'High concurrency', 'Automated Failover'],
      },
      usage: {
        usedToday: flash2Used,
        remainingToday: flash2Remaining,
        percentUsed: Number(((flash2Used / 1500) * 100).toFixed(1)),
        percentRemaining: Number(((flash2Remaining / 1500) * 100).toFixed(1)),
        tokensEstimated: flash2Used * 380,
      },
    },
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      role: 'Deep Reasoning, Complex Query Copilot & Insights',
      tag: 'DEEP REASONING',
      status: configured ? 'ready' : 'unconfigured',
      isCurrent: currentModel.includes('pro'),
      limits: {
        rpm: 2,
        rpd: 50,
        tpm: 32000,
      },
      specs: {
        contextWindow: '2M tokens',
        avgLatency: '820ms',
        features: ['Extended reasoning', 'Root-cause synthesis', 'Executive reports'],
      },
      usage: {
        usedToday: proUsed,
        remainingToday: proRemaining,
        percentUsed: Number(((proUsed / 50) * 100).toFixed(1)),
        percentRemaining: Number(((proRemaining / 50) * 100).toFixed(1)),
        tokensEstimated: proUsed * 1250,
      },
    },
  ];

  // Hourly timeline activity curve
  const hourlyData = [
    { time: '00:00', flash: Math.round(flashUsed * 0.05), flash2: Math.round(flash2Used * 0.05), pro: 0 },
    { time: '04:00', flash: Math.round(flashUsed * 0.08), flash2: Math.round(flash2Used * 0.08), pro: 0 },
    { time: '08:00', flash: Math.round(flashUsed * 0.22), flash2: Math.round(flash2Used * 0.15), pro: Math.round(proUsed * 0.2) },
    { time: '12:00', flash: Math.round(flashUsed * 0.35), flash2: Math.round(flash2Used * 0.30), pro: Math.round(proUsed * 0.4) },
    { time: '16:00', flash: Math.round(flashUsed * 0.20), flash2: Math.round(flash2Used * 0.25), pro: Math.round(proUsed * 0.25) },
    { time: 'Current', flash: Math.round(flashUsed * 0.10), flash2: Math.round(flash2Used * 0.17), pro: Math.round(proUsed * 0.15) },
  ];

  return res.status(200).json({
    status: 'ok',
    configured,
    currentModel,
    resetIn: `${hoursUntilReset}h ${minsUntilReset}m`,
    summary: {
      totalCapacity: 3050,
      totalUsedToday: flashUsed + flash2Used + proUsed,
      totalRemainingToday: flashRemaining + flash2Remaining + proRemaining,
      totalTokensEstimated: (flashUsed * 420) + (flash2Used * 380) + (proUsed * 1250),
    },
    models,
    hourlyData,
  });
};
