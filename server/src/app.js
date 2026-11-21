import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();

// Security / Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.',
  },
});

app.use(limiter);

// CORS configuration supporting localhost, Vercel deployments, Render previews, and custom client URLs
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:80',
  'http://localhost',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, Render health checks)
      if (!origin) return callback(null, true);

      // Check explicit allowed origins list
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Allow any Vercel preview or production deployment (*.vercel.app)
      if (origin.endsWith('.vercel.app') || /^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      // Allow any Render deployment origin (*.onrender.com)
      if (origin.endsWith('.onrender.com') || /^https:\/\/[a-zA-Z0-9_-]+\.onrender\.com$/.test(origin)) {
        return callback(null, true);
      }

      // Wildcard check
      if (process.env.CLIENT_URL === '*') {
        return callback(null, true);
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount all API routes under /api
app.use('/api', routes);

// Root fallback / health probe
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'ReviewLens AI API',
    status: 'running',
    docs: '/api/health',
    timestamp: new Date().toISOString(),
  });
});

// Centralized error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Database initialization
connectDB();

const PORT = process.env.PORT || 5000;

// Export for tests, start if not imported
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[ReviewLens Server] Running on http://localhost:${PORT}`);
    console.log(`[ReviewLens Server] API mounted at http://localhost:${PORT}/api`);
  });
}

export default app;
