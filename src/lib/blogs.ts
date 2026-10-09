import { apiRequest } from './api';
import type { BlogSummary } from '../types/blog';

const cacheLifetime = 30_000;
let cachedPosts: BlogSummary[] | null = null;
let cachedAt = 0;
let pendingRequest: Promise<BlogSummary[]> | null = null;
let cachedHeroPosts: BlogSummary[] | null = null;
let cachedHeroAt = 0;
let pendingHeroRequest: Promise<BlogSummary[]> | null = null;
const heroCacheLifetime = 5_000;

export function getPublishedPosts(): Promise<BlogSummary[]> {
  if (cachedPosts && Date.now() - cachedAt < cacheLifetime) {
    return Promise.resolve(cachedPosts);
  }

  if (!pendingRequest) {
    pendingRequest = apiRequest<{ posts: BlogSummary[] }>('/api/blogs')
      .then(({ posts }) => {
        cachedPosts = posts;
        cachedAt = Date.now();
        return posts;
      })
      .finally(() => {
        pendingRequest = null;
      });
  }

  return pendingRequest;
}

export function getHeroPosts(): Promise<BlogSummary[]> {
  if (cachedHeroPosts && Date.now() - cachedHeroAt < heroCacheLifetime) {
    return Promise.resolve(cachedHeroPosts);
  }

  if (!pendingHeroRequest) {
    pendingHeroRequest = apiRequest<{ posts: BlogSummary[] }>('/api/blogs?limit=3&random=true', { cache: 'no-store' })
      .then(({ posts }) => {
        cachedHeroPosts = posts;
        cachedHeroAt = Date.now();
        return posts;
      })
      .finally(() => {
        pendingHeroRequest = null;
      });
  }

  return pendingHeroRequest;
}

export function clearBlogCaches() {
  cachedPosts = null;
  cachedAt = 0;
  cachedHeroPosts = null;
  cachedHeroAt = 0;
}

export function preloadPublishedPosts() {
  void getPublishedPosts().catch(() => undefined);
}

export function preloadHeroPosts() {
  void getHeroPosts().catch(() => undefined);
}

