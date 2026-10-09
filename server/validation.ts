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
  gallery_images: z.array(
    z.string().trim().min(1).max(2_000).refine(
      (value) => value.startsWith('/') || /^https:\/\//i.test(value),
      'Gallery images must use local paths or HTTPS URLs.',
    ),
  ).max(10).default([]),
  status: z.enum(['draft', 'published']),
  published_at: z.string().datetime({ offset: true }).nullable().optional(),
});


const imageUrl = z.string().trim().min(1).max(2_000).refine(
  (value) => value.startsWith('/') || /^https:\/\//i.test(value),
  'Image must be a local path or HTTPS URL.',
);

const packageDataSchema = z.object({
  image_url: imageUrl,
  name_ar: z.string().trim().min(2).max(150), name_en: z.string().trim().min(2).max(150),
  label_ar: z.string().trim().min(2).max(220), label_en: z.string().trim().min(2).max(220),
  price: z.string().trim().min(1).max(30),
  price_prefix_ar: z.string().trim().min(1).max(80), price_prefix_en: z.string().trim().min(1).max(80),
  price_label_ar: z.string().trim().min(1).max(120), price_label_en: z.string().trim().min(1).max(120),
  description_ar: z.string().trim().min(2).max(600), description_en: z.string().trim().min(2).max(600),
  features_ar: z.array(z.string().trim().min(1).max(300)).min(1).max(10),
  features_en: z.array(z.string().trim().min(1).max(300)).min(1).max(10),
  cta_ar: z.string().trim().min(1).max(100), cta_en: z.string().trim().min(1).max(100),
  featured: z.boolean().default(false),
});
const offerDataSchema = z.object({
  image_url: imageUrl,
  title_ar: z.string().trim().min(2).max(180), title_en: z.string().trim().min(2).max(180),
  text_ar: z.string().trim().min(2).max(800), text_en: z.string().trim().min(2).max(800),
});
export const siteContentItemSchema = z.discriminatedUnion('section', [
  z.object({ section:z.literal('packages'), key:z.string().regex(/^[a-z0-9-]+$/), sort_order:z.number().int().min(0).max(1000), status:z.enum(['draft','published']), data:packageDataSchema }),
  z.object({ section:z.literal('offers'), key:z.string().regex(/^[a-z0-9-]+$/), sort_order:z.number().int().min(0).max(1000), status:z.enum(['draft','published']), data:offerDataSchema }),
]);