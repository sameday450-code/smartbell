const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { errorHandler, notFound } = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

// Route imports
const authRoutes = require('./modules/auth/auth.routes');
const schoolRoutes = require('./modules/schools/schools.routes');
const userRoutes = require('./modules/users/users.routes');
const deviceRoutes = require('./modules/devices/devices.routes');
const announcementRoutes = require('./modules/announcements/announcements.routes');
const scheduleRoutes = require('./modules/schedules/schedules.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const subscriptionRoutes = require('./modules/subscriptions/subscriptions.routes');
const audioFileRoutes = require('./modules/audio-files/audio-files.routes');

const app = express();

// Trust proxy (for Vercel/reverse proxies)
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://smartbell.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Compression
app.use(compression());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (msg) => logger.http(msg.trim()) },
  }));
}

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', globalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'SmartBell API' });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/schools', schoolRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/announcements', announcementRoutes);
app.use('/api/v1/schedules', scheduleRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/audio-files', audioFileRoutes);

// ── Vercel Cron Job endpoint ──────────────────────────────────────────────
// Called every minute by Vercel Cron (replaces node-cron in serverless env).
// Vercel automatically sends  Authorization: Bearer <CRON_SECRET>
app.post('/api/v1/cron/trigger-bells', async (req, res) => {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const { triggerBells } = require('./services/scheduler/scheduler.service');
    const count = await triggerBells();
    res.json({ success: true, triggered: count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 404 & Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
