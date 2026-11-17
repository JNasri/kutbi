export default function Logo({ decorative = false }: { decorative?: boolean }) {
  return (
    <img
      className={`logo-mark ${decorative ? 'logo-mark-decorative' : ''}`}
      src="/images/alkutbi-logo-512.webp"
      srcSet="/images/alkutbi-logo-128.webp 128w, /images/alkutbi-logo-512.webp 512w"
      sizes={decorative ? '(max-width: 600px) 240px, 512px' : '64px'}
      alt={decorative ? '' : 'Alkutbi Group'}
      aria-hidden={decorative || undefined}
      decoding="async"
    />
  );
}
