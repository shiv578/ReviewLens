import { GoogleGenAI } from '@google/genai';

let aiInstance = null;

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const getModelName = () => {
  return process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
};

export const isGeminiConfigured = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey !== 'your_gemini_api_key' && apiKey.length > 10);
};

// Resilient content generator with model fallback for high-demand spikes
async function generateWithFallback(ai, primaryModel, contents) {
  const candidateModels = [
    primaryModel,
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.8-flash',
  ].filter((m, idx, arr) => arr.indexOf(m) === idx);

  let lastError = null;
  for (const model of candidateModels) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents,
      });
      return { text: res.text, model };
    } catch (err) {
      lastError = err;
      const isHighDemandOrThrottled =
        err.message?.includes('503') ||
        err.message?.includes('high demand') ||
        err.message?.includes('429') ||
        err.message?.includes('UNAVAILABLE');

      console.warn(`[Gemini Service] Model ${model} failed (${err.message?.slice(0, 80)}...). Trying fallback...`);
      if (!isHighDemandOrThrottled) {
        // If it's a non-retryable error (e.g. invalid content), break
        break;
      }
    }
  }

  throw lastError || new Error('All candidate Gemini models failed to respond');
}

export const testGeminiConnection = async () => {
  const ai = getAIClient();
  if (!ai) {
    return { ok: false, error: 'GEMINI_API_KEY is not configured in server/.env' };
  }

  const model = getModelName();
  try {
    const res = await generateWithFallback(ai, model, 'Ping check. Respond with "pong".');
    return { ok: true, model: res.model, response: res.text?.trim() };
  } catch (error) {
    console.error('[Gemini Service] Connection test failed:', error.message);
    return { ok: false, model, error: error.message };
  }
};

export const generateCustomerReply = async ({ reviewText, tone = 'empathic', productName = 'our product' }) => {
  const ai = getAIClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const toneInstructions = {
    empathic: 'Empathetic, understanding, and solution-focused. Acknowledge frustration sincerely.',
    apologetic: 'Formal, polite, apologetic, and professional. Assure the customer that standards will be maintained.',
    concise: 'Direct, clear, concise, and focused on swift resolution or customer support contact.',
  };

  const prompt = `You are a professional customer experience manager responding to a customer review for "${productName}".
Review: "${reviewText}"
Tone: ${toneInstructions[tone] || toneInstructions.empathic}

Write a helpful, genuine, and brand-safe response. Keep it under 120 words. Do not include placeholders like "[Your Name]"—sign off as "The Support Team".`;

  const model = getModelName();
  const res = await generateWithFallback(ai, model, prompt);

  return res.text?.trim() || 'Thank you for your feedback. We are committed to making this right.';
};

export const answerCopilotQuery = async ({ question, reviews = [] }) => {
  const ai = getAIClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const reviewSummary = reviews.length > 0
    ? reviews.slice(0, 30).map((r, i) => `${i + 1}. [${r.productName || 'Unknown Product'}] (${r.sentiment || 'unrated'}, ${r.rating ? r.rating + '/5' : 'no rating'}): "${r.reviewText}"`).join('\n')
    : 'No customer reviews ingested into the database yet.';

  const prompt = `You are ReviewLens Copilot, an AI review intelligence assistant.
Your goal is to answer the store owner's questions about customer feedback using the reviews context below.

Customer Reviews Context:
${reviewSummary}

User Question: "${question}"

Guidelines:
- If there are reviews, reference specific patterns, product names, or complaints observed.
- If there are no reviews ingested yet, politely inform the store owner that no reviews have been uploaded yet and guide them to the Upload Reviews page.
- Keep the answer concise, insightful, and formatted with bullet points where appropriate.`;

  const model = getModelName();
  const res = await generateWithFallback(ai, model, prompt);

  return res.text?.trim() || 'I could not synthesize an answer from the current review data.';
};

export const analyzeReviewBatchWithGemini = async (reviews) => {
  const ai = getAIClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const items = reviews.slice(0, 15).map((r, i) => ({
    id: i,
    text: r.reviewText,
    product: r.productName,
    rating: r.rating,
  }));

  const prompt = `Analyze each customer review in this JSON array. Determine:
1. sentiment: exactly one of "positive", "neutral", or "negative"
2. sentimentScore: a number from -1.0 (very negative) to 1.0 (very positive)
3. topics: array of 1-3 short keyword strings (e.g. ["Shipping", "Quality", "Packaging"])

Reviews:
${JSON.stringify(items, null, 2)}

Respond with ONLY valid JSON array with objects matching:
[
  { "id": 0, "sentiment": "positive", "sentimentScore": 0.8, "topics": ["Sound Quality", "Battery"] }
]`;

  const model = getModelName();
  const res = await generateWithFallback(ai, model, prompt);

  let raw = res.text?.trim() || '[]';
  if (raw.startsWith('```json')) {
    raw = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  } else if (raw.startsWith('```')) {
    raw = raw.replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[Gemini Service] Could not parse batch JSON response, falling back to heuristic parsing:', err.message);
    return [];
  }
};
