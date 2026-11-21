import { z } from 'zod';

export const VALID_TOPICS = [
  'quality',
  'delivery',
  'price',
  'packaging',
  'support',
  'size_fit',
  'other',
];

export const VALID_SENTIMENTS = ['positive', 'neutral', 'negative', 'unknown'];

export const singleReviewAnalysisSchema = z.object({
  sentiment: z.enum(['positive', 'neutral', 'negative', 'unknown'], {
    errorMap: () => ({ message: 'Sentiment must be one of: positive, neutral, negative, unknown' }),
  }),
  topics: z
    .array(z.enum(['quality', 'delivery', 'price', 'packaging', 'support', 'size_fit', 'other']))
    .min(1, 'At least one valid topic is required'),
  summary: z.string().min(1, 'Summary cannot be empty').max(500),
  needs_reply: z.boolean({
    errorMap: () => ({ message: 'needs_reply must be a boolean (true/false)' }),
  }),
});

export const batchItemAnalysisSchema = z.object({
  id: z.union([z.number(), z.string()]),
  sentiment: z.enum(['positive', 'neutral', 'negative', 'unknown']),
  topics: z
    .array(z.enum(['quality', 'delivery', 'price', 'packaging', 'support', 'size_fit', 'other']))
    .min(1),
  summary: z.string().min(1).max(500),
  needs_reply: z.boolean(),
});

export const batchResponseSchema = z.array(batchItemAnalysisSchema);

export const validateSingleAnalysis = (data) => {
  return singleReviewAnalysisSchema.safeParse(data);
};

export const validateBatchAnalysis = (data) => {
  return batchResponseSchema.safeParse(data);
};
