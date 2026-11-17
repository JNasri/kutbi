import { content } from '../siteContent';
import { getPublishedPosts } from './blogs';
import { getPublicCatalog } from './catalog';
import { preloadImage } from './images';
import { preloadRoute } from './preloadRoute';

/** Speculative work only: never delays navigation, and stops queuing after leaving home. */
export function warmSite() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (connection?.saveData || /^(slow-)?2g$/.test(connection?.effectiveType ?? '')) return () => {};
  let stopped = false;
  let running = 0;
  const jobs: (() => Promise<unknown>)[] = [];
  const seen = new Set<string>();
  function pump() {
    while (!stopped && running < 2 && jobs.length) {
      const job = jobs.shift()!;
      running++;
      void job().catch(() => undefined).finally(() => { running--; pump(); });
    }
  }
  function enqueue(value: unknown) {
    if (stopped) return;
    if (typeof value === 'string' && /^(\/images\/|https?:\/\/)/.test(value) && !seen.has(value)) {
      seen.add(value);
      jobs.push(() => preloadImage(value));
    } else if (Array.isArray(value)) value.forEach(enqueue);
    else if (value && typeof value === 'object') Object.values(value).forEach(enqueue);
  }
  function start() {
    if (stopped) return;
    // Only public image fields; never follow contact/booking/external links.
    const copy = content.en;
    enqueue(copy.services.cards.map((card) => card.image));
    enqueue(copy.services.cards.map((card) => card.image.replace('.jpeg', '-dark.jpeg')));
    enqueue(copy.transport.cards.map((card) => card.images));
    enqueue('/images/saudi-atlas.jpg');
    pump();
    void getPublicCatalog().then((catalog) => {
      enqueue([...catalog.packages, ...catalog.offers].map((item) => item.image_url));
      pump();
    }).catch(() => undefined);
    void getPublishedPosts().then((posts) => { enqueue(posts.map((post) => post.image_url)); pump(); }).catch(() => undefined);
    ['/services', '/trips', '/journal', '/contact'].forEach(preloadRoute);
  }
  // Defer speculative work until after the hero has had time to paint.
  const timer = window.setTimeout(() => {
    if ('requestIdleCallback' in window) idle = window.requestIdleCallback(start, { timeout: 2000 });
    else start();
  }, 300);
  let idle: number | undefined;
  return () => {
    stopped = true;
    jobs.length = 0;
    clearTimeout(timer);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    // At most two already-started requests finish into the shared browser cache.
  };
}
