const decodedImages = new Map<string, Promise<void>>();
export function preloadImage(url: string) {
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
    image.fetchPriority = 'low';
    image.decoding = 'async';
    image.src = url;
  }).catch((error: unknown) => { decodedImages.delete(url); throw error; });
  decodedImages.set(url, promise);
  return promise;
}

