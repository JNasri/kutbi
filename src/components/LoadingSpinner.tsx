type LoadingSpinnerProps = {
  label?: string;
  fullPage?: boolean;
  compact?: boolean;
  inverse?: boolean;
};

export default function LoadingSpinner({
  label = "Loading",
  fullPage = false,
  compact = false,
  inverse = false,
}: LoadingSpinnerProps) {
  return (
    <div
      className={[
        "loading-spinner-wrap",
        fullPage ? "is-full-page" : "",
        compact ? "is-compact" : "",
        inverse ? "is-inverse" : "",
      ].filter(Boolean).join(" ")}
      role="status"
      aria-live="polite"
    >
      <span className="loading-spinner" aria-hidden="true">
        <i />
        <i />
      </span>
      <span className="loading-spinner-label">{label}</span>
    </div>
  );
}

