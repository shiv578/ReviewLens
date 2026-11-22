import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    reviewId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      maxlength: [10000, 'Review text cannot exceed 10000 characters'],
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      default: 'General',
      index: true,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: null, // null represents 'unknown'
    },
    sentiment: {
      type: String,
      enum: {
        values: ['positive', 'neutral', 'negative', 'unknown', 'analysis_failed'],
        message: '{VALUE} is not a valid sentiment',
      },
      default: null,
      index: true,
    },
    sentimentScore: {
      type: Number,
      min: -1,
      max: 1,
      default: null,
    },
    topics: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      trim: true,
      default: null,
    },
    needs_reply: {
      type: Boolean,
      default: false,
      index: true,
    },
    suggestedReply: {
      type: String,
      default: null,
    },
    suggestedReplyHindi: {
      type: String,
      default: null,
    },
    replyStatus: {
      type: String,
      enum: ['pending', 'drafted', 'sent', 'ignored'],
      default: 'pending',
    },
    contentHash: {
      type: String,
      index: true,
      default: null,
    },
    isDuplicate: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['analyzed', 'cached', 'duplicate', 'analysis_failed', 'skipped'],
      default: 'analyzed',
      index: true,
    },
    uploadBatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AnalysisBatch',
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ productName: 1, sentiment: 1 });
reviewSchema.index({ topics: 1 });
reviewSchema.index({ createdAt: -1 });

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
