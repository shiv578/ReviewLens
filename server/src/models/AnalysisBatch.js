import mongoose from 'mongoose';

const analysisBatchSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    processedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    summary: {
      positiveCount: { type: Number, default: 0 },
      neutralCount: { type: Number, default: 0 },
      negativeCount: { type: Number, default: 0 },
      failedCount: { type: Number, default: 0 },
      duplicateCount: { type: Number, default: 0 },
      skippedCount: { type: Number, default: 0 },
      needsReplyCount: { type: Number, default: 0 },
      cachedCount: { type: Number, default: 0 },
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

analysisBatchSchema.index({ createdAt: -1 });

export const AnalysisBatch =
  mongoose.models.AnalysisBatch || mongoose.model('AnalysisBatch', analysisBatchSchema);
export default AnalysisBatch;
