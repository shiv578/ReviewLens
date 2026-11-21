import Review from '../models/Review.js';
import { getDbStatus } from '../config/db.js';

/**
 * Flags reviews where star rating contradicts AI sentiment:
 * - High rating (>= 4 stars) with negative sentiment
 * - Low rating (<= 2 stars) with positive sentiment
 * Also computes overall agreement % between rating and sentiment
 */
export const getRatingMismatches = async (req, res) => {
  const dbStatus = getDbStatus();

  if (!dbStatus.isConnected) {
    return res.status(200).json({
      status: 'ok',
      message: 'Database is offline',
      data: {
        agreementRate: 100,
        totalRated: 0,
        totalAgreed: 0,
        totalMismatches: 0,
        breakdown: { highRatingNegative: 0, lowRatingPositive: 0 },
        mismatches: [],
      },
    });
  }

  try {
    // Fetch all reviews that have a numeric rating and valid sentiment
    const reviews = await Review.find({
      status: { $ne: 'skipped' },
      rating: { $ne: null, $gte: 1, $lte: 5 },
      sentiment: { $in: ['positive', 'neutral', 'negative'] },
    })
      .select('reviewId productName rating sentiment sentimentScore topics summary reviewText createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const totalRated = reviews.length;
    let totalAgreed = 0;
    const mismatches = [];
    let highRatingNegative = 0;
    let lowRatingPositive = 0;

    for (const r of reviews) {
      const isAgreed =
        (r.rating >= 4 && r.sentiment === 'positive') ||
        (r.rating === 3 && r.sentiment === 'neutral') ||
        (r.rating <= 2 && r.sentiment === 'negative');

      if (isAgreed) {
        totalAgreed++;
      } else {
        // Classify specific mismatch severity
        let mismatchType = null;
        let explanation = '';

        if (r.rating >= 4 && r.sentiment === 'negative') {
          mismatchType = 'HIGH_RATING_NEGATIVE_TEXT';
          explanation = `Rated ${r.rating} stars but review text express negative dissatisfaction.`;
          highRatingNegative++;
        } else if (r.rating <= 2 && r.sentiment === 'positive') {
          mismatchType = 'LOW_RATING_POSITIVE_TEXT';
          explanation = `Rated ${r.rating} star(s) but review expresses positive praise.`;
          lowRatingPositive++;
        } else if (r.rating >= 4 && r.sentiment === 'neutral') {
          mismatchType = 'HIGH_RATING_NEUTRAL_TEXT';
          explanation = `High ${r.rating} star rating with neutral feedback.`;
        } else if (r.rating <= 2 && r.sentiment === 'neutral') {
          mismatchType = 'LOW_RATING_NEUTRAL_TEXT';
          explanation = `Low ${r.rating} star rating with neutral feedback.`;
        }

        if (mismatchType) {
          mismatches.push({
            _id: r._id,
            reviewId: r.reviewId,
            productName: r.productName,
            rating: r.rating,
            sentiment: r.sentiment,
            sentimentScore: r.sentimentScore,
            topics: r.topics || [],
            summary: r.summary,
            reviewText: r.reviewText,
            mismatchType,
            explanation,
            createdAt: r.createdAt,
          });
        }
      }
    }

    const agreementRate = totalRated > 0 ? Number(((totalAgreed / totalRated) * 100).toFixed(1)) : 100;

    return res.status(200).json({
      status: 'ok',
      data: {
        agreementRate,
        totalRated,
        totalAgreed,
        totalMismatches: mismatches.length,
        breakdown: {
          highRatingNegative,
          lowRatingPositive,
          otherDiscrepancies: mismatches.length - (highRatingNegative + lowRatingPositive),
        },
        mismatches,
      },
    });
  } catch (error) {
    console.error('Error fetching rating mismatches:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to calculate rating mismatches',
      error: error.message,
    });
  }
};
