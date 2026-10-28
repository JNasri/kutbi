import type { Pool } from 'pg';
import { defaultOffers, defaultPackages } from './catalogDefaults.js';

export async function initializeCatalog(pool: Pool) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_catalog (
        kind VARCHAR(20) NOT NULL CHECK (kind IN ('packages','offers')),
        id VARCHAR(80) NOT NULL, content JSONB NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('draft','published')),
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (kind, id)
      );
      CREATE INDEX IF NOT EXISTS site_catalog_public_idx ON site_catalog (kind, status, sort_order);
      CREATE TABLE IF NOT EXISTS site_content_bootstrap (name VARCHAR(80) PRIMARY KEY);
    `);
    const seed = await client.query("INSERT INTO site_content_bootstrap (name) VALUES ('catalog-v1') ON CONFLICT DO NOTHING RETURNING name");
    if (seed.rowCount) {
      for (const [kind, items] of [['packages', defaultPackages], ['offers', defaultOffers]] as const) {
        for (const item of items) {
          const { id, status, sort_order, ...data } = item;
          await client.query('INSERT INTO site_catalog (kind,id,content,status,sort_order) VALUES ($1,$2,$3::jsonb,$4,$5) ON CONFLICT DO NOTHING', [kind, id, JSON.stringify(data), status, sort_order]);
        }
      }
    }
    await client.query('COMMIT');
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}

