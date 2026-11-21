import Review from '../models/Review.js';
import AnalysisBatch from '../models/AnalysisBatch.js';
import { getDbStatus } from '../config/db.js';

export const getStats = async (req, res) => {
  const dbStatus = getDbStatus();

  if (!dbStatus.isConnected) {
    return res.status(200).json({
      status: 'ok',
      message: 'Database is currently disconnected. Start MongoDB to access live review statistics.',
      data: {
        totalReviews: 0,
        positive: 0,
        neutral: 0,
        negative: 0,
        analysisFailed: 0,
        needsReply: 0,
        lastAnalysis: null,
        percentages: { positive: 0, neutral: 0, negative: 0 },
        topComplaints: [],
        topPraises: [],
      },
    });
  }

  try {
    const [
      totalReviews,
      positive,
      neutral,
      negative,
      analysisFailed,
      needsReply,
      lastBatch,
      negativeReviews,
      positiveReviews,
    ] = await Promise.all([
      Review.countDocuments({ status: { $ne: 'skipped' } }),
      Review.countDocuments({ sentiment: 'positive' }),
      Review.countDocuments({ sentiment: 'neutral' }),
      Review.countDocuments({ sentiment: 'negative' }),
      Review.countDocuments({ sentiment: 'analysis_failed' }),
      Review.countDocuments({ needs_reply: true }),
      AnalysisBatch.findOne({ status: 'completed' }).sort({ completedAt: -1 }).select('completedAt'),
      // Fetch negative reviews for top complaints
      Review.find({ sentiment: 'negative' })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('productName summary topics reviewText')
        .lean(),
      // Fetch positive reviews for top praises
      Review.find({ sentiment: 'positive' })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('productName summary topics reviewText')
        .lean(),
    ]);

    const ratedCount = positive + neutral + negative;
    const percentages = {
      positive: ratedCount > 0 ? Number(((positive / ratedCount) * 100).toFixed(1)) : 0,
      neutral: ratedCount > 0 ? Number(((neutral / ratedCount) * 100).toFixed(1)) : 0,
      negative: ratedCount > 0 ? Number(((negative / ratedCount) * 100).toFixed(1)) : 0,
    };

    // Synthesize Top 3 Complaints across all products (Requirement 7)
    const topComplaints = [];
    const seenComplaintTopics = new Set();
    for (const r of negativeReviews) {
      const primaryTopic = r.topics?.[0] || 'other';
      if (!seenComplaintTopics.has(primaryTopic) && topComplaints.length < 3) {
        seenComplaintTopics.add(primaryTopic);
        topComplaints.push({
          topic: primaryTopic,
          productName: r.productName,
          summary: r.summary || r.reviewText.slice(0, 100) + '...',
        });
      }
    }
    // Fallback if not enough distinct topics
    if (topComplaints.length < 3) {
      for (const r of negativeReviews) {
        if (!topComplaints.some((c) => c.summary === r.summary) && topComplaints.length < 3) {
          topComplaints.push({
            topic: r.topics?.[0] || 'other',
            productName: r.productName,
            summary: r.summary || r.reviewText.slice(0, 100) + '...',
          });
        }
      }
    }

    // Synthesize Top 3 Praises across all products (Requirement 7)
    const topPraises = [];
    const seenPraiseTopics = new Set();
    for (const r of positiveReviews) {
      const primaryTopic = r.topics?.[0] || 'other';
      if (!seenPraiseTopics.has(primaryTopic) && topPraises.length < 3) {
        seenPraiseTopics.add(primaryTopic);
        topPraises.push({
          topic: primaryTopic,
          productName: r.productName,
          summary: r.summary || r.reviewText.slice(0, 100) + '...',
        });
      }
    }
    if (topPraises.length < 3) {
      for (const r of positiveReviews) {
        if (!topPraises.some((p) => p.summary === r.summary) && topPraises.length < 3) {
          topPraises.push({
            topic: r.topics?.[0] || 'other',
            productName: r.productName,
            summary: r.summary || r.reviewText.slice(0, 100) + '...',
          });
        }
      }
    }

    return res.status(200).json({
      status: 'ok',
      data: {
        totalReviews,
        positive,
        neutral,
        negative,
        analysisFailed,
        needsReply,
        lastAnalysis: lastBatch?.completedAt || null,
        percentages,
        topComplaints,
        topPraises,
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

/**
 * Returns Cost and Speed Log:
 * total AI calls made, cached queries served, total processing time,
 * and breakdown by analysis batches.
 */
export const getCostLog = async (req, res) => {
  const dbStatus = getDbStatus();

  if (!dbStatus.isConnected) {
    return res.status(200).json({
      status: 'ok',
      message: 'Database is offline',
      data: {
        summary: {
          totalBatches: 0,
          totalReviewsProcessed: 0,
          totalAiCalls: 0,
          totalCached: 0,
          totalProcessingTimeMs: 0,
          averageSpeedReviewsPerSec: 0,
          estimatedCostSavingsUsd: '0.00',
        },
        batches: [],
      },
    });
  }

  try {
    const batches = await AnalysisBatch.find()
      .sort({ createdAt: -1 })
      .limit(25)
      .lean();

    let totalReviewsProcessed = 0;
    let totalAiCalls = 0;
    let totalCached = 0;
    let totalProcessingTimeMs = 0;

    const formattedBatches = batches.map((b) => {
      const summary = b.summary || {};
      const cached = summary.cachedCount || 0;
      const duplicates = summary.duplicateCount || 0;
      const skipped = summary.skippedCount || 0;
      const totalInBatch = b.totalReviews || b.processedCount || 0;
      // AI calls made is reviews analyzed fresh by LLM
      const aiCalls = Math.max(0, totalInBatch - cached - duplicates - skipped);
      const procTime = b.processingTimeMs || (b.completedAt && b.uploadedAt ? (new Date(b.completedAt) - new Date(b.uploadedAt)) : 1200);

      totalReviewsProcessed += totalInBatch;
      totalAiCalls += aiCalls;
      totalCached += cached;
      totalProcessingTimeMs += procTime;

      const speed = procTime > 0 ? Number(((totalInBatch / (procTime / 1000))).toFixed(1)) : 0;

      return {
        batchId: b._id,
        fileName: b.fileName,
        status: b.status,
        totalReviews: totalInBatch,
        aiCallsMade: aiCalls,
        cachedCount: cached,
        duplicateCount: duplicates,
        processingTimeMs: procTime,
        reviewsPerSecond: speed,
        completedAt: b.completedAt || b.createdAt,
      };
    });

    const overallSpeed =
      totalProcessingTimeMs > 0
        ? Number(((totalReviewsProcessed / (totalProcessingTimeMs / 1000))).toFixed(1))
        : 0;

    // Approximate cost savings: ~$0.00015 per review call saved by caching
    const estimatedCostSavingsUsd = (totalCached * 0.00015).toFixed(4);

    return res.status(200).json({
      status: 'ok',
      data: {
        summary: {
          totalBatches: batches.length,
          totalReviewsProcessed,
          totalAiCalls,
          totalCached,
          totalProcessingTimeMs,
          averageSpeedReviewsPerSec: overallSpeed,
          estimatedCostSavingsUsd,
        },
        batches: formattedBatches,
      },
    });
  } catch (error) {
    console.error('Error fetching cost and speed log:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve cost & speed metrics',
      error: error.message,
    });
  }
};
