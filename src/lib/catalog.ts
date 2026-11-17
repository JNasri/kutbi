import { apiRequest } from './api';
import type { PublicCatalog } from '../../shared/catalog';

let cached: { value: PublicCatalog; at: number } | undefined;
let pending: Promise<PublicCatalog> | undefined;
export function getPublicCatalog(): Promise<PublicCatalog> {
  if (cached && Date.now() - cached.at < 30_000) return Promise.resolve(cached.value);
  pending ??= apiRequest<PublicCatalog>('/api/catalog').then((value) => {
    cached = { value, at: Date.now() };
    return value;
  }).finally(() => { pending = undefined; });
  return pending;
}
