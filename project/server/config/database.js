// import pg from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const { Pool } = pg;

// // Database connection configuration
// const pool = new Pool({
//   user: process.env.DB_USER || 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   database: process.env.DB_NAME || 'sms_platform',
//   password: process.env.DB_PASSWORD || 'password',
//   port: process.env.DB_PORT || 5432,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
// });

// // Test database connection
// pool.on('connect', () => {
//   console.log('✅ Connected to PostgreSQL database');
// });

// pool.on('error', (err) => {
//   console.error('❌ Database connection error:', err);
//   process.exit(-1);
// });

// // Database query helper function
// export const query = async (text, params) => {
//   const start = Date.now();
//   try {
//     const res = await pool.query(text, params);
//     const duration = Date.now() - start;
//     console.log('📊 Query executed:', { text, duration, rows: res.rowCount });
//     return res;
//   } catch (error) {
//     console.error('❌ Database query error:', error);
//     throw error;
//   }
// };

// // Transaction helper function
// export const transaction = async (callback) => {
//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');
//     const result = await callback(client);
//     await client.query('COMMIT');
//     return result;
//   } catch (error) {
//     await client.query('ROLLBACK');
//     throw error;
//   } finally {
//     client.release();
//   }
// };

// export default pool;

// import pg from 'pg';
// import dotenv from 'dotenv';
// dotenv.config();

// const { Pool } = pg;

// // Prefer full connection string (DATABASE_URL)
// const connectionString = process.env.DATABASE_URL;

// if (!connectionString) {
//   console.error("❌ DATABASE_URL is not set. Please check your Render environment variables.");
//   process.exit(1);
// }

// const pool = new Pool({
//   connectionString,
//   ssl: { rejectUnauthorized: false }, // always use SSL in cloud environments
// });

// // Confirm connection
// pool.on('connect', () => {
//   console.log('✅ Connected to PostgreSQL database');
// });

// pool.on('error', (err) => {
//   console.error('❌ Database connection error:', err);
//   process.exit(-1);
// });

// // Query helper
// export const query = async (text, params) => {
//   const start = Date.now();
//   try {
//     const res = await pool.query(text, params);
//     console.log(`📊 Query executed (${Date.now() - start}ms):`, text.split('\n')[0]);
//     return res;
//   } catch (error) {
//     console.error('❌ Database query error:', error);
//     throw error;
//   }
// };

// // Transaction helper
// export const transaction = async (callback) => {
//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');
//     const result = await callback(client);
//     await client.query('COMMIT');
//     return result;
//   } catch (error) {
//     await client.query('ROLLBACK');
//     throw error;
//   } finally {
//     client.release();
//   }
// };

// export default pool;

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const isProd = process.env.NODE_ENV === "production";

// Build pool config depending on available env vars
let poolConfig;
if (connectionString) {
  poolConfig = {
    connectionString,
  };
  // Enable SSL in production when using a managed DB service
  if (isProd) poolConfig.ssl = { rejectUnauthorized: false };
} else {
  // Fallback to individual DB env vars (useful for local dev)
  poolConfig = {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "sms_platform",
    password: process.env.DB_PASSWORD || "password",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    ssl: isProd ? { rejectUnauthorized: false } : false,
  };

  // If running in production without a proper connection string, fail fast with helpful message
  if (
    isProd &&
    (poolConfig.host === "localhost" ||
      poolConfig.host === "127.0.0.1" ||
      poolConfig.host === "::1")
  ) {
    console.error("\n❌ Running in production but no DATABASE_URL provided.");
    console.error(
      "Please set the DATABASE_URL environment variable in your hosting platform (Render, Heroku, etc.)."
    );
    console.error(
      "Example (Render): DATABASE_URL=postgres://USER:PASS@HOST:PORT/DBNAME"
    );
    process.exit(1);
  }
}

const pool = new Pool(poolConfig);

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Database connection error:", err);
  // In many hosting environments the app should crash so the platform can restart it
  process.exit(-1);
});

export const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error("❌ Database query error:", error);
    throw error;
  }
};

// Transaction helper
export const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
