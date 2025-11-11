// server/index.vercel.js - Wrapper for Vercel serverless
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Route imports (same folder)
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import smsRoutes from "./routes/sms.js";
import paymentRoutes from "./routes/payment.js";
import resellerRoutes from "./routes/reseller.js";

// Middleware imports
import authMiddleware from "./middleware/auth.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Allowed origins (local + prod)
const allowedOrigins = [
  "http://localhost:5173", // Vite dev
  "http://localhost:3000", // Alternative dev port
  "https://www.primesms.com.ng",
  "https://primesms.com.ng",
  "https://prime-sms-dd88.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked: ${origin}`);
      callback(null, true); // Still process it to avoid hard failures
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  exposedHeaders: ["Set-Cookie", "X-Total-Count"],
  maxAge: 86400,
};

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(cors(corsOptions));

// Explicit preflight handler
app.options("*", cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => req.method === "OPTIONS",
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skip: (req) => req.method === "OPTIONS",
});
app.use("/api/auth", authLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(join(__dirname, "uploads")));

// Routes (with /api prefix for consistency)
app.use("/api/auth", authRoutes);
app.use("/api/user", authMiddleware, userRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);
app.use("/api/sms", authMiddleware, smsRoutes);
app.use("/api/payment", authMiddleware, paymentRoutes);
app.use("/api/reseller", authMiddleware, resellerRoutes);

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

// Vercel handler - export default function for Vercel
export default function handler(req, res) {
  console.log("🟢 Vercel API invoked:", req.method, req.url);
  return app(req, res);
}
