export type BlogStatus = 'draft' | 'published';

export type BlogPost = {
  id: number;
  slug: string;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  content_ar: string;
  content_en: string;
  image_url: string;
  status?: BlogStatus;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BlogInput = Omit<BlogPost, 'id' | 'published_at' | 'created_at' | 'updated_at'> & {
  status: BlogStatus;
};

