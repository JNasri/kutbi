export default function Logo({ decorative = false }: { decorative?: boolean }) {
  return (
    <img
      className={`logo-mark ${decorative ? 'logo-mark-decorative' : ''}`}
      src="/images/alkutbi-logo-transparent.png"
      alt={decorative ? '' : 'Alkutbi Group'}
      aria-hidden={decorative || undefined}
      decoding="async"
    />
  );
}
