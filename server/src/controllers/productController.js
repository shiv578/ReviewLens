import Review from '../models/Review.js';
import { getDbStatus } from '../config/db.js';

/**
 * Returns a list of all products with aggregated review stats:
 * total reviews, average rating, sentiment distribution, and top topic.
 */
export const getProductsList = async (req, res) => {
  const dbStatus = getDbStatus();

  if (!dbStatus.isConnected) {
    return res.status(200).json({
      status: 'ok',
      message: 'Database is offline',
      data: [],
    });
  }

  try {
    const products = await Review.aggregate([
      { $match: { status: { $ne: 'skipped' }, productName: { $ne: null, $ne: '' } } },
      {
        $group: {
          _id: '$productName',
          totalReviews: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          positiveCount: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] },
          },
          neutralCount: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] },
          },
          negativeCount: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] },
          },
          needsReplyCount: {
            $sum: { $cond: [{ $eq: ['$needs_reply', true] }, 1, 0] },
          },
          allTopics: { $push: '$topics' },
        },
      },
      { $sort: { totalReviews: -1 } },
    ]);

    const formatted = products.map((p) => {
      // Flatten topics and find most frequent
      const topicFreq = {};
      (p.allTopics || []).flat().forEach((t) => {
        if (t && t !== 'other') {
          topicFreq[t] = (topicFreq[t] || 0) + 1;
        }
      });
      const topTopic = Object.entries(topicFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'general';

      const validCount = p.positiveCount + p.neutralCount + p.negativeCount;
      return {
        productName: p._id,
        totalReviews: p.totalReviews,
        avgRating: p.avgRating ? Number(p.avgRating.toFixed(1)) : null,
        positiveCount: p.positiveCount,
        neutralCount: p.neutralCount,
        negativeCount: p.negativeCount,
        needsReplyCount: p.needsReplyCount,
        positivePercentage: validCount > 0 ? Number(((p.positiveCount / validCount) * 100).toFixed(1)) : 0,
        neutralPercentage: validCount > 0 ? Number(((p.neutralCount / validCount) * 100).toFixed(1)) : 0,
        negativePercentage: validCount > 0 ? Number(((p.negativeCount / validCount) * 100).toFixed(1)) : 0,
        topTopic,
      };
    });

    return res.status(200).json({
      status: 'ok',
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching products list:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve products list',
      error: error.message,
    });
  }
};

/**
 * Returns in-depth details for a single product:
 * sentiment split, rating distribution (1-5 stars), top issues (complaints),
 * top praises, rating mismatch count, and recent reviews.
 */
export const getProductDetail = async (req, res) => {
  const dbStatus = getDbStatus();
  const { productName } = req.params;

  if (!dbStatus.isConnected) {
    return res.status(200).json({
      status: 'ok',
      message: 'Database is offline',
      data: null,
    });
  }

  try {
    const decodedName = decodeURIComponent(productName);

    const [reviews, negativeReviews, positiveReviews] = await Promise.all([
      Review.find({ productName: decodedName, status: { $ne: 'skipped' } })
        .sort({ createdAt: -1 })
        .lean(),
      Review.find({ productName: decodedName, sentiment: 'negative' })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('reviewId reviewText summary topics rating needs_reply')
        .lean(),
      Review.find({ productName: decodedName, sentiment: 'positive' })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('reviewId reviewText summary topics rating')
        .lean(),
    ]);

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `No reviews found for product: ${decodedName}`,
      });
    }

    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    let needsReplyCount = 0;
    let ratingSum = 0;
    let ratedReviewsCount = 0;
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let mismatchCount = 0;

    for (const r of reviews) {
      if (r.sentiment === 'positive') positiveCount++;
      else if (r.sentiment === 'neutral') neutralCount++;
      else if (r.sentiment === 'negative') negativeCount++;

      if (r.needs_reply) needsReplyCount++;

      if (r.rating && r.rating >= 1 && r.rating <= 5) {
        ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
        ratingSum += r.rating;
        ratedReviewsCount++;

        // Mismatch check
        if ((r.rating >= 4 && r.sentiment === 'negative') || (r.rating <= 2 && r.sentiment === 'positive')) {
          mismatchCount++;
        }
      }
    }

    const totalValid = positiveCount + neutralCount + negativeCount;
    const avgRating = ratedReviewsCount > 0 ? Number((ratingSum / ratedReviewsCount).toFixed(1)) : null;

    // Distinct top issues
    const topIssues = [];
    const seenIssueTopics = new Set();
    for (const r of negativeReviews) {
      const topic = r.topics?.[0] || 'general';
      if (!seenIssueTopics.has(topic) && topIssues.length < 5) {
        seenIssueTopics.add(topic);
        topIssues.push({
          topic,
          summary: r.summary || r.reviewText.slice(0, 100),
          rating: r.rating,
          reviewId: r.reviewId,
        });
      }
    }

    // Distinct top praises
    const topPraises = [];
    const seenPraiseTopics = new Set();
    for (const r of positiveReviews) {
      const topic = r.topics?.[0] || 'quality';
      if (!seenPraiseTopics.has(topic) && topPraises.length < 5) {
        seenPraiseTopics.add(topic);
        topPraises.push({
          topic,
          summary: r.summary || r.reviewText.slice(0, 100),
          rating: r.rating,
          reviewId: r.reviewId,
        });
      }
    }

    return res.status(200).json({
      status: 'ok',
      data: {
        productName: decodedName,
        totalReviews: reviews.length,
        avgRating,
        sentimentSplit: {
          positive: positiveCount,
          neutral: neutralCount,
          negative: negativeCount,
          positivePercentage: totalValid > 0 ? Number(((positiveCount / totalValid) * 100).toFixed(1)) : 0,
          neutralPercentage: totalValid > 0 ? Number(((neutralCount / totalValid) * 100).toFixed(1)) : 0,
          negativePercentage: totalValid > 0 ? Number(((negativeCount / totalValid) * 100).toFixed(1)) : 0,
        },
        ratingDistribution,
        mismatchCount,
        needsReplyCount,
        topIssues,
        topPraises,
        recentReviews: reviews.slice(0, 15),
      },
    });
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve product details',
      error: error.message,
    });
  }
};
