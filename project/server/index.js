
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Route imports
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import smsRoutes from "./routes/sms.js";
import paymentRoutes from "./routes/payment.js";
import resellerRoutes from "./routes/reseller.js";

// Middleware imports
import authMiddleware from "./middleware/auth.js";
import errorHandler from "./middleware/errorHandler.js";

// webhook imports
import webhookHandler from '../api/webhook.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// When running behind a proxy (Vercel, Heroku, etc.) enable trust proxy so
// Express and middleware (rate-limit, req.ip) use the X-Forwarded-* headers.
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://www.primesms.com.ng",
  "https://primesms.com.ng",
  "https://prime-sms-dd88.vercel.app"
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
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-Paystack-Signature"],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many auth attempts.",
});
app.use("/api/auth", authLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files (comment out for Vercel)
// app.use("/uploads", express.static(join(__dirname, "uploads")));

// Routes - ALL payment routes protected with auth
// Webhook is handled separately in api/webhook.js
app.post(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  webhookHandler
);

app.use("/api/auth", authRoutes);
app.use("/api/user", authMiddleware, userRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);
app.use("/api/sms", authMiddleware, smsRoutes);
app.use("/api/payment", authMiddleware, paymentRoutes); // All payment routes need auth
app.use("/api/reseller", authMiddleware, resellerRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`SMS Platform API is ready`);
  });
}

export default app;