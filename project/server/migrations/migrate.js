import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Database migration runner
 * Executes SQL migration files in order
 */
async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Read migration files
    const migrationFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      console.log('ℹ️  No migration files found');
      return;
    }

    // Execute each migration file
    for (const file of migrationFiles) {
      console.log(`📄 Running migration: ${file}`);
      
      const filePath = path.join(__dirname, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Split SQL file by statements (handle multiple queries)
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));
      
      for (const statement of statements) {
        if (statement) {
          await pool.query(statement);
        }
      }
      
      console.log(`✅ Migration completed: ${file}`);
    }
    
    console.log('🎉 All migrations completed successfully!');
    
    // Test the connection with a simple query
    const result = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Users in database: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export default runMigrations;