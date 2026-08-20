import { Link } from "react-router";

type ServiceCard = { image: string; title: string; text: string };
type ServicesCopy = { kicker: string; title: string; subtitle: string; cards: readonly ServiceCard[] };
type ServicesProps = { copy: ServicesCopy; theme: "light" | "dark" };

const darkServiceImages: Record<string, string> = {
  "/images/service-hospitality.jpeg": "/images/service-hospitality-dark.jpeg",
  "/images/service-tours.jpeg": "/images/service-tours-dark.jpeg",
  "/images/service-transportation.jpeg": "/images/service-transportation-dark.jpeg",
  "/images/service-umrah-visa.jpeg": "/images/service-umrah-visa-dark.jpeg",
};

const serviceDestinations: Record<string, string> = {
  "/images/service-umrah-visa.jpeg": "/services#umrah-visa",
  "/images/service-transportation.jpeg": "/services#transport",
  "/images/service-tours.jpeg": "/trips#offers",
  "/images/service-hospitality.jpeg": "/trips?mode=packages#trip-planner",
};

export default function Services({ copy, theme }: ServicesProps) {
  return <section id="services" className="content-section services-section">
    <div className="section-heading content-wrap"><p>{copy.kicker}</p><h2>{copy.title}</h2><span>{copy.subtitle}</span></div>
    <div className="service-grid content-wrap">{copy.cards.map((card) => <article className="service-card" key={card.image}>
      <Link className="service-card-link" to={serviceDestinations[card.image] ?? "/services"} aria-label={card.title}>
        <img src={theme === "dark" ? darkServiceImages[card.image] ?? card.image : card.image} alt={card.title} loading="lazy" decoding="async" width="1024" height="1024" />
        <span aria-hidden="true">↗</span>
      </Link>
    </article>)}</div>
  </section>;
}
