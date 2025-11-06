// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import dotenv from 'dotenv';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

// // Route imports
// import authRoutes from './routes/auth.js';
// import userRoutes from './routes/user.js';
// import adminRoutes from './routes/admin.js'; 
// import smsRoutes from './routes/sms.js';
// // import paymentRoutes from './routes/payment.js';
// // import resellerRoutes from './routes/reseller.js';

// // Middleware imports
// import authMiddleware from './middleware/auth.js';
// import errorHandler from './middleware/errorHandler.js';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Security middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:5173',
//   credentials: true
// }));

// // Rate limiting
// // const limiter = rateLimit({
// //   windowMs: 15 * 60 * 1000, // 15 minutes
// //   max: 200, // limit each IP to 100 requests per windowMs
// //   message: 'Too many requests from this IP, please try again later.'
// // });
// // app.use(limiter);

// // // Stricter rate limiting for authentication routes
// // const authLimiter = rateLimit({
// //   windowMs: 15 * 60 * 1000,
// //   max: 100,
// //   message: 'Too many authentication attempts, please try again later.'
// // });

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Static files
// app.use('/uploads', express.static(join(__dirname, 'uploads')));

// // Routes
// // app.use('/api/auth', authLimiter, authRoutes);
// app.use('/api/auth',  authRoutes); // remember to remove this line when ready 
// app.use('/api/user', authMiddleware, userRoutes);
// app.use('/api/admin', authMiddleware, adminRoutes);
// app.use('/api/sms', authMiddleware, smsRoutes);
// // app.use('/api/payment', authMiddleware, paymentRoutes);
// // app.use('/api/reseller', authMiddleware, resellerRoutes);

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // Error handling middleware
// app.use(errorHandler);

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📱 SMS Platform API is ready`);
// });

// export default app;





import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';
import smsRoutes from './routes/sms.js';
import paymentRoutes from './routes/payment.js';
import resellerRoutes from './routes/reseller.js';

// Middleware imports
import authMiddleware from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://www.primesms.com.ng',
  credentials: true
}));

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use(limiter);

// // Stricter rate limiting for authentication routes
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: 'Too many authentication attempts, please try again later.'
// });

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/sms', authMiddleware, smsRoutes);
app.use('/api/payment', authMiddleware, paymentRoutes);
app.use('/api/reseller', authMiddleware, resellerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` SMS Platform API is ready`);
});

export default app;