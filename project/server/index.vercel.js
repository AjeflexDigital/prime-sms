// server/index.vercel.js - Self-contained Express for Vercel (no relative imports)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';  // Inline if used in auth
import jwt from 'jsonwebtoken';  // Inline if used
import { query } from '../config/database.js';  // Keep if DB is external; adjust path if needed

dotenv.config();

const app = express();

// Allowed origins (local + prod)
const allowedOrigins = [
  'http://localhost:5173',
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

// Middleware
app.use(helmet());
app.use(cors(corsOptions));

app.options('*', (req, res) => {
  console.log('🟢 OPTIONS preflight:', req.url, 'Origin:', req.headers.origin);
  res.set('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.use('/api/auth', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Inline Auth Routes Example (copy your auth.js logic here; expand for others)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;
    // DB query, bcrypt.hash, jwt.sign logic here (from auth.js)
    // e.g., const hashedPassword = await bcrypt.hash(password, 10);
    // const result = await query('INSERT INTO users ...', [fullName, email, phoneNumber, hashedPassword]);
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Your login logic here (query, bcrypt.compare, jwt.sign)
    res.json({ message: 'Login successful', token: 'jwt-token' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Inline Other Routes (user, admin, sms, payment, reseller—copy logic from their .js files)
app.get('/api/user/profile', (req, res) => {
  // Auth middleware inline or use req.headers.authorization
  res.json({ message: 'User profile' });
});

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Vercel handler
export default function handler(req, res) {
  console.log('🟢 API invoked:', req.method, req.url);
  return app(req, res);
}