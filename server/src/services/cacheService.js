import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const CACHE_FILE = path.join(DATA_DIR, 'analysis_cache.json');

// In-memory cache map
let cacheMap = new Map();
let isInitialized = false;

const initCache = () => {
  if (isInitialized) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      cacheMap = new Map(Object.entries(parsed));
    } else {
      fs.writeFileSync(CACHE_FILE, JSON.stringify({}, null, 2), 'utf-8');
      cacheMap = new Map();
    }
  } catch (err) {
    console.warn('[Cache Service] Cache initialization notice:', err.message);
    cacheMap = new Map();
  }
  isInitialized = true;
};

const persistCache = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const obj = Object.fromEntries(cacheMap);
    fs.writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Cache Service] Failed to persist cache to disk:', err.message);
  }
};

export const computeReviewHash = (text) => {
  if (!text) return '';
  const normalized = String(text).trim().toLowerCase().replace(/\s+/g, ' ');
  return crypto.createHash('sha256').update(normalized).digest('hex');
};

export const getCachedAnalysis = (textOrHash) => {
  initCache();
  if (!textOrHash) return null;
  const hash = textOrHash.length === 64 && /^[0-9a-f]+$/i.test(textOrHash)
    ? textOrHash
    : computeReviewHash(textOrHash);

  return cacheMap.get(hash) || null;
};

export const saveCachedAnalysis = (text, analysis) => {
  initCache();
  if (!text || !analysis) return;
  const hash = computeReviewHash(text);
  cacheMap.set(hash, {
    ...analysis,
    cachedAt: new Date().toISOString(),
  });
  persistCache();
};

export const saveBatchCachedAnalysis = (entries) => {
  initCache();
  if (!Array.isArray(entries) || entries.length === 0) return;
  let count = 0;
  for (const { text, analysis } of entries) {
    if (text && analysis) {
      const hash = computeReviewHash(text);
      cacheMap.set(hash, {
        ...analysis,
        cachedAt: new Date().toISOString(),
      });
      count++;
    }
  }
  if (count > 0) {
    persistCache();
  }
};

export const getCacheStats = () => {
  initCache();
  return {
    totalEntries: cacheMap.size,
    cacheFilePath: CACHE_FILE,
  };
};

export default {
  computeReviewHash,
  getCachedAnalysis,
  saveCachedAnalysis,
  saveBatchCachedAnalysis,
  getCacheStats,
};
