import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiRequest } from "../lib/api";
import type { Language } from "../siteContent";
import type { BlogPost } from "../types/blog";

const ui = {
  ar: {
    kicker:
      "\u0645\u0646 \u0645\u062c\u0645\u0648\u0639\u0629 \u0627\u0644\u0643\u062a\u0628\u064a",
    title: "\u0627\u0644\u0645\u062c\u0644\u0629",
    intro:
      "\u0645\u0634\u0627\u0631\u0643\u0627\u062a\u0646\u0627\u060c \u0641\u0639\u0627\u0644\u064a\u0627\u062a\u0646\u0627 \u0648\u0622\u062e\u0631 \u0623\u0645\u0627\u0643\u0646 \u062a\u0648\u0627\u062c\u062f\u0646\u0627.",
    featured:
      "\u0627\u0644\u0642\u0635\u0629 \u0627\u0644\u0645\u0645\u064a\u0632\u0629",
    read: "\u0627\u0642\u0631\u0623 \u0627\u0644\u0642\u0635\u0629",
    empty:
      "\u0633\u0646\u0646\u0634\u0631 \u0623\u0648\u0644\u0649 \u0642\u0635\u0635\u0646\u0627 \u0642\u0631\u064a\u0628\u064b\u0627.",
    error:
      "\u062a\u0639\u0630\u0631 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0645\u062c\u0644\u0629 \u0627\u0644\u0622\u0646.",
  },
  en: {
    kicker: "From Alkutbi Group",
    title: "Our Journal",
    intro: "Our contributions, events, and latest locations.",
    featured: "Featured journal",
    read: "Read journal",
    empty: "Our first journal stories will be published soon.",
    error: "The journal could not be loaded right now.",
  },
};

const formatDate = (value: string | null | undefined, language: Language) =>
  value
    ? new Intl.DateTimeFormat(language === "ar" ? "ar-SA" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(value))
    : "";

export default function JournalPage({ language }: { language: Language }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const copy = ui[language];

  useEffect(() => {
    let active = true;
    apiRequest<{ posts: BlogPost[] }>("/api/blogs")
      .then(({ posts: nextPosts }) => {
        if (active) setPosts(nextPosts);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const [featured, ...rest] = posts;
  const title = (post: BlogPost) =>
    language === "ar" ? post.title_ar : post.title_en;
  const excerpt = (post: BlogPost) =>
    language === "ar" ? post.excerpt_ar : post.excerpt_en;

  return (
    <section className="journal-page routed-page">
      <header className="journal-masthead content-wrap">
        <p>{copy.kicker}</p>
        <h1>{copy.title}</h1>
        <span>{copy.intro}</span>
      </header>

      {loading ? (
        <div className="journal-state content-wrap" aria-label="Loading">
          <i />
          <i />
          <i />
        </div>
      ) : null}
      {!loading && failed ? (
        <p className="journal-message content-wrap" role="alert">
          {copy.error}
        </p>
      ) : null}
      {!loading && !failed && !featured ? (
        <p className="journal-message content-wrap">{copy.empty}</p>
      ) : null}

      {featured ? (
        <div className="journal-feed content-wrap">
          <Link className="journal-feature" to={`/journal/${featured.slug}`}>
            <div className="journal-feature-media">
              <img src={featured.image_url} alt={title(featured)} />
            </div>
            <div className="journal-feature-copy">
              <small>
                {copy.featured} <b>01</b>
              </small>
              <h2>{title(featured)}</h2>
              <p>{excerpt(featured)}</p>
              <span>
                {copy.read} <b aria-hidden="true">\u2197</b>
              </span>
              <time>
                {formatDate(
                  featured.published_at ?? featured.created_at,
                  language,
                )}
              </time>
            </div>
          </Link>

          {rest.length ? (
            <div className="journal-grid">
              {rest.map((post, index) => (
                <Link
                  className="journal-card"
                  to={`/journal/${post.slug}`}
                  key={post.id}
                >
                  <div>
                    <img src={post.image_url} alt={title(post)} />
                    <span>{String(index + 2).padStart(2, "0")}</span>
                  </div>
                  <time>
                    {formatDate(post.published_at ?? post.created_at, language)}
                  </time>
                  <h2>{title(post)}</h2>
                  <p>{excerpt(post)}</p>
                  <b>
                    {copy.read} <i aria-hidden="true">\u2197</i>
                  </b>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
