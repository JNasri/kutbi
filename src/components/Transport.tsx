type TransportCard = { title: string; text: string; meta: string };
type TransportCopy = { kicker: string; title: string; subtitle: string; cards: readonly TransportCard[] };

const vehiclePositions = ['0% 0%', '100% 0%', '0% 100%', '100% 100%'];

export default function Transport({ copy }: { copy: TransportCopy }) {
  return <section id="transport" className="transport-section">
    <div className="transport-backdrop" aria-hidden="true" />
    <div className="transport-inner content-wrap">
      <div className="section-heading section-heading-light"><p>{copy.kicker}</p><h2>{copy.title}</h2><span>{copy.subtitle}</span></div>
      <div className="vehicle-grid">{copy.cards.map((card, index) => <article className="vehicle-card" key={card.title}>
        <div className="atlas-image vehicle-image" role="img" aria-label={card.title} style={{ backgroundPosition: vehiclePositions[index] }} />
        <div className="vehicle-copy"><small>{card.meta}</small><h3>{card.title}</h3><p>{card.text}</p></div>
      </article>)}</div>
    </div>
  </section>;
}
