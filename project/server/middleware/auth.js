import jwt from "jsonwebtoken";
import { query } from "../config/database.js";

/**
 * JWT Authentication Middleware
 * Verifies access tokens and adds user info to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      console.warn("❌ No Authorization header provided");
      return res
        .status(401)
        .json({ message: "No token provided, access denied" });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      console.warn("❌ Invalid token format");
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Verify token with fallback secrets
    const jwtSecret = process.env.JWT_SECRET || "-super-secret-jwt-key-here";
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
      console.log(
        "✅ JWT verified with primary secret for user:",
        decoded.userId
      );
    } catch (err) {
      console.error("❌ JWT verification failed:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    // Get user from database (allow 'active' and 'pending' - only block 'banned' and 'suspended')
    const userQuery = `
      SELECT u.*, p.full_name, p.phone, p.company, p.country
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1 AND u.status NOT IN ('banned', 'suspended')
    `;

    const result = await query(userQuery, [decoded.userId]);

    if (result.rows.length === 0) {
      console.warn(
        "❌ User not found or restricted for userId:",
        decoded.userId
      );
      return res.status(401).json({ message: "User not found or restricted" });
    }

    // Add user to request object
    req.user = result.rows[0];
    console.log("✅ Auth successful for user:", req.user.email);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error("❌ Token expired:", error.message);
      return res.status(401).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      console.error("❌ Invalid JWT:", error.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    console.error("❌ Auth middleware error:", error);
    res.status(500).json({ message: "Server error in authentication" });
  }
};

/**
 * Role-based authorization middleware
 * @param {Array} roles - Array of allowed roles
 */
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

/**
 * Admin only middleware
 */
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

/**
 * Reseller or Admin middleware
 */
export const resellerOrAdmin = (req, res, next) => {
  if (!req.user || !["admin", "reseller"].includes(req.user.role)) {
    return res.status(403).json({
      message: "Reseller or Admin access required",
    });
  }
  next();
};

export default authMiddleware;
