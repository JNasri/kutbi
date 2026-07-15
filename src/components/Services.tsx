type ServiceCard = { icon: string; title: string; text: string };
type ServicesCopy = { kicker: string; title: string; subtitle: string; cards: readonly ServiceCard[] };

function ServiceIcon({ name }: { name: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (name === 'visa') return <svg viewBox="0 0 64 64" {...common}><rect x="13" y="9" width="31" height="43" rx="3"/><path d="M21 18h15M21 25h9M48 31c-7 0-11 4-11 9 0 7 11 14 11 14s11-7 11-14c0-5-4-9-11-9Z"/><circle cx="48" cy="40" r="3"/></svg>;
  if (name === 'transport') return <svg viewBox="0 0 64 64" {...common}><path d="M11 42V24c0-8 6-13 13-13h17c8 0 13 6 13 13v18"/><path d="M11 34h43M17 21h31M15 48h35M18 48v5M47 48v5"/><circle cx="20" cy="41" r="2"/><circle cx="45" cy="41" r="2"/></svg>;
  if (name === 'tours') return <svg viewBox="0 0 64 64" {...common}><path d="M12 50h40M17 50V28h30v22M22 28c2-8 7-13 10-13s8 5 10 13M27 50V38h10v12M32 15V9M28 11h8"/><path d="M9 54h46"/></svg>;
  return <svg viewBox="0 0 64 64" {...common}><path d="M13 43h38M17 43V29h30v14M22 29c0-9 5-15 10-15s10 6 10 15M32 14V9"/><path d="M10 48h44M18 52h28"/><circle cx="50" cy="16" r="4"/><path d="m50 8 1-4m7 12 4-1M42 16l-4-1"/></svg>;
}

export default function Services({ copy }: { copy: ServicesCopy }) {
  return <section id="services" className="content-section services-section">
    <div className="section-heading content-wrap"><p>{copy.kicker}</p><h2>{copy.title}</h2><span>{copy.subtitle}</span></div>
    <div className="service-grid content-wrap">{copy.cards.map((card, index) => <article className="service-card" key={card.title}>
      <div className="card-number">0{index + 1}</div><div className="service-icon"><ServiceIcon name={card.icon} /></div><h3>{card.title}</h3><p>{card.text}</p>
    </article>)}</div>
  </section>;
}
