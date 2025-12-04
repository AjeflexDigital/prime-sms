#!/usr/bin/env node
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { query } from "../config/database.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Load .env from project root (../../.env)
dotenv.config({ path: join(__dirname, "../../.env") });

(async () => {
  try {
    console.log("Using DATABASE_URL:", !!process.env.DATABASE_URL);
    const res = await query("SELECT NOW() as now");
    console.log("DB connected. Server time:", res.rows[0].now);
    process.exit(0);
  } catch (err) {
    console.error("DB connection test failed:", err.message || err);
    process.exit(1);
  }
})();
