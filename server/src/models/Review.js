import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      maxlength: [5000, 'Review text cannot exceed 5000 characters'],
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: null,
    },
    sentiment: {
      type: String,
      enum: {
        values: ['positive', 'neutral', 'negative'],
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
    suggestedReply: {
      type: String,
      default: null,
    },
    replyStatus: {
      type: String,
      enum: ['pending', 'drafted', 'sent', 'ignored'],
      default: 'pending',
    },
    isDuplicate: {
      type: Boolean,
      default: false,
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
reviewSchema.index({ createdAt: -1 });

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
