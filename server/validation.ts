import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(8).max(200),
});

export const blogSchema = z.object({
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title_ar: z.string().trim().min(2).max(220),
  title_en: z.string().trim().min(2).max(220),
  excerpt_ar: z.string().trim().min(2).max(600),
  excerpt_en: z.string().trim().min(2).max(600),
  content_ar: z.string().max(50_000).default(''),
  content_en: z.string().max(50_000).default(''),
  image_url: z.string().trim().min(1).max(2_000).refine(
    (value) => value.startsWith('/') || /^https:\/\//i.test(value),
    'Image must be a local path or HTTPS URL.',
  ),
  status: z.enum(['draft', 'published']),
});

