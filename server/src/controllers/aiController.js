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
  const { reviewText, tone = 'empathic', productName } = req.body;
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
    });

    return res.status(200).json({
      status: 'ok',
      reply,
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
