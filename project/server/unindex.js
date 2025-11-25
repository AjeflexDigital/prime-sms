// // import express from 'express';
// // import cors from 'cors';
// // import helmet from 'helmet';
// // import rateLimit from 'express-rate-limit';
// // import dotenv from 'dotenv';
// // import { fileURLToPath } from 'url';
// // import { dirname, join } from 'path';

// // // Route imports
// // import authRoutes from './routes/auth.js';
// // import userRoutes from './routes/user.js';
// // import adminRoutes from './routes/admin.js';
// // import smsRoutes from './routes/sms.js';
// // // import paymentRoutes from './routes/payment.js';
// // // import resellerRoutes from './routes/reseller.js';

// // // Middleware imports
// // import authMiddleware from './middleware/auth.js';
// // import errorHandler from './middleware/errorHandler.js';

// // dotenv.config();

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = dirname(__filename);

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // // Security middleware
// // app.use(helmet());
// // app.use(cors({
// //   origin: process.env.CLIENT_URL || 'http://localhost:5173',
// //   credentials: true
// // }));

// // // Rate limiting
// // // const limiter = rateLimit({
// // //   windowMs: 15 * 60 * 1000, // 15 minutes
// // //   max: 200, // limit each IP to 100 requests per windowMs
// // //   message: 'Too many requests from this IP, please try again later.'
// // // });
// // // app.use(limiter);

// // // // Stricter rate limiting for authentication routes
// // // const authLimiter = rateLimit({
// // //   windowMs: 15 * 60 * 1000,
// // //   max: 100,
// // //   message: 'Too many authentication attempts, please try again later.'
// // // });

// // // Body parsing middleware
// // app.use(express.json({ limit: '10mb' }));
// // app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // // Static files
// // app.use('/uploads', express.static(join(__dirname, 'uploads')));

// // // Routes
// // // app.use('/api/auth', authLimiter, authRoutes);
// // app.use('/api/auth',  authRoutes); // remember to remove this line when ready
// // app.use('/api/user', authMiddleware, userRoutes);
// // app.use('/api/admin', authMiddleware, adminRoutes);
// // app.use('/api/sms', authMiddleware, smsRoutes);
// // // app.use('/api/payment', authMiddleware, paymentRoutes);
// // // app.use('/api/reseller', authMiddleware, resellerRoutes);

// // // Health check endpoint
// // app.get('/api/health', (req, res) => {
// //   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// // });

// // // Error handling middleware
// // app.use(errorHandler);

// // // Start server
// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on port ${PORT}`);
// //   console.log(`📱 SMS Platform API is ready`);
// // });

// // export default app;

// // import express from 'express';
// // import cors from 'cors';
// // import helmet from 'helmet';
// // import rateLimit from 'express-rate-limit';
// // import dotenv from 'dotenv';
// // import { fileURLToPath } from 'url';
// // import { dirname, join } from 'path';

// // // Route imports
// // import authRoutes from './routes/auth.js';
// // import userRoutes from './routes/user.js';
// // import adminRoutes from './routes/admin.js';
// // import smsRoutes from './routes/sms.js';
// // import paymentRoutes from './routes/payment.js';
// // import resellerRoutes from './routes/reseller.js';

// // // Middleware imports
// // import authMiddleware from './middleware/auth.js';
// // import errorHandler from './middleware/errorHandler.js';

// // dotenv.config();

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = dirname(__filename);

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // // Security middleware
// // // app.use(helmet());
// // // app.use(cors({
// // //   origin: process.env.CLIENT_URL || 'https://www.primesms.com.ng',
// // //   credentials: true
// // // }));

// // app.use(helmet());
// // app.use(cors({
// //   origin: true,
// //   credentials: true
// // }));

// // // Rate limiting
// // // const limiter = rateLimit({
// // //   windowMs: 15 * 60 * 1000, // 15 minutes
// // //   max: 100, // limit each IP to 100 requests per windowMs
// // //   message: 'Too many requests from this IP, please try again later.'
// // // });
// // // app.use(limiter);

// // // // Stricter rate limiting for authentication routes
// // // const authLimiter = rateLimit({
// // //   windowMs: 15 * 60 * 1000,
// // //   max: 5,
// // //   message: 'Too many authentication attempts, please try again later.'
// // // });

// // // Body parsing middleware
// // app.use(express.json({ limit: '10mb' }));
// // app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // // Static files
// // app.use('/uploads', express.static(join(__dirname, 'uploads')));

// // // Routes
// // app.use('/api/auth', authRoutes);
// // app.use('/api/user', authMiddleware, userRoutes);
// // app.use('/api/admin', authMiddleware, adminRoutes);
// // app.use('/api/sms', authMiddleware, smsRoutes);
// // app.use('/api/payment', authMiddleware, paymentRoutes);
// // app.use('/api/reseller', authMiddleware, resellerRoutes);

// // // Health check endpoint
// // app.get('/api/health', (req, res) => {
// //   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// // });

// // // Error handling middleware
// // app.use(errorHandler);

// // // Start server
// // app.listen(PORT, () => {
// //   console.log(` Server running on port ${PORT}`);
// //   console.log(` SMS Platform API is ready`);
// // });

// // export default app;

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
// import paymentRoutes from './routes/payment.js';
// import resellerRoutes from './routes/reseller.js';

// // Middleware imports
// import authMiddleware from './middleware/auth.js';
// import errorHandler from './middleware/errorHandler.js';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Define allowed origins explicitly (add more as needed, e.g., staging domains)
// const allowedOrigins = [
//   'http://localhost:5173',                           // Your Vite dev server
//   'https://www.primesms.com.ng',                     // Prod frontend
//   'https://primesms.com.ng'                          // Non-www variant if used
// ];

// // Custom CORS middleware for precise control
// const corsOptions = {
//   origin: (origin, callback) => {
//     // Allow non-browser requests (e.g., Postman, mobile apps) without origin
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.warn(`CORS blocked: Origin ${origin} not in allowlist`); // Log for debugging
//       callback(new Error(`Origin ${origin} not allowed by CORS`));
//     }
//   },
//   credentials: true,  // For cookies/sessions
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   exposedHeaders: ['Set-Cookie']  // If exposing custom headers
// };

// // Security middleware
// // app.use(helmet());
// // app.use(cors(corsOptions));  // Apply the custom options

// // // Explicit OPTIONS handler for preflights (backup if cors misses it)
// // app.options('*', cors(corsOptions));

// // // Rate limiting (uncomment and tweak as needed)
// // const limiter = rateLimit({
// //   windowMs: 15 * 60 * 1000, // 15 minutes
// //   max: 100, // limit each IP to 100 requests per windowMs
// //   message: 'Too many requests from this IP, please try again later.',
// //   standardHeaders: true,
// //   legacyHeaders: false
// // });
// // app.use(limiter);

// // Stricter for auth (apply to /api/auth if desired)
// // const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many auth attempts.' });
// // app.use('/api/auth', authLimiter);

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Static files
// app.use('/uploads', express.static(join(__dirname, 'uploads')));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/user', authMiddleware, userRoutes);
// app.use('/api/admin', authMiddleware, adminRoutes);
// app.use('/api/sms', authMiddleware, smsRoutes);
// app.use('/api/payment', authMiddleware, paymentRoutes);
// app.use('/api/reseller', authMiddleware, resellerRoutes);

// // Health check endpoint (add CORS headers manually if testing)
// app.get('/api/health', cors(corsOptions), (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // Error handling middleware (ensure it doesn't strip CORS headers)
// app.use(errorHandler);

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`SMS Platform API is ready`);
// });

// export default app;