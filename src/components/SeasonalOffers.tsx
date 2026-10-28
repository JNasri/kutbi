import type { CSSProperties } from "react";

export type Offer = { id?: string; title: string; text: string; image_url?: string; image_layout?: 'atlas' | 'cover'; image_x?: number; image_y?: number };
type OffersCopy = {
  kicker: string;
  title: string;
  subtitle: string;
  offers: readonly Offer[];
};

const offerPositions = ["0% 0%", "66.666% 100%", "33.333% 50%"];

export default function SeasonalOffers({ copy, offers }: { copy: OffersCopy; offers?: readonly Offer[] }) {
  return (
    <section id="offers" className="content-section offers-section">
      <div className="section-heading section-heading-light content-wrap">
        <p>{copy.kicker}</p>
        <h2>{copy.title}</h2>
        <span>{copy.subtitle}</span>
      </div>

      <div className="offers-grid content-wrap">
        {(offers ?? copy.offers).map((offer, index) => (
          <article
            className={`offer-card offer-card-${index + 1}`}
            key={offer.id ?? offer.title}
            style={
              { "--offer-position": offerPositions[index] } as CSSProperties
            }
          >
            <div className="offer-card-image" aria-hidden="true" style={offer.image_url ? { backgroundImage: `url(${JSON.stringify(offer.image_url)})`, backgroundSize: offer.image_layout === 'atlas' ? '400% 300%' : 'cover', backgroundPosition: `${offer.image_x ?? 50}% ${offer.image_y ?? 50}%` } : undefined} />
            <div className="offer-card-copy">
              <small>0{index + 1}</small>
              <h3>{offer.title}</h3>
              <p>{offer.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
