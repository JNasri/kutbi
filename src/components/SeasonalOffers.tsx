import type { CSSProperties } from 'react';

type Offer = { title: string; text: string };
type OffersCopy = {
  kicker: string;
  title: string;
  subtitle: string;
  offers: readonly Offer[];
};

const offerPositions = ['0% 0%', '66.666% 100%', '33.333% 50%'];

export default function SeasonalOffers({ copy }: { copy: OffersCopy }) {
  return (
    <section id="offers" className="content-section offers-section">
      <div className="section-heading section-heading-light content-wrap">
        <p>{copy.kicker}</p>
        <h2>{copy.title}</h2>
        <span>{copy.subtitle}</span>
      </div>

      <div className="offers-grid content-wrap">
        {copy.offers.map((offer, index) => (
          <article
            className={`offer-card offer-card-${index + 1}`}
            key={offer.title}
            style={{ '--offer-position': offerPositions[index] } as CSSProperties}
          >
            <div className="offer-card-image" aria-hidden="true" />
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
