import Logo from "./Logo";
import BlogCarousel from "./BlogCarousel";
import type { Language } from "../siteContent";
import type { PlannerMode } from "./TripPlanner";

type HeroCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primary: string;
  secondary: string;
  scroll: string;
};

export default function Hero({
  copy,
  language,
  onSelectPlannerMode,
}: {
  copy: HeroCopy;
  language: Language;
  onSelectPlannerMode: (mode: PlannerMode) => void;
}) {
  return (
    <section id="home" className="hero scene" aria-labelledby="hero-title">
      <div className="scene-image hero-image" />
      <div className="scene-shade" />
      <div className="grain" />
      <div className="hero-emblem">
        <Logo decorative />
      </div>
      <div className="hero-layout content-wrap">
        <div className="hero-content">
          <p className="eyebrow reveal-item">{copy.eyebrow}</p>
          <h1 id="hero-title" className="reveal-item">
            {copy.title}
          </h1>
          <p className="hero-lede reveal-item">{copy.subtitle}</p>
          <div className="hero-actions reveal-item">
            <a className="button button-gold" href="#trip-planner" onClick={() => onSelectPlannerMode("packages")}>
              {copy.primary}
              <span>↓</span>
            </a>
            <a className="button button-ghost" href="#trip-planner" onClick={() => onSelectPlannerMode("custom")}>
              {copy.secondary}
              <span>↗</span>
            </a>
          </div>
        </div>
        <BlogCarousel language={language} />
      </div>
      <div className="scroll-cue">
        <span>{copy.scroll}</span>
        <i />
      </div>
      <div className="hero-index">
        01 <span>/</span> 05
      </div>
    </section>
  );
}
