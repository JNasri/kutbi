import Logo from './Logo';

export default function LoadingScreen({ label = 'Loading…', detail, overlay = false, dark = false }: { label?: string; detail?: string; overlay?: boolean; dark?: boolean }) {
  return (
    <div className={`loading-screen${overlay ? ' loading-screen-overlay' : ''}${dark ? ' loading-screen-dark' : ''}`} role="status" aria-live="polite" aria-busy="true">
      <div className="loading-screen-card"><Logo decorative /><span className="loading-spinner" aria-hidden="true" /><h2>{label}</h2>{detail ? <p>{detail}</p> : null}</div>
    </div>
  );
}
