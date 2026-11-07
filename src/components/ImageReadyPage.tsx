import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Language } from '../siteContent';
import LoadingScreen from './LoadingScreen';

const decodedImages = new Map<string, Promise<void>>();
function preloadImage(url: string) {
  const existing = decodedImages.get(url);
  if (existing) return existing;
  const promise = new Promise<void>((resolve, reject) => {
    const image = new Image();
    const timer = window.setTimeout(() => finish(new Error('Image timed out')), 30_000);
    function finish(error?: Error) {
      window.clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
      if (error) reject(error); else resolve();
    }
    image.onload = () => { image.decode().then(() => finish(), () => finish(new Error('Image could not be decoded'))); };
    image.onerror = () => finish(new Error('Image could not be loaded'));
    image.src = url;
  }).catch((error: unknown) => { decodedImages.delete(url); throw error; });
  decodedImages.set(url, promise);
  return promise;
}

/** Mount invisibly to discover CSS images; preload/decode lazy images before revealing. */
export default function ImageReadyPage({ children, language }: { children: ReactNode; language: Language }) {
  const root = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    const urls = new Set<string>();
    const elements = root.current ? [root.current, ...root.current.querySelectorAll<HTMLElement>('*')] : [];
    for (const element of elements) {
      if (element instanceof HTMLImageElement) {
        element.loading = 'eager';
        if (attempt > 0 && !element.naturalWidth) element.src = element.src;
        if (element.currentSrc || element.src) urls.add(element.currentSrc || element.src);
      }
      for (const match of getComputedStyle(element).backgroundImage.matchAll(/url\(["']?(.*?)["']?\)/g)) {
        if (match[1]) urls.add(match[1]);
      }
    }
    Promise.all([...urls].map(preloadImage)).then(() => {
      if (active) setState('ready');
    }).catch(() => { if (active) setState('failed'); });
    return () => { active = false; };
  }, [attempt]);

  useEffect(() => {
    if (state === 'ready' && window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: 'start' });
    }
  }, [state]);

  return <div className={`image-ready-page${state !== 'ready' ? ' is-pending' : ''}`} aria-busy={state === 'loading'}>
    {state === 'loading' ? <LoadingScreen label={language === 'ar' ? 'جارٍ التحميل…' : 'Loading…'} /> : null}
    {state === 'failed' ? <div className="image-ready-error" role="alert"><p>{language === 'ar' ? 'تعذّر تحميل بعض الصور. تحقق من اتصالك وحاول مجددًا.' : 'Some images could not load. Check your connection and try again.'}</p><button className="button button-gold" onClick={() => { setState('loading'); setAttempt((value) => value + 1); }}>{language === 'ar' ? 'إعادة المحاولة' : 'Try again'}</button></div> : null}
    <div ref={root} className={state === 'ready' ? undefined : 'image-ready-pending'} inert={state !== 'ready'} aria-hidden={state !== 'ready' || undefined}>{children}</div>
  </div>;
}
