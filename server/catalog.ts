import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import type { Pool, QueryResultRow } from 'pg';
import { z } from 'zod';
import { requireAdmin } from './auth.js';
import type { CatalogKind } from '../shared/catalog.js';

const imageUrl = z.string().trim().min(1).max(2000).refine((value) => (value.startsWith('/') && !value.startsWith('//')) || /^https:\/\//i.test(value), 'Choose a local image or an HTTPS image.');
const base = { image_url: imageUrl, status: z.enum(['draft', 'published']), sort_order: z.number().int().min(0).max(9999) };
const text = (max: number, min = 0) => z.string().trim().min(min).max(max);
const packageTranslation = z.object({
  name: text(220, 2), label: text(300), price: text(40, 1), pricePrefix: text(80), priceLabel: text(120, 1),
  description: text(3000, 2), features: z.array(text(600, 1)).max(30), cta: text(120, 1),
  details: z.array(z.object({ label: text(160, 1), value: text(1500, 1) })).max(30),
});
const offerTranslation = z.object({ title: text(220, 2), text: text(3000, 2) });
export const packageSchema = z.object({ ...base, featured: z.boolean(), translations: z.object({ en: packageTranslation, ar: packageTranslation }) });
export const offerSchema = z.object({ ...base, image_layout: z.enum(['atlas', 'cover']), image_x: z.number().min(0).max(100), image_y: z.number().min(0).max(100), translations: z.object({ en: offerTranslation, ar: offerTranslation }) });
const kindSchema = z.enum(['packages', 'offers']);
const idSchema = z.string().min(2).max(80).regex(/^[a-z0-9-]+$/);

type CatalogRow = QueryResultRow & { id: string; content: object; status: 'draft' | 'published'; sort_order: number; created_at: string; updated_at: string };
const toItem = (row: CatalogRow) => ({ ...row.content, id: row.id, status: row.status, sort_order: row.sort_order, created_at: row.created_at, updated_at: row.updated_at });

export function createCatalogRouter(pool: Pool) {
  const router = Router();
  router.get('/catalog', async (_request, response, next) => {
    try {
      const result = await pool.query<CatalogRow & { kind: CatalogKind }>("SELECT * FROM site_catalog WHERE status='published' ORDER BY sort_order, created_at, id");
      response.setHeader('Cache-Control', 'no-store');
      response.json({ packages: result.rows.filter((row) => row.kind === 'packages').map(toItem), offers: result.rows.filter((row) => row.kind === 'offers').map(toItem) });
    } catch (error) { next(error); }
  });

  router.get('/admin/catalog/:kind', requireAdmin, async (request, response, next) => {
    try {
      const kind = kindSchema.parse(request.params.kind);
      const result = await pool.query<CatalogRow>('SELECT * FROM site_catalog WHERE kind=$1 ORDER BY sort_order, created_at, id', [kind]);
      response.setHeader('Cache-Control', 'no-store');
      response.json({ items: result.rows.map(toItem) });
    } catch (error) { next(error); }
  });

  const save: import('express').RequestHandler = async (request, response, next) => {
    const client = await pool.connect().catch((error) => { next(error); return null; });
    if (!client) return;
    let transactionStarted = false;
    try {
      const kind = kindSchema.parse(request.params.kind);
      const updating = request.method === 'PUT';
      const id = updating ? idSchema.parse(request.params.id) : randomUUID();
      const parsed = kind === 'packages' ? packageSchema.parse(request.body) : offerSchema.parse(request.body);
      const { status, sort_order, ...data } = parsed;
      await client.query('BEGIN');
      transactionStarted = true;
      // Serialize publication changes so concurrent requests cannot create a fourth card.
      if (kind === 'offers') await client.query('SELECT pg_advisory_xact_lock(47203198)');
      if (updating) {
        const existing = await client.query('SELECT id FROM site_catalog WHERE kind=$1 AND id=$2 FOR UPDATE', [kind, id]);
        if (!existing.rowCount) { await client.query('ROLLBACK'); response.status(404).json({ error: 'Content not found.' }); return; }
      }
      if (kind === 'offers' && status === 'published') {
        const count = await client.query<{ total: number }>("SELECT COUNT(*)::int AS total FROM site_catalog WHERE kind='offers' AND status='published' AND id<>$1", [id]);
        if (count.rows[0].total >= 3) {
          await client.query('ROLLBACK');
          response.status(409).json({ error: 'Only three seasonal offers can be published. Save this as a draft or unpublish another offer first.' });
          return;
        }
      }
      const result = updating
        ? await client.query<CatalogRow>('UPDATE site_catalog SET content=$3::jsonb,status=$4,sort_order=$5,updated_at=NOW() WHERE kind=$1 AND id=$2 RETURNING *', [kind, id, JSON.stringify(data), status, sort_order])
        : await client.query<CatalogRow>('INSERT INTO site_catalog (kind,id,content,status,sort_order) VALUES ($1,$2,$3::jsonb,$4,$5) RETURNING *', [kind, id, JSON.stringify(data), status, sort_order]);
      await client.query('COMMIT');
      response.status(updating ? 200 : 201).json({ item: toItem(result.rows[0]) });
    } catch (error) { if (transactionStarted) await client.query('ROLLBACK'); next(error); }
    finally { client.release(); }
  };
  router.post('/admin/catalog/:kind', requireAdmin, save);
  router.put('/admin/catalog/:kind/:id', requireAdmin, save);
  router.delete('/admin/catalog/:kind/:id', requireAdmin, async (request, response, next) => {
    try {
      const kind = kindSchema.parse(request.params.kind);
      const id = idSchema.parse(request.params.id);
      const result = await pool.query('DELETE FROM site_catalog WHERE kind=$1 AND id=$2', [kind, id]);
      if (!result.rowCount) { response.status(404).json({ error: 'Content not found.' }); return; }
      // Keep stored images: other content can reference the same artwork.
      response.status(204).end();
    } catch (error) { next(error); }
  });
  return router;
}
