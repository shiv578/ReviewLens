import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('AI API endpoints', () => {
  it('GET /api/ai/status should return configured status and model', async () => {
    const res = await request(app).get('/api/ai/status');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('configured');
    expect(res.body).toHaveProperty('model');
  });

  it('GET /api/health should include gemini status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('gemini');
    expect(res.body.gemini).toHaveProperty('configured');
  });
});
