import mongoose from 'mongoose';
import Review from '../models/Review.js';
import AnalysisBatch from '../models/AnalysisBatch.js';
import { getDbStatus } from '../config/db.js';

export const getStats = async (req, res) => {
  const dbStatus = getDbStatus();

  // If DB is disconnected, gracefully return 503 or empty response with connection warning
  if (!dbStatus.isConnected) {
    return res.status(503).json({
      status: 'error',
      message: 'Database is currently disconnected. Start MongoDB to access live review statistics.',
      data: {
        totalReviews: 0,
        positive: 0,
        neutral: 0,
        negative: 0,
        needsReply: 0,
        lastAnalysis: null,
        percentages: { positive: 0, neutral: 0, negative: 0 },
      },
    });
  }

  try {
    const [totalReviews, positive, neutral, negative, needsReply, lastBatch] = await Promise.all([
      Review.countDocuments(),
      Review.countDocuments({ sentiment: 'positive' }),
      Review.countDocuments({ sentiment: 'neutral' }),
      Review.countDocuments({ sentiment: 'negative' }),
      Review.countDocuments({ sentiment: 'negative', $or: [{ suggestedReply: null }, { suggestedReply: '' }] }),
      AnalysisBatch.findOne({ status: 'completed' }).sort({ completedAt: -1 }).select('completedAt'),
    ]);

    const ratedCount = positive + neutral + negative;
    const percentages = {
      positive: ratedCount > 0 ? Number(((positive / ratedCount) * 100).toFixed(1)) : 0,
      neutral: ratedCount > 0 ? Number(((neutral / ratedCount) * 100).toFixed(1)) : 0,
      negative: ratedCount > 0 ? Number(((negative / ratedCount) * 100).toFixed(1)) : 0,
    };

    return res.status(200).json({
      status: 'ok',
      data: {
        totalReviews,
        positive,
        neutral,
        negative,
        needsReply,
        lastAnalysis: lastBatch?.completedAt || null,
        percentages,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve review statistics',
      error: error.message,
    });
  }
};
