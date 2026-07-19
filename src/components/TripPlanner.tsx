import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';

type TripStep = { number: string; label: string; field: string; type: string; placeholder?: string; options?: readonly string[] };
type PackageCopy = { id: string; name: string; label: string; description: string; features: readonly string[]; cta: string; featured?: boolean };
type PlannerCopy = {
  kicker: string; title: string; subtitle: string;
  modePackages: string; modeCustom: string; packagesTitle: string; packagesSubtitle: string;
  packages: readonly PackageCopy[]; packageNote: string;
  packageModal: {
    eyebrow: string; included: string; details: string; formTitle: string; formDescription: string;
    company: string; phone: string; email: string; notes: string; notesPlaceholder: string;
    send: string; close: string; detailLabels: readonly string[]; detailValues: Readonly<Record<string, readonly string[]>>;
  };
  steps: readonly TripStep[]; submit: string; note: string; ready: string;
};
type FormValues = Record<string, string>;
type PlannerMode = 'packages' | 'custom';

export const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.replace(/\D/g, '') ?? '';

function openWhatsApp(summary: string) {
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(summary)}`, '_blank', 'noopener,noreferrer');
}

export default function TripPlanner({ copy }: { copy: PlannerCopy }) {
  const [mode, setMode] = useState<PlannerMode>('packages');
  const [values, setValues] = useState<FormValues>({});
  const [selectedPackage, setSelectedPackage] = useState('');
  const [status, setStatus] = useState('');
  const [activePackage, setActivePackage] = useState<PackageCopy | null>(null);
  const [modalStatus, setModalStatus] = useState('');
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!activePackage) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePackage(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [activePackage]);

  const submitCustomTrip = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const summary = copy.steps.map((step) => `${step.label}: ${values[step.field] || '-'}`).join('\n');
    if (whatsappNumber) openWhatsApp(summary);
    else setStatus(copy.ready);
  };

  const choosePackage = (packageItem: PackageCopy) => {
    setSelectedPackage(packageItem.id);
    setModalStatus('');
    setActivePackage(packageItem);
  };

  const submitPackageInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activePackage) return;
    const form = new FormData(event.currentTarget);
    const summary = [
      `${copy.modePackages}: ${activePackage.name}`,
      `${copy.packageModal.company}: ${form.get('company') || '-'}`,
      `${copy.packageModal.phone}: ${form.get('phone') || '-'}`,
      `${copy.packageModal.email}: ${form.get('email') || '-'}`,
      `${copy.packageModal.notes}: ${form.get('notes') || '-'}`,
    ].join('\n');
    if (whatsappNumber) openWhatsApp(summary);
    else setModalStatus(copy.ready);
  };

  const closePackageModal = () => setActivePackage(null);
  const closeFromBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) closePackageModal();
  };

  const changeMode = (nextMode: PlannerMode) => {
    setMode(nextMode);
    setStatus('');
  };

  return <section id="trip-planner" className="content-section planner-section">
    <div className="section-heading content-wrap"><p>{copy.kicker}</p><h2>{copy.title}</h2><span>{copy.subtitle}</span></div>

    <div className="planner-switch content-wrap" role="tablist" aria-label={copy.title}>
      <button type="button" role="tab" aria-selected={mode === 'packages'} className={mode === 'packages' ? 'active' : ''} onClick={() => changeMode('packages')}><span>01</span>{copy.modePackages}</button>
      <button type="button" role="tab" aria-selected={mode === 'custom'} className={mode === 'custom' ? 'active' : ''} onClick={() => changeMode('custom')}><span>02</span>{copy.modeCustom}</button>
    </div>

    {mode === 'packages' ? <div className="planner-mode-panel package-panel content-wrap" role="tabpanel">
      <div className="package-heading"><h3>{copy.packagesTitle}</h3><p>{copy.packagesSubtitle}</p></div>
      <div className="package-grid">{copy.packages.map((packageItem, index) => <article className={`package-card ${packageItem.featured ? 'featured' : ''} ${selectedPackage === packageItem.id ? 'selected' : ''}`} key={packageItem.id}>
        {packageItem.featured ? <span className="package-ribbon">{packageItem.label}</span> : null}
        <div className="package-card-top"><small>0{index + 1}</small><span>{packageItem.featured ? '◆' : '◇'}</span></div>
        <p>{packageItem.featured ? copy.modePackages : packageItem.label}</p>
        <h4>{packageItem.name}</h4>
        <div className="package-rule" />
        <span className="package-description">{packageItem.description}</span>
        <ul>{packageItem.features.map((feature) => <li key={feature}><i>✓</i>{feature}</li>)}</ul>
        <button className="package-button" type="button" onClick={() => choosePackage(packageItem)}>{packageItem.cta}<span>↗</span></button>
      </article>)}</div>
      <div className="package-note"><p>{status || copy.packageNote}</p><span>ALKUTBI GROUP</span></div>
    </div> : <form className="trip-form planner-mode-panel content-wrap" role="tabpanel" onSubmit={submitCustomTrip}>
      <div className="snake-line" aria-hidden="true" />
      <div className="trip-steps">{copy.steps.map((step, index) => <label className={`trip-step step-${index + 1}`} key={step.field}>
        <span className="step-number">{step.number}</span><strong>{step.label}</strong>
        {step.type === 'select' ? <select required value={values[step.field] ?? ''} onChange={(event) => setValues((current) => ({ ...current, [step.field]: event.target.value }))}><option value="">—</option>{step.options?.map((option) => <option key={option}>{option}</option>)}</select> : <input required={index < 4} min={step.type === 'number' ? 1 : undefined} type={step.type} placeholder={step.placeholder} value={values[step.field] ?? ''} onChange={(event) => setValues((current) => ({ ...current, [step.field]: event.target.value }))} />}
      </label>)}</div>
      <div className="planner-submit"><p>{status || copy.note}</p><button className="button button-gold" type="submit">{copy.submit}<span>↗</span></button></div>
    </form>}

    {activePackage ? createPortal(<div className="package-modal-backdrop" onMouseDown={closeFromBackdrop}>
      <section className="package-modal" role="dialog" aria-modal="true" aria-labelledby="package-modal-title">
        <button ref={closeButtonRef} className="package-modal-close" type="button" onClick={closePackageModal} aria-label={copy.packageModal.close}>
          <span aria-hidden="true">×</span>
        </button>

        <header className="package-modal-header">
          <div><span>{copy.packageModal.eyebrow}</span><small>{activePackage.label}</small></div>
          <h3 id="package-modal-title">{activePackage.name}</h3>
          <p>{activePackage.description}</p>
        </header>

        <div className="package-modal-body">
          <div className="package-modal-summary">
            <section>
              <h4>{copy.packageModal.included}</h4>
              <ul>{activePackage.features.map((feature) => <li key={feature}><i>✓</i><span>{feature}</span></li>)}</ul>
            </section>
            <section>
              <h4>{copy.packageModal.details}</h4>
              <dl>{copy.packageModal.detailLabels.map((label, index) => <div key={label}><dt>{label}</dt><dd>{copy.packageModal.detailValues[activePackage.id]?.[index] ?? '—'}</dd></div>)}</dl>
            </section>
          </div>

          <form className="package-inquiry-form" onSubmit={submitPackageInquiry}>
            <div className="package-inquiry-heading"><h4>{copy.packageModal.formTitle}</h4><p>{copy.packageModal.formDescription}</p></div>
            <div className="package-inquiry-fields">
              <label><span>{copy.packageModal.company}</span><input name="company" type="text" autoComplete="organization" required /></label>
              <label><span>{copy.packageModal.phone}</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required /></label>
              <label><span>{copy.packageModal.email}</span><input name="email" type="email" inputMode="email" autoComplete="email" required /></label>
              <label className="package-notes-field"><span>{copy.packageModal.notes}</span><textarea name="notes" rows={4} placeholder={copy.packageModal.notesPlaceholder} /></label>
            </div>
            <div className="package-modal-actions">
              <p aria-live="polite">{modalStatus}</p>
              <button className="button button-gold" type="submit">{copy.packageModal.send}<span>↗</span></button>
            </div>
          </form>
        </div>
      </section>
    </div>, document.body) : null}
  </section>;
}
