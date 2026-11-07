import 'dotenv/config';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import { pool } from '../db.js';
import { storage, storageConfig } from '../storage.js';
import { optimizeImage } from '../imageOptimization.js';
import { createPublicUrl } from './uploadFileToS3.js';

const apply = process.argv.includes('--apply');
const mappings = new Map<string, string>();
const report: object[] = [];
const backup = join(tmpdir(), `kutbi-bucket-optimization-${Date.now()}`);
await mkdir(backup, { recursive: true });
try {
  // Snapshot rows before any remote write. Originals in R2 are never deleted.
  const posts = await pool.query('SELECT id, image_url, gallery_images FROM blog_posts');
  const catalog = await pool.query('SELECT kind, id, content FROM site_catalog');
  await writeFile(join(backup, 'database-before.json'), JSON.stringify({ posts: posts.rows, catalog: catalog.rows }, null, 2));
  let continuation: string | undefined;
  do {
    const page = await storage.send(new ListObjectsV2Command({ Bucket: storageConfig.bucket, Prefix: `${storageConfig.prefix}/`, ContinuationToken: continuation }));
    for (const object of page.Contents ?? []) {
      const key = object.Key!;
      if (!/\.(png|jpe?g|avif)$/i.test(key)) continue;
      const source = await storage.send(new GetObjectCommand({ Bucket: storageConfig.bucket, Key: key }));
      const original = Buffer.from(await source.Body!.transformToByteArray());
      let webp: Buffer;
      try { webp = await optimizeImage(original); }
      catch {
        report.push({ key, before: original.length, after: original.length, skipped: 'Empty, invalid or unsupported image' });
        continue;
      }
      if (webp.length >= original.length) {
        report.push({ key, before: original.length, after: original.length, skipped: 'No size saving' });
        continue;
      }
      const hash = createHash('sha256').update(original).digest('hex').slice(0, 20);
      const newKey = `${storageConfig.prefix}/optimized-v1-${hash}.webp`;
      if (apply) {
        await storage.send(new PutObjectCommand({ Bucket: storageConfig.bucket, Key: newKey, Body: webp, ContentType: 'image/webp', CacheControl: 'public, max-age=31536000, immutable' }));
        const check = await storage.send(new GetObjectCommand({ Bucket: storageConfig.bucket, Key: newKey }));
        const bytes = Buffer.from(await check.Body!.transformToByteArray());
        if (check.ContentType !== 'image/webp' || !bytes.equals(webp)) throw new Error('Uploaded object verification failed');
        const publicCheck = await fetch(createPublicUrl(newKey), { signal: AbortSignal.timeout(30_000) });
        if (!publicCheck.ok || !publicCheck.headers.get('content-type')?.startsWith('image/webp')) {
          await publicCheck.body?.cancel();
          throw new Error(`Public image delivery verification failed (HTTP ${publicCheck.status}); database untouched.`);
        }
        const publicBytes = Buffer.from(await publicCheck.arrayBuffer());
        if (!publicBytes.equals(webp)) throw new Error('Public image bytes do not match; database untouched.');
      }
      mappings.set(createPublicUrl(key), createPublicUrl(newKey));
      report.push({ key, newKey, before: original.length, after: webp.length });
      console.log(`Optimized image ${report.length}: ${original.length} -> ${webp.length} bytes`);
    }
    continuation = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (continuation);

  function replace(value: unknown): unknown {
    if (typeof value === 'string') return mappings.get(value) ?? value;
    if (Array.isArray(value)) return value.map(replace);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replace(item)]));
    return value;
  }
  let updated = 0;
  if (apply) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const post of posts.rows) {
        const image = replace(post.image_url);
        const gallery = replace(post.gallery_images);
        if (image === post.image_url && JSON.stringify(gallery) === JSON.stringify(post.gallery_images)) continue;
        const result = await client.query('UPDATE blog_posts SET image_url=$1,gallery_images=$2::jsonb,updated_at=NOW() WHERE id=$3 AND image_url=$4 AND gallery_images=$5::jsonb', [image, JSON.stringify(gallery), post.id, post.image_url, JSON.stringify(post.gallery_images)]);
        if (result.rowCount !== 1) throw new Error('Journal changed during optimization; database update cancelled. Run again.');
        updated++;
      }
      for (const item of catalog.rows) {
        const content = replace(item.content);
        if (JSON.stringify(content) === JSON.stringify(item.content)) continue;
        const result = await client.query('UPDATE site_catalog SET content=$1::jsonb,updated_at=NOW() WHERE kind=$2 AND id=$3 AND content=$4::jsonb', [JSON.stringify(content), item.kind, item.id, JSON.stringify(item.content)]);
        if (result.rowCount !== 1) throw new Error('Catalog changed during optimization; database update cancelled. Run again.');
        updated++;
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }
  await writeFile(join(backup, 'report.json'), JSON.stringify({ apply, updated, mappings: Object.fromEntries(mappings), objects: report }, null, 2));
  console.log(JSON.stringify({ apply, converted: mappings.size, updatedRows: updated, backup }));
} finally {
  await pool.end();
  storage.destroy();
}
