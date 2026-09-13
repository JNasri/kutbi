import { useEffect, useRef, useState } from "react";

type Props = {
  from: string;
  to: string;
  labelId: string;
  locale: string;
  placeholder: string;
  fromLabel: string;
  toLabel: string;
  onChange: (from: string, to: string) => void;
  single?: boolean;
};

function dateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function DateRangePicker({
  from,
  to,
  labelId,
  locale,
  placeholder,
  fromLabel,
  toLabel,
  onChange,
  single = false,
}: Props) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(() => {
    const date = from ? new Date(from + "T12:00:00") : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  const formatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const monthFormatter = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  });
  const weekdayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
  });
  const numberFormatter = new Intl.NumberFormat(locale);
  const firstWeekday = month.getDay();
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const format = (value: string) =>
    formatter.format(new Date(value + "T12:00:00"));

  useEffect(() => {
    if (!isOpen) return;

    const close = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !pickerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", close, { passive: true });
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [isOpen]);

  const select = (value: string) => {
    if (single) {
      onChange(value, "");
      setIsOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
      return;
    }

    if (!from || to) {
      onChange(value, "");
      return;
    }

    onChange(value < from ? value : from, value < from ? from : value);
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const displayValue = from
    ? single
      ? format(from)
      : format(from) + " — " + (to ? format(to) : toLabel)
    : placeholder;
  const calendarId = labelId + "-calendar";

  return (
    <div className="stay-period-picker" ref={pickerRef}>
      <button
        ref={triggerRef}
        id={labelId + "-trigger"}
        className="stay-period-trigger"
        type="button"
        aria-labelledby={labelId}
        aria-expanded={isOpen}
        aria-controls={calendarId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{displayValue}</span>
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M7 3v4m10-4v4M3 11h18" />
        </svg>
      </button>

      {isOpen ? (
        <div
          id={calendarId}
          className="stay-calendar"
          role="dialog"
          aria-modal="false"
          aria-labelledby={labelId}
        >
          <div className="stay-calendar-nav">
            <button
              type="button"
              aria-label={monthFormatter.format(
                new Date(month.getFullYear(), month.getMonth() - 1, 1),
              )}
              onClick={() =>
                setMonth(
                  new Date(month.getFullYear(), month.getMonth() - 1, 1),
                )
              }
            >
              ‹
            </button>
            <strong aria-live="polite">{monthFormatter.format(month)}</strong>
            <button
              type="button"
              aria-label={monthFormatter.format(
                new Date(month.getFullYear(), month.getMonth() + 1, 1),
              )}
              onClick={() =>
                setMonth(
                  new Date(month.getFullYear(), month.getMonth() + 1, 1),
                )
              }
            >
              ›
            </button>
          </div>

          <p className="stay-calendar-instruction">
            {single ? fromLabel : from && !to ? toLabel : fromLabel}
          </p>

          <div className="stay-calendar-days">
            {Array.from({ length: 7 }, (_, index) => (
              <small key={"weekday-" + index}>
                {weekdayFormatter.format(new Date(2026, 0, 4 + index))}
              </small>
            ))}
            {Array.from({ length: firstWeekday }, (_, index) => (
              <span key={"blank-" + index} />
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const date = new Date(
                month.getFullYear(),
                month.getMonth(),
                index + 1,
              );
              const value = dateKey(date);
              const endpoint = value === from || value === to;
              const inRange = Boolean(
                from && to && value >= from && value <= to,
              );

              return (
                <button
                  key={value}
                  type="button"
                  className={
                    (endpoint ? "range-endpoint " : "") +
                    (inRange ? "in-range" : "")
                  }
                  aria-label={formatter.format(date)}
                  aria-pressed={endpoint || inRange}
                  aria-current={
                    value === dateKey(new Date()) ? "date" : undefined
                  }
                  onClick={() => select(value)}
                >
                  {numberFormatter.format(index + 1)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
