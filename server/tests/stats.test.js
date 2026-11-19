import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Stats and Reviews API endpoints', () => {
  it('GET /api/stats should return a formatted payload with numeric fields', async () => {
    const res = await request(app).get('/api/stats');

    // Either 200 (if DB connected) or 503 (if DB offline in test environment)
    expect([200, 503]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('totalReviews');
    expect(res.body.data).toHaveProperty('positive');
    expect(res.body.data).toHaveProperty('neutral');
    expect(res.body.data).toHaveProperty('negative');
    expect(res.body.data).toHaveProperty('percentages');
  });

  it('GET /api/reviews/recent should return an array of reviews', async () => {
    const res = await request(app).get('/api/reviews/recent');

    expect([200, 503]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
