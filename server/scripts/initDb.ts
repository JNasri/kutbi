import 'dotenv/config';
import { initializeDatabase, pool } from '../db.js';

try {
  await initializeDatabase();
  console.log('Database schema and initial admin are ready.');
} finally {
  await pool.end();
}

