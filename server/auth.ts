import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import { pool } from './db.js';

export type AdminUser = { id: number; username: string };

declare global {
  namespace Express {
    interface User extends AdminUser {}
  }
}

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const result = await pool.query<{ id: string; username: string; password_hash: string }>(
      `SELECT id, username, password_hash
       FROM admins
       WHERE username = $1 AND active = TRUE
       LIMIT 1`,
      [username.trim().toLowerCase()],
    );
    const admin = result.rows[0];
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      done(null, false, { message: 'Invalid username or password.' });
      return;
    }
    done(null, { id: Number(admin.id), username: admin.username });
  } catch (error) {
    done(error);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id: number, done) => {
  try {
    const result = await pool.query<{ id: string; username: string }>(
      'SELECT id, username FROM admins WHERE id = $1 AND active = TRUE LIMIT 1',
      [id],
    );
    const admin = result.rows[0];
    done(null, admin ? { id: Number(admin.id), username: admin.username } : false);
  } catch (error) {
    done(error);
  }
});

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  if (request.isAuthenticated()) {
    next();
    return;
  }
  response.status(401).json({ error: 'Authentication required.' });
}

export default passport;

