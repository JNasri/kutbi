import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Language } from "../siteContent";
import type { BlogSummary } from "../types/blog";
import { getHeroPosts } from "../lib/blogs";

const fallbackPosts: BlogSummary[] = [
  {
    id: -1,
    slug: "saudi-welcome",
    image_url: "/images/saudi-atlas.jpg",
    title_ar: "\u0631\u062d\u0644\u0629 \u062a\u0628\u062f\u0623 \u0628\u062d\u0641\u0627\u0648\u0629 \u0633\u0639\u0648\u062f\u064a\u0629",
    title_en: "A journey shaped by Saudi hospitality",
    excerpt_ar: "\u0642\u0635\u0635 \u0648\u0646\u0635\u0627\u0626\u062d \u0645\u0644\u0647\u0645\u0629 \u0644\u0631\u062d\u0644\u0629 \u0623\u0643\u062b\u0631 \u062b\u0631\u0627\u0621\u064b \u0648\u0631\u0627\u062d\u0629.",
    excerpt_en: "Stories and practical inspiration for a richer, more comfortable journey across the Kingdom.",
  },
  {
    id: -2,
    slug: "travel-in-comfort",
    image_url: "/images/bus-fleet.jpg",
    title_ar: "\u062a\u0646\u0642\u0644 \u0628\u062b\u0642\u0629 \u0648\u0631\u0627\u062d\u0629",
    title_en: "Travel with confidence and comfort",
    excerpt_ar: "\u062a\u0639\u0631\u0641 \u0639\u0644\u0649 \u0623\u0633\u0637\u0648\u0644\u0646\u0627 \u0648\u0643\u064a\u0641 \u0646\u062e\u0637\u0637 \u0644\u0643\u0644 \u0627\u0646\u062a\u0642\u0627\u0644 \u0628\u0639\u0646\u0627\u064a\u0629.",
    excerpt_en: "Discover how our fleet supports every transfer, from arrival through departure.",
  },
  {
    id: -3,
    slug: "discover-saudi",
    image_url: "/images/hero-city.png",
    title_ar: "\u0627\u0643\u062a\u0634\u0641 \u0648\u062c\u0647\u064b\u0627 \u062c\u062f\u064a\u062f\u064b\u0627 \u0644\u0644\u0645\u0645\u0644\u0643\u0629",
    title_en: "Discover a new side of Saudi Arabia",
    excerpt_ar: "\u0648\u062c\u0647\u0627\u062a \u062f\u064a\u0646\u064a\u0629 \u0648\u062b\u0642\u0627\u0641\u064a\u0629 \u0648\u0637\u0628\u064a\u0639\u064a\u0629 \u0645\u062e\u062a\u0627\u0631\u0629 \u0644\u0631\u062d\u0644\u0629 \u0644\u0627 \u062a\u0646\u0633\u0649.",
    excerpt_en: "Religious, cultural, and natural destinations selected for unforgettable journeys.",
  },
];

export default function BlogCarousel({ language }: { language: Language }) {
  const [posts, setPosts] = useState<BlogSummary[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getHeroPosts()
      .then((publishedPosts) => {
        if (!cancelled) {
          const selectedPosts = publishedPosts.length > 0 ? publishedPosts : fallbackPosts;
          setPosts(selectedPosts);
          selectedPosts.forEach(({ image_url }) => {
            const image = new Image();
            image.decoding = "async";
            image.src = image_url;
          });
        }
      })
      .catch(() => {
        if (!cancelled) setPosts(fallbackPosts);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!posts || paused || posts.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setActiveIndex((current) => (current + 1) % posts.length),
      5_500,
    );
    return () => window.clearInterval(timer);
  }, [paused, posts?.length]);

  if (!posts) {
    return (
      <aside
        className="hero-blog hero-blog-loading reveal-item"
        aria-label={language === "ar" ? "\u062c\u0627\u0631\u064d \u062a\u062d\u0645\u064a\u0644 \u0623\u062d\u062f\u062b \u0627\u0644\u0642\u0635\u0635" : "Loading latest stories"}
        aria-busy="true"
      >
        <div className="hero-blog-loading-image" />
        <div className="hero-blog-loading-copy"><i /><i /><i /></div>
      </aside>
    );
  }

  const post = posts[activeIndex] ?? posts[0];
  const title = language === "ar" ? post.title_ar : post.title_en;
  const excerpt = language === "ar" ? post.excerpt_ar : post.excerpt_en;
  const destination = post.id < 0 ? "/journal" : `/journal/${post.slug}`;

  return (
    <aside
      className="hero-blog reveal-item"
      aria-label={language === "ar" ? "\u0623\u062d\u062f\u062b \u0627\u0644\u0642\u0635\u0635" : "Latest stories"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Link className="hero-blog-link" to={destination} aria-label={title}>
        <div className="hero-blog-image" key={`${post.id}-image`}>
          <img src={post.image_url} alt={title} decoding="async" loading="eager" fetchPriority="high" />
          <span>{language === "ar" ? "\u0645\u0646 \u0645\u062c\u0644\u062a\u0646\u0627" : "From our journal"}</span>
        </div>
        <div className="hero-blog-copy" key={`${post.id}-copy`}>
          <small>{String(activeIndex + 1).padStart(2, "0")} / {String(posts.length).padStart(2, "0")}</small>
          <h2>{title}</h2>
          <p>{excerpt}</p>
        </div>
      </Link>
      <div className="hero-blog-controls" aria-label={language === "ar" ? "\u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u0642\u0635\u0629" : "Choose story"}>
        {posts.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={index === activeIndex ? "active" : ""}
            onClick={() => setActiveIndex(index)}
            aria-label={`${language === "ar" ? "\u0627\u0644\u0642\u0635\u0629" : "Story"} ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>
    </aside>
  );
}