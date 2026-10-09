import { apiRequest } from './api';
import type { TravelContent } from '../types/siteContent';
let cached: TravelContent | null = null;
let pending: Promise<TravelContent> | null = null;
export function getTravelContent() {
  if (cached) return Promise.resolve(cached);
  pending ??= apiRequest<TravelContent>('/api/site/travel-content').then((value) => { cached = value; return value; }).finally(() => { pending = null; });
  return pending;
}
export function clearTravelContentCache() { cached = null; }
