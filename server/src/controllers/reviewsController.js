import Papa from 'papaparse';
import Review from '../models/Review.js';
import AnalysisBatch from '../models/AnalysisBatch.js';
import { getDbStatus } from '../config/db.js';
import {
  isGeminiConfigured,
  processAllReviewsWithBatchesAndCache,
  generateCustomerReply,
} from '../services/geminiService.js';
import cacheService from '../services/cacheService.js';

/**
 * Normalizes CSV row object into standard review format
 */
function normalizeCsvRow(row, index) {
  const keys = Object.keys(row);
  const findVal = (possibleKeys) => {
    for (const pk of possibleKeys) {
      const match = keys.find((k) => k.trim().toLowerCase() === pk.toLowerCase());
      if (match && row[match] !== undefined && row[match] !== null) {
        return String(row[match]).trim();
      }
    }
    return '';
  };

  const reviewText = findVal(['reviewtext', 'review_text', 'review', 'feedback', 'comment', 'text', 'raw_text']);
  const productName = findVal(['productname', 'product_name', 'product', 'item', 'title', 'sku']) || 'General Product';
  const reviewId = findVal(['reviewid', 'review_id', 'id', 'r_id', 'ref']) || `R${String(index + 1).padStart(3, '0')}`;

  const ratingRaw = findVal(['rating', 'score', 'stars', 'star']);
  let rating = null;
  if (ratingRaw !== '') {
    const num = Number(ratingRaw);
    if (!isNaN(num) && num >= 1 && num <= 5) {
      rating = num;
    }
  }

  return {
    reviewId,
    reviewText,
    productName,
    rating, // null = unknown
  };
}

/**
 * Uploads & analyzes reviews from parsed JSON or CSV file
 */
export const uploadReviewsBatch = async (req, res) => {
  let fileName = req.body?.fileName || req.file?.originalname || 'reviews.csv';
  let rawRows = [];

  // 1. Ingest from uploaded CSV file (Multer memory buffer)
  if (req.file?.buffer) {
    const csvString = req.file.buffer.toString('utf-8');
    const parsed = Papa.parse(csvString, {
      header: true,
      skipEmptyLines: 'greedy',
    });
    rawRows = (parsed.data || []).map((row, idx) => normalizeCsvRow(row, idx));
  } else if (Array.isArray(req.body?.reviews)) {
    // Ingest from JSON array payload
    rawRows = req.body.reviews.map((row, idx) => normalizeCsvRow(row, idx));
  } else if (typeof req.body?.csvText === 'string') {
    // Ingest from raw CSV text string
    const parsed = Papa.parse(req.body.csvText, {
      header: true,
      skipEmptyLines: 'greedy',
    });
    rawRows = (parsed.data || []).map((row, idx) => normalizeCsvRow(row, idx));
  } else {
    return res.status(400).json({
      status: 'error',
      message: 'No CSV file or reviews array provided. Please upload a valid reviews.csv file.',
    });
  }

  if (rawRows.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'The uploaded file contains no data rows.',
    });
  }

  const dbStatus = getDbStatus();

  try {
    let batch = null;
    if (dbStatus.isConnected) {
      batch = await AnalysisBatch.create({
        fileName,
        totalReviews: rawRows.length,
        status: 'processing',
      });
    }

    // 2. Process reviews with duplicate detection, caching, batching (5 per chunk), exponential backoff, and Zod validation
    const startTime = Date.now();
    const processedReviews = await processAllReviewsWithBatchesAndCache(rawRows, 5);
    const processingTimeMs = Date.now() - startTime;

    // 3. Calculate batch metrics
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    let failedCount = 0;
    let duplicateCount = 0;
    let skippedCount = 0;
    let needsReplyCount = 0;
    let cachedCount = 0;

    for (const r of processedReviews) {
      if (r.status === 'skipped') skippedCount++;
      if (r.isDuplicate) duplicateCount++;
      if (r.status === 'cached') cachedCount++;
      if (r.sentiment === 'positive') positiveCount++;
      else if (r.sentiment === 'neutral') neutralCount++;
      else if (r.sentiment === 'negative') negativeCount++;
      else if (r.sentiment === 'analysis_failed') failedCount++;
      if (r.needs_reply) needsReplyCount++;
    }

    // 4. Save to MongoDB if connected (with error handling to not crash if DB write fails)
    let savedDocs = [];
    if (dbStatus.isConnected) {
      try {
        const docsToInsert = processedReviews.map((r) => ({
          reviewId: r.reviewId,
          reviewText: r.reviewText,
          productName: r.productName,
          rating: r.rating,
          sentiment: r.sentiment,
          topics: r.topics || [],
          summary: r.summary,
          needs_reply: Boolean(r.needs_reply),
          contentHash: r.contentHash,
          isDuplicate: Boolean(r.isDuplicate),
          status: r.status,
          uploadBatchId: batch?._id || null,
        }));

        savedDocs = await Review.insertMany(docsToInsert, { ordered: false });

        if (batch) {
          batch.processedCount = savedDocs.length;
          batch.status = 'completed';
          batch.completedAt = new Date();
          batch.processingTimeMs = processingTimeMs;
          batch.summary = {
            positiveCount,
            neutralCount,
            negativeCount,
            failedCount,
            duplicateCount,
            skippedCount,
            needsReplyCount,
            cachedCount,
          };
          await batch.save();
        }
      } catch (dbInsertErr) {
        console.warn('[Reviews Controller] DB insertion warning:', dbInsertErr.message);
      }
    }

    const aiCallsMade = Math.max(0, processedReviews.length - cachedCount - duplicateCount - skippedCount);

    return res.status(200).json({
      status: 'ok',
      message: `Processed ${processedReviews.length} reviews (${cachedCount} from cache, ${duplicateCount} duplicates, ${failedCount} failed validation)`,
      batchId: batch?._id || null,
      costLog: {
        totalReviews: processedReviews.length,
        aiCallsMade,
        cachedCount,
        duplicateCount,
        processingTimeMs,
        speedReviewsPerSec: processingTimeMs > 0 ? Number(((processedReviews.length / (processingTimeMs / 1000))).toFixed(1)) : 0,
      },
      summary: {
        totalReviews: processedReviews.length,
        positiveCount,
        neutralCount,
        negativeCount,
        failedCount,
        duplicateCount,
        skippedCount,
        needsReplyCount,
        cachedCount,
      },
      data: dbStatus.isConnected ? savedDocs : processedReviews,
    });
  } catch (error) {
    console.error('[Reviews Controller] Upload processing error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process reviews dataset',
      error: error.message,
    });
  }
};

/**
 * Retrieves reviews with search and multiple filters
 * (product, sentiment, topic, needs_reply, pagination)
 */
export const getReviews = async (req, res) => {
  const dbStatus = getDbStatus();

  if (!dbStatus.isConnected) {
    return res.status(200).json({
      status: 'ok',
      message: 'Database is currently offline.',
      data: [],
      products: [],
      topics: [],
      pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    });
  }

  try {
    const {
      q,
      product,
      sentiment,
      topic,
      needs_reply,
      rating,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { status: { $ne: 'skipped' } };

    if (q && q.trim()) {
      const regex = { $regex: q.trim(), $options: 'i' };
      query.$or = [{ reviewText: regex }, { productName: regex }, { summary: regex }, { reviewId: regex }];
    }

    if (product && product !== 'all') {
      query.productName = product;
    }

    if (sentiment && sentiment !== 'all') {
      query.sentiment = sentiment;
    }

    if (topic && topic !== 'all') {
      query.topics = topic;
    }

    if (needs_reply !== undefined && needs_reply !== 'all') {
      query.needs_reply = needs_reply === 'true' || needs_reply === true;
    }

    if (rating && rating !== 'all') {
      if (rating === 'unknown') {
        query.rating = null;
      } else {
        const numRating = Number(rating);
        if (!isNaN(numRating)) query.rating = numRating;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [total, reviews, allProducts, allTopics] = await Promise.all([
      Review.countDocuments(query),
      Review.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Review.distinct('productName'),
      Review.distinct('topics'),
    ]);

    return res.status(200).json({
      status: 'ok',
      data: reviews,
      products: (allProducts || []).filter(Boolean),
      topics: (allTopics || []).filter(Boolean),
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

/**
 * Generates an empathetic reply for a specific review on-click (Requirement 7)
 */
export const generateSuggestedReply = async (req, res) => {
  const { id } = req.params;
  const { tone = 'empathic', language = 'english' } = req.body;

  const dbStatus = getDbStatus();

  try {
    let review = null;
    if (dbStatus.isConnected && id) {
      review = await Review.findById(id);
    }

    const reviewText = review?.reviewText || req.body?.reviewText;
    const productName = review?.productName || req.body?.productName || 'our product';

    if (!reviewText) {
      return res.status(400).json({
        status: 'error',
        message: 'Review text is required to generate a reply',
      });
    }

    const reply = await generateCustomerReply({
      reviewText,
      tone,
      productName,
      language,
    });

    if (review) {
      if (language === 'hindi' || language === 'hi') {
        review.suggestedReplyHindi = reply;
      } else {
        review.suggestedReply = reply;
      }
      review.replyStatus = 'drafted';
      await review.save();
    }

    return res.status(200).json({
      status: 'ok',
      reply,
      language,
      reviewId: id,
    });
  } catch (error) {
    console.error('Error generating suggested reply on demand:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to generate suggested reply',
      error: error.message,
    });
  }
};

export const getRecentReviews = async (req, res) => {
  const dbStatus = getDbStatus();

  if (!dbStatus.isConnected) {
    return res.status(200).json({
      status: 'ok',
      count: 0,
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

export default {
  uploadReviewsBatch,
  getReviews,
  generateSuggestedReply,
  getRecentReviews,
};
