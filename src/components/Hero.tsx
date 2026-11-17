import Logo from "./Logo";
import BlogCarousel from "./BlogCarousel";
import type { Language } from "../siteContent";
import type { PlannerMode } from "./TripPlanner";
import { Link } from "react-router";
import { useEffect, useState } from 'react';
import { warmSite } from '../lib/warmSite';

type HeroCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primary: string;
  secondary: string;
  scroll?: string;
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
  const [backgroundReady, setBackgroundReady] = useState(false);
  useEffect(() => {
    if (backgroundReady) return warmSite();
  }, [backgroundReady]);
  return (
    <section id="home" className="hero scene" aria-labelledby="hero-title">
      <img className={`scene-image hero-image${backgroundReady ? ' is-loaded' : ''}`}
        src="/images/hero-city.webp"
        srcSet="/images/hero-city-960.webp 960w, /images/hero-city.webp 1983w"
        sizes="100vw" width="1983" height="793" alt="" aria-hidden="true"
        fetchPriority="high" decoding="async"
        onLoad={async (event) => {
          try { await event.currentTarget.decode(); setBackgroundReady(true); } catch { /* Keep the solid background if decoding fails. */ }
        }} />
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
            <Link
              className="button button-gold"
              to="/trips?mode=packages"
              onClick={() => onSelectPlannerMode("packages")}
            >
              {copy.primary}
              <span>↗</span>
            </Link>
            <Link
              className="button button-ghost"
              to="/trips?mode=custom"
              onClick={() => onSelectPlannerMode("custom")}
            >
              {copy.secondary}
              <span>↗</span>
            </Link>
          </div>
        </div>
        <BlogCarousel language={language} />
      </div>
      <div className="scroll-cue">
        <span>{copy.scroll}</span>
        <i />
      </div>
      <div className="hero-index">
        01 <span>/</span> 04
      </div>
    </section>
  );
}
