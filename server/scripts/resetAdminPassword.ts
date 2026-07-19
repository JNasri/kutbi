import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';

const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!username || !password || password.length < 12) {
  throw new Error('Set ADMIN_USERNAME and an ADMIN_PASSWORD of at least 12 characters in .env.');
}

try {
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `UPDATE admins SET password_hash=$1, updated_at=NOW()
     WHERE username=$2 RETURNING username`,
    [passwordHash, username],
  );
  if (!result.rows[0]) throw new Error(`Admin “${username}” was not found.`);
  console.log(`Password updated for ${username}.`);
} finally {
  await pool.end();
}

