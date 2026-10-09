import pg from 'pg';
import bcrypt from 'bcryptjs';
import { defaultEditableContent } from './siteContentDefaults.js';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required.');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id BIGSERIAL PRIMARY KEY,
      username VARCHAR(80) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id BIGSERIAL PRIMARY KEY,
      slug VARCHAR(180) NOT NULL UNIQUE,
      title_ar VARCHAR(220) NOT NULL,
      title_en VARCHAR(220) NOT NULL,
      excerpt_ar VARCHAR(600) NOT NULL,
      excerpt_en VARCHAR(600) NOT NULL,
      content_ar TEXT NOT NULL DEFAULT '',
      content_en TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL,
      gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
      status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      author_id BIGINT REFERENCES admins(id) ON DELETE SET NULL,
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE blog_posts
      ADD COLUMN IF NOT EXISTS gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb;

    CREATE INDEX IF NOT EXISTS blog_posts_status_published_idx
      ON blog_posts (status, published_at DESC);
    CREATE TABLE IF NOT EXISTS site_content_items (
      id BIGSERIAL PRIMARY KEY,
      section VARCHAR(30) NOT NULL CHECK (section IN ('packages', 'offers')),
      content_key VARCHAR(100) NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      draft_data JSONB NOT NULL,
      published_data JSONB,
      updated_by BIGINT REFERENCES admins(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (section, content_key)
    );

    CREATE INDEX IF NOT EXISTS site_content_items_section_order_idx
      ON site_content_items (section, sort_order);
  `);

  for (const item of defaultEditableContent) {
    await pool.query(
      `INSERT INTO site_content_items
        (section, content_key, sort_order, status, draft_data, published_data)
       VALUES ($1,$2,$3,'published',$4::jsonb,$4::jsonb)
       ON CONFLICT (section, content_key) DO NOTHING`,
      [item.section, item.key, item.sort_order, JSON.stringify(item.data)],
    );
  }
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO admins (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO NOTHING`,
    [username.trim().toLowerCase(), passwordHash],
  );
}


