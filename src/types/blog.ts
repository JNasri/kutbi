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
  gallery_images: string[];
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BlogInput = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> & {
  status: BlogStatus;
  published_at?: string | null;
};


export type BlogSummary = Pick<
  BlogPost,
  | 'id'
  | 'slug'
  | 'title_ar'
  | 'title_en'
  | 'excerpt_ar'
  | 'excerpt_en'
  | 'image_url'
  | 'published_at'
  | 'created_at'
>;