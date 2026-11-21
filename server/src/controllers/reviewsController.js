import Review from '../models/Review.js';
import AnalysisBatch from '../models/AnalysisBatch.js';
import { getDbStatus } from '../config/db.js';
import { isGeminiConfigured, analyzeReviewBatchWithGemini } from '../services/geminiService.js';

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

export const uploadReviewsBatch = async (req, res) => {
  const dbStatus = getDbStatus();

  if (!dbStatus.isConnected) {
    return res.status(503).json({
      status: 'error',
      message: 'Database is disconnected. Please ensure MongoDB is running.',
    });
  }

  const { fileName = 'manual_upload.csv', reviews } = req.body;

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Reviews array is required and must not be empty',
    });
  }

  try {
    // 1. Create AnalysisBatch record
    const batch = await AnalysisBatch.create({
      fileName,
      totalReviews: reviews.length,
      status: 'processing',
    });

    // 2. Perform AI Sentiment Analysis using Gemini if configured
    let aiResults = [];
    if (isGeminiConfigured()) {
      try {
        aiResults = await analyzeReviewBatchWithGemini(reviews);
      } catch (geminiErr) {
        console.warn('[Reviews Controller] Gemini batch analysis warning:', geminiErr.message);
      }
    }

    // 3. Prepare review documents with normalized fields
    let posCount = 0;
    let neuCount = 0;
    let negCount = 0;

    const docsToInsert = reviews.map((r, index) => {
      const aiMatch = aiResults.find((a) => a.id === index);

      let sentiment = aiMatch?.sentiment;
      if (!sentiment || !['positive', 'neutral', 'negative'].includes(sentiment)) {
        // Fallback sentiment inference by star rating if AI did not return a value
        const numRating = Number(r.rating);
        if (numRating >= 4) sentiment = 'positive';
        else if (numRating === 3) sentiment = 'neutral';
        else if (numRating > 0) sentiment = 'negative';
        else sentiment = 'neutral';
      }

      if (sentiment === 'positive') posCount++;
      else if (sentiment === 'neutral') neuCount++;
      else if (sentiment === 'negative') negCount++;

      return {
        reviewText: String(r.reviewText || '').trim(),
        productName: String(r.productName || 'Unspecified Product').trim(),
        rating: r.rating ? Number(r.rating) : null,
        sentiment,
        sentimentScore: typeof aiMatch?.sentimentScore === 'number' ? aiMatch.sentimentScore : null,
        topics: Array.isArray(aiMatch?.topics) ? aiMatch.topics : [],
        uploadBatchId: batch._id,
      };
    });

    const inserted = await Review.insertMany(docsToInsert);

    // 4. Update Batch status to completed
    batch.processedCount = inserted.length;
    batch.status = 'completed';
    batch.completedAt = new Date();
    batch.summary = {
      positiveCount: posCount,
      neutralCount: neuCount,
      negativeCount: negCount,
      duplicateCount: 0,
    };
    await batch.save();

    return res.status(201).json({
      status: 'ok',
      message: `Successfully analyzed and ingested ${inserted.length} customer reviews`,
      batchId: batch._id,
      count: inserted.length,
      summary: batch.summary,
    });
  } catch (error) {
    console.error('[Reviews Controller] Upload batch error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process reviews batch',
      error: error.message,
    });
  }
};
