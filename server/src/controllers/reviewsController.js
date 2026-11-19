import Review from '../models/Review.js';
import { getDbStatus } from '../config/db.js';

export const getRecentReviews = async (req, res) => {
  const dbStatus = getDbStatus();

  if (!dbStatus.isConnected) {
    return res.status(503).json({
      status: 'error',
      message: 'Database is currently disconnected.',
      data: [],
    });
  }

  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({
      status: 'ok',
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error('Error fetching recent reviews:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch recent reviews',
      error: error.message,
    });
  }
};

export const getReviews = async (req, res) => {
  const dbStatus = getDbStatus();

  if (!dbStatus.isConnected) {
    return res.status(503).json({
      status: 'error',
      message: 'Database is currently disconnected.',
      data: [],
      pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    });
  }

  try {
    const { q, sentiment, rating, page = 1, limit = 20 } = req.query;
    const query = {};

    if (q) {
      query.$or = [
        { reviewText: { $regex: q, $options: 'i' } },
        { productName: { $regex: q, $options: 'i' } },
      ];
    }

    if (sentiment && ['positive', 'neutral', 'negative'].includes(sentiment)) {
      query.sentiment = sentiment;
    }

    if (rating) {
      const parsedRating = Number(rating);
      if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
        query.rating = parsedRating;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [total, reviews] = await Promise.all([
      Review.countDocuments(query),
      Review.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    ]);

    return res.status(200).json({
      status: 'ok',
      data: reviews,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 0,
      },
    });
  } catch (error) {
    console.error('Error searching reviews:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve reviews',
      error: error.message,
    });
  }
};
