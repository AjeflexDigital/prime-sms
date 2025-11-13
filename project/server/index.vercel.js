// server/index.vercel.js - Vercel serverless wrapper with explicit CORS for OPTIONS
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Route imports (from /server/routes)
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';
import smsRoutes from './routes/sms.js';
import paymentRoutes from './routes/payment.js';
import resellerRoutes from './routes/reseller.js';

// Middleware imports (from /server/middleware)
import authMiddleware from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Allowed origins (local dev + prod)
const allowedOrigins = [
  'http://localhost:5173',  // Vite dev
  'https://www.primesms.com.ng',
  'https://primesms.com.ng'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
};

// Apply middleware
app.use(helmet());
app.use(cors(corsOptions));

// Explicit OPTIONS handler (catches preflights before routes)
app.options('*', (req, res) => {
  console.log('🟢 OPTIONS preflight handled:', req.url, 'Origin:', req.headers.origin);
  res.set('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' });
app.use(limiter);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many auth attempts' });
app.use('/api/auth', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/sms', authMiddleware, smsRoutes);
app.use('/api/payment', authMiddleware, paymentRoutes);
app.use('/api/reseller', authMiddleware, resellerRoutes);

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

// Vercel serverless handler
export default function handler(req, res) {
  console.log('🟢 Vercel API invoked:', req.method, req.url, 'Origin:', req.headers.origin);
  return app(req, res);
}