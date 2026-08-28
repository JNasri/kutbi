import 'dotenv/config';
import path from 'node:path';
import { mkdir, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import express, { type NextFunction, type Request, type Response } from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import helmet from 'helmet';
import multer from 'multer';
import { rateLimit } from 'express-rate-limit';
import { ZodError } from 'zod';
import passport, { requireAdmin } from './auth.js';
import { initializeDatabase, pool } from './db.js';
import { blogSchema, loginSchema } from './validation.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);
const isProduction = process.env.NODE_ENV === 'production';
const PgSession = connectPgSimple(session);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '..');
const uploadRoot = path.resolve(process.env.UPLOAD_DIR ?? path.join(projectRoot, 'uploads', 'journals'));

await mkdir(uploadRoot, { recursive: true });

const imageExtensions = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/avif', '.avif'],
]);
const journalUpload = multer({
  storage: multer.diskStorage({
    destination: uploadRoot,
    filename: (_request, file, done) => done(null, `${Date.now()}-${randomUUID()}${imageExtensions.get(file.mimetype) ?? ''}`),
  }),
  limits: { fileSize: 12 * 1024 * 1024, files: 11 },
  fileFilter: (_request, file, done) => {
    if (!imageExtensions.has(file.mimetype)) {
      done(new Error('Only JPG, PNG, WebP, and AVIF images are supported.'));
      return;
    }
    done(null, true);
  },
});

const uploadUrl = (file: Express.Multer.File) => `/uploads/journals/${file.filename}`;
const localUploadPath = (url: string) => url.startsWith('/uploads/journals/')
  ? path.join(uploadRoot, path.basename(url))
  : null;

async function removeLocalUploads(urls: string[]) {
  await Promise.all(urls.map(async (url) => {
    const filePath = localUploadPath(url);
    if (!filePath) return;
    try {
      await unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  }));
}

app.set('trust proxy', 1);
app.use(helmet({
  xFrameOptions: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      frameAncestors: null,
    },
  },
}));
app.use('/uploads/journals', express.static(uploadRoot, {
  maxAge: isProduction ? '7d' : 0,
  immutable: false,
}));
app.use('/uploads/journals', (_request, response) => response.status(404).end());
app.use(express.json({ limit: '1mb' }));
app.use(session({
  store: new PgSession({ pool, tableName: 'user_sessions', createTableIfMissing: true }),
  name: 'alkutbi.admin',
  secret: process.env.SESSION_SECRET ?? '',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 8,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((request, response, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    next();
    return;
  }
  const origin = request.get('origin');
  const allowedOrigin = process.env.PUBLIC_ORIGIN;
  if (origin && allowedOrigin && origin !== allowedOrigin) {
    response.status(403).json({ error: 'Origin is not allowed.' });
    return;
  }
  next();
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

app.get('/api/health', async (_request, response, next) => {
  try {
    const result = await pool.query<{ now: string }>('SELECT NOW() AS now');
    response.json({ ok: true, databaseTime: result.rows[0].now });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', loginLimiter, (request, response, next) => {
  try {
    request.body = loginSchema.parse(request.body);
  } catch (error) {
    next(error);
    return;
  }

  passport.authenticate('local', (error: Error | null, user: Express.User | false, info?: { message?: string }) => {
    if (error) {
      next(error);
      return;
    }
    if (!user) {
      response.status(401).json({ error: info?.message ?? 'Invalid username or password.' });
      return;
    }
    request.session.regenerate((regenerateError) => {
      if (regenerateError) {
        next(regenerateError);
        return;
      }
      request.logIn(user, (loginError) => {
        if (loginError) {
          next(loginError);
          return;
        }
        response.json({ user });
      });
    });
  })(request, response, next);
});

app.post('/api/auth/logout', requireAdmin, (request, response, next) => {
  request.logout((error) => {
    if (error) {
      next(error);
      return;
    }
    request.session.destroy((destroyError) => {
      if (destroyError) {
        next(destroyError);
        return;
      }
      response.clearCookie('alkutbi.admin');
      response.status(204).end();
    });
  });
});

app.get('/api/auth/session', (request, response) => {
  response.json({ user: request.user ?? null });
});

app.post('/api/admin/uploads', requireAdmin, journalUpload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 },
]), (request, response) => {
  const files = request.files as { mainImage?: Express.Multer.File[]; galleryImages?: Express.Multer.File[] } | undefined;
  const mainImage = files?.mainImage?.[0];
  const galleryImages = files?.galleryImages ?? [];
  if (!mainImage && galleryImages.length === 0) {
    response.status(400).json({ error: 'Choose at least one image to upload.' });
    return;
  }
  response.status(201).json({
    mainImage: mainImage ? uploadUrl(mainImage) : null,
    galleryImages: galleryImages.map(uploadUrl),
  });
});

app.get('/api/blogs', async (_request, response, next) => {
  try {
    const result = await pool.query(
      `SELECT id, slug, title_ar, title_en, excerpt_ar, excerpt_en,
              content_ar, content_en, image_url, gallery_images, published_at, created_at
       FROM blog_posts
       WHERE status = 'published'
       ORDER BY published_at DESC NULLS LAST, created_at DESC
       LIMIT 100`,
    );
    response.json({ posts: result.rows });
  } catch (error) {
    next(error);
  }
});

app.get('/api/blogs/:slug', async (request, response, next) => {
  try {
    const result = await pool.query(
      `SELECT id, slug, title_ar, title_en, excerpt_ar, excerpt_en,
              content_ar, content_en, image_url, gallery_images, published_at, created_at
       FROM blog_posts
       WHERE slug = $1 AND status = 'published'
       LIMIT 1`,
      [request.params.slug],
    );
    if (!result.rows[0]) {
      response.status(404).json({ error: 'Journal entry not found.' });
      return;
    }
    response.json({ post: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/blogs', requireAdmin, async (_request, response, next) => {
  try {
    const result = await pool.query(
      `SELECT id, slug, title_ar, title_en, excerpt_ar, excerpt_en, content_ar,
              content_en, image_url, gallery_images, status, published_at, created_at, updated_at
       FROM blog_posts ORDER BY updated_at DESC`,
    );
    response.json({ posts: result.rows });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/blogs', requireAdmin, async (request, response, next) => {
  try {
    const post = blogSchema.parse(request.body);
    const result = await pool.query(
      `INSERT INTO blog_posts
        (slug, title_ar, title_en, excerpt_ar, excerpt_en, content_ar, content_en,
         image_url, gallery_images, status, author_id, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::varchar,$11,
         CASE WHEN $10::varchar = 'published' THEN NOW() ELSE NULL END)
       RETURNING *`,
      [post.slug, post.title_ar, post.title_en, post.excerpt_ar, post.excerpt_en,
        post.content_ar, post.content_en, post.image_url, JSON.stringify(post.gallery_images),
        post.status, request.user!.id],
    );
    response.status(201).json({ post: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/blogs/:id', requireAdmin, async (request, response, next) => {
  try {
    const post = blogSchema.parse(request.body);
    const existing = await pool.query<{ image_url: string; gallery_images: string[] }>(
      'SELECT image_url, gallery_images FROM blog_posts WHERE id=$1',
      [request.params.id],
    );
    if (!existing.rows[0]) {
      response.status(404).json({ error: 'Post not found.' });
      return;
    }
    const result = await pool.query(
      `UPDATE blog_posts SET
        slug=$1, title_ar=$2, title_en=$3, excerpt_ar=$4, excerpt_en=$5,
        content_ar=$6, content_en=$7, image_url=$8, gallery_images=$9::jsonb, status=$10::varchar,
        published_at=CASE
          WHEN $10::varchar = 'published' AND published_at IS NULL THEN NOW()
          WHEN $10::varchar = 'draft' THEN NULL ELSE published_at END,
        updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [post.slug, post.title_ar, post.title_en, post.excerpt_ar, post.excerpt_en,
        post.content_ar, post.content_en, post.image_url, JSON.stringify(post.gallery_images),
        post.status, request.params.id],
    );
    const retainedImages = new Set([post.image_url, ...post.gallery_images]);
    const previousImages = [existing.rows[0].image_url, ...(existing.rows[0].gallery_images ?? [])];
    await removeLocalUploads(previousImages.filter((url) => !retainedImages.has(url)));
    response.json({ post: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/admin/blogs/:id', requireAdmin, async (request, response, next) => {
  try {
    const result = await pool.query<{ id: number; image_url: string; gallery_images: string[] }>(
      'DELETE FROM blog_posts WHERE id=$1 RETURNING id, image_url, gallery_images',
      [request.params.id],
    );
    if (!result.rows[0]) {
      response.status(404).json({ error: 'Post not found.' });
      return;
    }
    await removeLocalUploads([result.rows[0].image_url, ...(result.rows[0].gallery_images ?? [])]);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});
if (isProduction) {
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.resolve(currentDirectory, '..', 'dist');
  app.use(express.static(distPath));
  app.get(/.*/, (_request, response) => response.sendFile(path.join(distPath, 'index.html')));
}

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    response.status(400).json({ error: error.code === 'LIMIT_FILE_SIZE' ? 'Each image must be 12 MB or smaller.' : error.message });
    return;
  }
  if (error instanceof Error && error.message === 'Only JPG, PNG, WebP, and AVIF images are supported.') {
    response.status(400).json({ error: error.message });
    return;
  }
  if (error instanceof ZodError) {
    response.status(400).json({ error: 'Please check the submitted fields.', fields: error.flatten().fieldErrors });
    return;
  }
  if (typeof error === 'object' && error && 'code' in error && error.code === '23505') {
    response.status(409).json({ error: 'That slug or username is already in use.' });
    return;
  }
  console.error(error);
  response.status(500).json({ error: 'An unexpected server error occurred.' });
});

await initializeDatabase();
app.listen(port, () => console.log(`Alkutbi API listening on http://localhost:${port}`));
