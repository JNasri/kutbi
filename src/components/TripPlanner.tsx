import { useState, type FormEvent } from 'react';

type TripStep = { number: string; label: string; field: string; type: string; placeholder?: string; options?: readonly string[] };
type PlannerCopy = { kicker: string; title: string; subtitle: string; steps: readonly TripStep[]; submit: string; note: string; ready: string };
type FormValues = Record<string, string>;

export const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.replace(/\D/g, '') ?? '';

export default function TripPlanner({ copy }: { copy: PlannerCopy }) {
  const [values, setValues] = useState<FormValues>({});
  const [status, setStatus] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const summary = copy.steps.map((step) => `${step.label}: ${values[step.field] || '-'}`).join('\n');
    if (whatsappNumber) window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(summary)}`, '_blank', 'noopener,noreferrer');
    else setStatus(copy.ready);
  };

  return <section id="trip-planner" className="content-section planner-section">
    <div className="section-heading content-wrap"><p>{copy.kicker}</p><h2>{copy.title}</h2><span>{copy.subtitle}</span></div>
    <form className="trip-form content-wrap" onSubmit={submit}>
      <div className="snake-line" aria-hidden="true" />
      <div className="trip-steps">{copy.steps.map((step, index) => <label className={`trip-step step-${index + 1}`} key={step.field}>
        <span className="step-number">{step.number}</span><strong>{step.label}</strong>
        {step.type === 'select' ? <select required value={values[step.field] ?? ''} onChange={(event) => setValues((current) => ({ ...current, [step.field]: event.target.value }))}><option value="">—</option>{step.options?.map((option) => <option key={option}>{option}</option>)}</select> : <input required={index < 4} min={step.type === 'number' ? 1 : undefined} type={step.type} placeholder={step.placeholder} value={values[step.field] ?? ''} onChange={(event) => setValues((current) => ({ ...current, [step.field]: event.target.value }))} />}
      </label>)}</div>
      <div className="planner-submit"><p>{status || copy.note}</p><button className="button button-gold" type="submit">{copy.submit}<span>↗</span></button></div>
    </form>
  </section>;
}
