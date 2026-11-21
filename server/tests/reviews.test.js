import { describe, it, expect } from 'vitest';
import { validateSingleAnalysis, VALID_TOPICS, VALID_SENTIMENTS } from '../src/validators/reviewValidator.js';
import cacheService from '../src/services/cacheService.js';

describe('Review Intelligence Validation & Caching Unit Tests', () => {
  it('should validate valid structured review analysis schema (Requirement 2 & 3)', () => {
    const validPayload = {
      sentiment: 'positive',
      topics: ['quality', 'delivery'],
      summary: 'Great audio quality and quick delivery.',
      needs_reply: false,
    };

    const result = validateSingleAnalysis(validPayload);
    expect(result.success).toBe(true);
    expect(result.data.sentiment).toBe('positive');
  });

  it('should reject invalid sentiment or topics outside allowed list (Requirement 3)', () => {
    const invalidPayload = {
      sentiment: 'super_happy', // Invalid
      topics: ['shipping_delay', 'unknown_topic'], // Invalid
      summary: 'Some summary',
      needs_reply: false,
    };

    const result = validateSingleAnalysis(invalidPayload);
    expect(result.success).toBe(false);
  });

  it('should generate consistent sha256 hashes for duplicate detection and caching (Requirement 1 & 6)', () => {
    const text1 = '  Great sound quality and fast shipping!  ';
    const text2 = 'great sound quality and fast shipping!';

    const hash1 = cacheService.computeReviewHash(text1);
    const hash2 = cacheService.computeReviewHash(text2);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it('should save and retrieve review analysis from persistent cache (Requirement 6)', () => {
    const reviewText = 'Unique test review for caching verification 12345';
    const analysis = {
      sentiment: 'negative',
      topics: ['packaging'],
      summary: 'Packaging was damaged upon arrival.',
      needs_reply: true,
    };

    cacheService.saveCachedAnalysis(reviewText, analysis);
    const retrieved = cacheService.getCachedAnalysis(reviewText);

    expect(retrieved).not.toBeNull();
    expect(retrieved.sentiment).toBe('negative');
    expect(retrieved.topics).toEqual(['packaging']);
    expect(retrieved.needs_reply).toBe(true);
  });
});
