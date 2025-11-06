import pg from "pg";
import dotenv from "dotenv";

// Load local .env when present. In CI/hosting use the platform env vars instead.
dotenv.config();

const { Pool } = pg;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL is not set. Set it and re-run this script.");
    process.exit(1);
  }

  console.log("Trying to connect using DATABASE_URL (value hidden) ...");

  // Use SSL by default for cloud DBs. If your provider requires stricter certificate checks
  // adjust `rejectUnauthorized` accordingly.
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const res = await pool.query("SELECT 1 AS result");
    console.log("✅ DB connection successful:", res.rows[0]);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ DB connection failed:", err.message || err);
    // Show full error only when running locally and DEBUG env is set
    if (process.env.DEBUG) console.error(err);
    await pool.end().catch(() => {});
    process.exit(2);
  }
}

main();

// NOTE: Do NOT commit secrets. This script reads DATABASE_URL from the environment.
