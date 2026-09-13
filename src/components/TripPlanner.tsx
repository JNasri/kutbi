import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import DateRangePicker from "./DateRangePicker";
import { whatsappNumber, whatsappUrl } from "../contact";

type TripStep = {
  number: string;
  label: string;
  field: string;
  type: string;
  placeholder?: string;
  options?: readonly string[];
};
type PackageCopy = {
  image: string;
  id: string;
  name: string;
  label: string;
  price: string;
  pricePrefix: string;
  priceLabel: string;
  description: string;
  features: readonly string[];
  cta: string;
  featured?: boolean;
};
type ExtraDestinationGroup = {
  id: string;
  label: string;
  options: readonly string[];
};
type TransportCopy = {
  cards: readonly {
    title: string;
    type: string;
  }[];
};
type PlannerCopy = {
  kicker: string;
  title: string;
  subtitle: string;
  packagesKicker: string;
  modePackages: string;
  modeCustom: string;
  packagesTitle: string;
  packagesSubtitle: string;
  packages: readonly PackageCopy[];
  packageNote: string;
  packageModal: {
    eyebrow: string;
    included: string;
    details: string;
    formTitle: string;
    formDescription: string;
    company: string;
    phone: string;
    email: string;
    date: string;
    datePlaceholder: string;
    dateRequired: string;
    notes: string;
    notesPlaceholder: string;
    send: string;
    close: string;
    detailLabels: readonly string[];
    detailValues: Readonly<Record<string, readonly string[]>>;
  };
  extraDestinationGroups: readonly ExtraDestinationGroup[];
  calendarLocale: string;
  staySelectPeriod: string;
  stayPeriodRequired: string;
  stayFrom: string;
  stayTo: string;
  stayDaysUnit: string;
  steps: readonly TripStep[];
  submit: string;
  note: string;
  ready: string;
};
type FormValues = Record<string, string>;
export type PlannerMode = "packages" | "custom";

function calculateInclusiveDays(from: string, to: string) {
  if (!from || !to) return 0;
  const [fromYear, fromMonth, fromDay] = from.split("-").map(Number);
  const [toYear, toMonth, toDay] = to.split("-").map(Number);
  const start = Date.UTC(fromYear, fromMonth - 1, fromDay);
  const end = Date.UTC(toYear, toMonth - 1, toDay);
  if (end < start) return 0;
  return Math.floor((end - start) / 86_400_000) + 1;
}

function openWhatsApp(summary: string) {
  window.open(
    `${whatsappUrl}?text=${encodeURIComponent(summary)}`,
    "_blank",
    "noopener,noreferrer",
  );
}

export default function TripPlanner({
  copy,
  transport,
  mode,
  onModeChange,
}: {
  copy: PlannerCopy;
  transport: TransportCopy;
  mode: PlannerMode;
  onModeChange: (mode: PlannerMode) => void;
}) {
  const [values, setValues] = useState<FormValues>({});
  const [extraDestinations, setExtraDestinations] = useState<Set<string>>(
    () => new Set(),
  );
  const [selectedPackage, setSelectedPackage] = useState("");
  const [status, setStatus] = useState("");
  const [activePackage, setActivePackage] = useState<PackageCopy | null>(null);
  const [modalStatus, setModalStatus] = useState("");
  const [packageDate, setPackageDate] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const destinationDetailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!activePackage) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivePackage(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activePackage]);

  useEffect(() => {
    const closeDestinationMenu = (event: PointerEvent) => {
      const menu = destinationDetailsRef.current;
      if (
        menu?.open &&
        event.target instanceof Node &&
        !menu.contains(event.target)
      )
        menu.open = false;
    };
    const closeDestinationMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && destinationDetailsRef.current?.open)
        destinationDetailsRef.current.open = false;
    };

    document.addEventListener("pointerdown", closeDestinationMenu, {
      passive: true,
    });
    document.addEventListener("keydown", closeDestinationMenuOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeDestinationMenu);
      document.removeEventListener("keydown", closeDestinationMenuOnEscape);
    };
  }, []);

  const stayDayCount = calculateInclusiveDays(
    values.daysFrom ?? "",
    values.daysTo ?? "",
  );

  const submitCustomTrip = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stayDayCount) {
      setStatus(copy.stayPeriodRequired);
      const trigger = document.getElementById("trip-step-days-trigger");
      if (trigger?.parentElement instanceof HTMLDetailsElement)
        trigger.parentElement.open = true;
      trigger?.focus();
      return;
    }
    setStatus("");
    const summary = copy.steps
      .map((step) => {
        const value =
          step.field === "extras"
            ? [...extraDestinations].join(", ")
            : step.field === "days"
              ? [
                  values.daysFrom || "-",
                  " — ",
                  values.daysTo || "-",
                  " (",
                  stayDayCount || "-",
                  " ",
                  copy.stayDaysUnit,
                  ")",
                ].join("")
              : values[step.field];
        return `${step.label}: ${value || "-"}`;
      })
      .join("\n");
    if (whatsappNumber) openWhatsApp(summary);
    else setStatus(copy.ready);
  };

  const choosePackage = (packageItem: PackageCopy) => {
    setSelectedPackage(packageItem.id);
    setModalStatus("");
    setActivePackage(packageItem);
  };

  const submitPackageInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activePackage) return;
    const form = new FormData(event.currentTarget);
    const summary = [
      `${copy.modePackages}: ${activePackage.name}`,
      `${copy.packageModal.company}: ${form.get("company") || "-"}`,
      `${copy.packageModal.phone}: ${form.get("phone") || "-"}`,
      `${copy.packageModal.email}: ${form.get("email") || "-"}`,
      copy.packageModal.date + ": " + packageDate,
      `${copy.packageModal.notes}: ${form.get("notes") || "-"}`,
    ].join("\n");
    if (whatsappNumber) openWhatsApp(summary);
    else setModalStatus(copy.ready);
  };

  const closePackageModal = () => setActivePackage(null);
  const closeFromBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) closePackageModal();
  };

  const changeMode = (nextMode: PlannerMode) => {
    onModeChange(nextMode);
    setStatus("");
  };

  const toggleExtraDestination = (name: string) =>
    setExtraDestinations((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const selectedDestinationNames = copy.extraDestinationGroups.flatMap(
    (category) =>
      category.options.filter((name) => extraDestinations.has(name)),
  );

  return (
    <section id="trip-planner" className="content-section planner-section">
      <div className="section-heading content-wrap">
        <p>{mode === "packages" ? copy.packagesKicker : copy.kicker}</p>
        <h2>{mode === "packages" ? copy.packagesTitle : copy.title}</h2>
        <span>
          {mode === "packages" ? copy.packagesSubtitle : copy.subtitle}
        </span>
      </div>

      <div
        className="planner-switch content-wrap"
        role="tablist"
        aria-label={copy.title}
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "packages"}
          className={mode === "packages" ? "active" : ""}
          onClick={() => changeMode("packages")}
        >
          <span>01</span>
          {copy.modePackages}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "custom"}
          className={mode === "custom" ? "active" : ""}
          onClick={() => changeMode("custom")}
        >
          <span>02</span>
          {copy.modeCustom}
        </button>
      </div>

      {mode === "packages" ? (
        <div
          className="planner-mode-panel package-panel content-wrap"
          role="tabpanel"
        >
          <div className="package-grid">
            {copy.packages.map((packageItem) => (
              <article
                className={`package-card ${packageItem.featured ? "featured" : ""} ${selectedPackage === packageItem.id ? "selected" : ""}`}
                key={packageItem.id}
              >
                <img
                  className="package-card-artwork"
                  src={packageItem.image}
                  alt={packageItem.name}
                  width={1254}
                  height={1254}
                  loading="lazy"
                  decoding="async"
                />
                <div className="package-card-details">
                <strong
                  className="package-price"
                  aria-label={`${packageItem.pricePrefix} ${packageItem.price} ${packageItem.priceLabel}`}
                >
                  <small>{packageItem.pricePrefix}</small>
                  <span className="package-amount" dir="ltr">
                    <span className="saudi-riyal-symbol" aria-hidden="true">
                      ê
                    </span>
                    <span>{packageItem.price}</span>
                  </span>
                  <small>{packageItem.priceLabel}</small>
                </strong>
                <div className="package-rule" />
                <span className="package-description">
                  {packageItem.description}
                </span>
                <ul>
                  {packageItem.features.map((feature) => (
                    <li key={feature}>
                      <i>✓</i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className="package-button"
                  type="button"
                  onClick={() => choosePackage(packageItem)}
                >
                  {packageItem.cta}
                  <span>↗</span>
                </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <form
          className="trip-form planner-mode-panel content-wrap"
          role="tabpanel"
          onSubmit={submitCustomTrip}
        >
          <div className="snake-line" aria-hidden="true" />
          <div className="trip-steps">
            {copy.steps.map((step, index) => {
              const labelId = `trip-step-${step.field}`;
              const selectOptions =
                step.field === "vehicle"
                  ? transport.cards.map((vehicle) => ({
                      value: vehicle.title,
                      label: `${vehicle.title} — ${vehicle.type}`,
                    }))
                  : (step.options ?? []).map((option) => ({
                      value: option,
                      label: option,
                    }));

              return (
                <div className={`trip-step step-${index + 1}`} key={step.field}>
                  <span className="step-number">{step.number}</span>
                  <strong id={labelId}>
                    {step.label}
                    {step.field === "days" && stayDayCount ? (
                      <span className="stay-day-count">
                        {stayDayCount} {copy.stayDaysUnit}
                      </span>
                    ) : null}
                  </strong>
                  {step.field === "days" ? (
                    <DateRangePicker
                      from={values.daysFrom ?? ""}
                      to={values.daysTo ?? ""}
                      labelId={labelId}
                      locale={copy.calendarLocale}
                      placeholder={copy.staySelectPeriod}
                      fromLabel={copy.stayFrom}
                      toLabel={copy.stayTo}
                      onChange={(daysFrom, daysTo) => {
                        setValues((current) => ({
                          ...current,
                          daysFrom,
                          daysTo,
                        }));
                        setStatus("");
                      }}
                    />
                  ) : step.field === "extras" ? (
                    <details
                      ref={destinationDetailsRef}
                      className="destination-multiselect"
                    >
                      <summary aria-labelledby={labelId}>
                        <span>
                          {selectedDestinationNames.length
                            ? selectedDestinationNames.join(", ")
                            : (step.placeholder ?? "—")}
                        </span>
                        <b aria-hidden="true">⌄</b>
                      </summary>
                      <div className="destination-options">
                        {copy.extraDestinationGroups.map((category) => (
                          <fieldset key={category.id}>
                            <legend>{category.label}</legend>
                            {category.options.map((name) => (
                              <label key={name}>
                                <input
                                  type="checkbox"
                                  checked={extraDestinations.has(name)}
                                  onChange={() => toggleExtraDestination(name)}
                                />
                                <span>{name}</span>
                              </label>
                            ))}
                          </fieldset>
                        ))}
                      </div>
                    </details>
                  ) : step.type === "select" ? (
                    <select
                      aria-labelledby={labelId}
                      required
                      value={values[step.field] ?? ""}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [step.field]: event.target.value,
                        }))
                      }
                    >
                      <option value="">—</option>
                      {selectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      aria-labelledby={labelId}
                      required={index < 4}
                      min={step.type === "number" ? 1 : undefined}
                      type={step.type}
                      placeholder={step.placeholder}
                      value={values[step.field] ?? ""}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [step.field]: event.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="planner-submit">
            <p>{status || copy.note}</p>
            <button className="button button-gold" type="submit">
              {copy.submit}
              <span>↗</span>
            </button>
          </div>
        </form>
      )}

      {activePackage
        ? createPortal(
            <div
              className="package-modal-backdrop"
              onMouseDown={closeFromBackdrop}
            >
              <section
                className="package-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="package-modal-title"
              >
                <button
                  ref={closeButtonRef}
                  className="package-modal-close"
                  type="button"
                  onClick={closePackageModal}
                  aria-label={copy.packageModal.close}
                >
                  <span aria-hidden="true">×</span>
                </button>

                <header className="package-modal-header">
                  <div>
                    <span>{copy.packageModal.eyebrow}</span>
                    <small>{activePackage.label}</small>
                  </div>
                  <h3 id="package-modal-title">{activePackage.name}</h3>
                  <strong
                    className="package-modal-price"
                    aria-label={`${activePackage.pricePrefix} ${activePackage.price} ${activePackage.priceLabel}`}
                  >
                    <small>{activePackage.pricePrefix}</small>
                    <span className="package-amount" dir="ltr">
                      <span className="saudi-riyal-symbol" aria-hidden="true">
                        ê
                      </span>
                      <span>{activePackage.price}</span>
                    </span>
                    <small>{activePackage.priceLabel}</small>
                  </strong>
                  <p>{activePackage.description}</p>
                </header>

                <div className="package-modal-body">
                  <div className="package-modal-summary">
                    <section>
                      <h4>{copy.packageModal.included}</h4>
                      <ul>
                        {activePackage.features.map((feature) => (
                          <li key={feature}>
                            <i>✓</i>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h4>{copy.packageModal.details}</h4>
                      <dl>
                        {copy.packageModal.detailLabels.map((label, index) => (
                          <div key={label}>
                            <dt>{label}</dt>
                            <dd>
                              {copy.packageModal.detailValues[
                                activePackage.id
                              ]?.[index] ?? "—"}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </section>
                  </div>

                  <form
                    className="package-inquiry-form"
                    onSubmit={submitPackageInquiry}
                  >
                    <div className="package-inquiry-heading">
                      <h4>{copy.packageModal.formTitle}</h4>
                      <p>{copy.packageModal.formDescription}</p>
                    </div>
                    <div className="package-inquiry-fields">
                      <label>
                        <span>{copy.packageModal.company}</span>
                        <input
                          name="company"
                          type="text"
                          autoComplete="organization"
                          required
                        />
                      </label>
                      <label>
                        <span>{copy.packageModal.phone}</span>
                        <input
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          required
                        />
                      </label>
                      <label>
                        <span>{copy.packageModal.email}</span>
                        <input
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          required
                        />
                      </label>
                      <div className="package-date-field">
                        <span id="package-travel-date">
                          {copy.packageModal.date}
                        </span>
                        <DateRangePicker
                          single
                          from={packageDate}
                          to=""
                          labelId="package-travel-date"
                          locale={copy.calendarLocale}
                          placeholder={copy.packageModal.datePlaceholder}
                          fromLabel={copy.packageModal.datePlaceholder}
                          toLabel=""
                          onChange={(date) => {
                            setPackageDate(date);
                            setModalStatus("");
                          }}
                        />
                      </div>
                      <label className="package-notes-field">
                        <span>{copy.packageModal.notes}</span>
                        <textarea
                          name="notes"
                          rows={4}
                          placeholder={copy.packageModal.notesPlaceholder}
                        />
                      </label>
                    </div>
                    <div className="package-modal-actions">
                      <p aria-live="polite">{modalStatus}</p>
                      <button className="button button-gold" type="submit">
                        {copy.packageModal.send}
                        <span>↗</span>
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
