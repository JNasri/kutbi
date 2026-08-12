import { useState } from 'react';

type TransportCard = { title: string; type: string; text: string; meta: string; images: readonly string[] };
type TransportCopy = { kicker: string; title: string; subtitle: string; cards: readonly TransportCard[] };

function VehicleCard({ card }: { card: TransportCard }) {
  const [activeImage, setActiveImage] = useState(0);

  return <article className="vehicle-card">
    <div className="vehicle-media">
      {card.images.map((image, index) => <img
        className={`vehicle-image${index === activeImage ? ' is-active' : ''}`}
        src={image}
        alt={`${card.title} — ${index + 1}`}
        loading="lazy"
        decoding="async"
        width="1600"
        height="800"
        key={image}
      />)}
      <div className="vehicle-gallery-controls" aria-label={card.title}>
        {card.images.map((image, index) => <button
          type="button"
          className={index === activeImage ? 'active' : ''}
          onClick={() => setActiveImage(index)}
          aria-label={`${card.title} — ${index + 1}`}
          aria-pressed={index === activeImage}
          key={image}
        >0{index + 1}</button>)}
      </div>
    </div>
    <div className="vehicle-spec">
      <strong>{card.type}</strong>
      <span>{card.meta}</span>
    </div>
    <div className="vehicle-copy"><h3>{card.title}</h3><p>{card.text}</p></div>
  </article>;
}

export default function Transport({ copy }: { copy: TransportCopy }) {
  return <section id="transport" className="transport-section">
    <div className="transport-backdrop" aria-hidden="true" />
    <div className="transport-inner content-wrap">
      <div className="section-heading section-heading-light"><p>{copy.kicker}</p><h2>{copy.title}</h2><span>{copy.subtitle}</span></div>
      <div className="vehicle-grid">{copy.cards.map((card) => <VehicleCard card={card} key={card.title} />)}</div>
    </div>
  </section>;
}
