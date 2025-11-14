import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Route imports
import authRoutes from '../server/routes/auth.js';
import userRoutes from '../server/routes/user.js';
import adminRoutes from '../server/routes/admin.js';
import smsRoutes from '../server/routes/sms.js';
import paymentRoutes from '../server/routes/payment.js';
import resellerRoutes from '../server/routes/reseller.js';

// Middleware imports
import authMiddleware from '../server/middleware/auth.js';
import errorHandler from '../server/middleware/errorHandler.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://www.primesms.com.ng',
  'https://primesms.com.ng',
  'https://prime-sms-dd88.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: Origin ${origin} not in allowlist`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
};

// Apply CORS first
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting (reduced for serverless)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.VERCEL_ENV === 'production' 
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Increased from 5 for better UX
  message: 'Too many auth attempts.'
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ❌ REMOVED: Static files (not supported in serverless)
// app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/sms', authMiddleware, smsRoutes);
app.use('/api/payment', authMiddleware, paymentRoutes);
app.use('/api/reseller', authMiddleware, resellerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

export default app;