import { preloadPublishedPosts } from './blogs';

const pending = new Map<string, Promise<unknown>>();
export function preloadRoute(href: string) {
  const pathname = href.split(/[?#]/)[0];
  if (pending.has(pathname)) return;
  let work: Promise<unknown>;
  switch (pathname) {
    case '/': work = Promise.all([import('../components/Hero'), import('../components/AboutUs')]); break;
    case '/services': work = Promise.all([import('../components/Services'), import('../components/UmrahVisa'), import('../components/Transport')]); break;
    case '/trips': work = import('../pages/TripsPage'); break;
    case '/journal': preloadPublishedPosts(); work = import('../pages/JournalPage'); break;
    case '/contact': work = import('../components/TestimonialsContact'); break;
    default: return;
  }
  pending.set(pathname, work);
  void work.catch(() => pending.delete(pathname));
}
