type ServiceCard = { image: string; title: string; text: string };
type ServicesCopy = { kicker: string; title: string; subtitle: string; cards: readonly ServiceCard[] };

export default function Services({ copy }: { copy: ServicesCopy }) {
  return <section id="services" className="content-section services-section">
    <div className="section-heading content-wrap"><p>{copy.kicker}</p><h2>{copy.title}</h2><span>{copy.subtitle}</span></div>
    <div className="service-grid content-wrap">{copy.cards.map((card) => <article className="service-card" key={card.image}>
      <img src={card.image} alt={card.title} loading="lazy" decoding="async" width="1024" height="1024" />
    </article>)}</div>
  </section>;
}
