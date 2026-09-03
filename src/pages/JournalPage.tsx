import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getPublishedPosts } from "../lib/blogs";
import type { Language } from "../siteContent";
import type { BlogSummary } from "../types/blog";

const ui = {
  ar: {
    kicker: "\u0645\u0646 \u0645\u062c\u0645\u0648\u0639\u0629 \u0627\u0644\u0643\u062a\u0628\u064a",
    title: "\u0645\u062c\u0644\u0629 \u0627\u0644\u0643\u062a\u0628\u064a",
    intro: "\u0645\u0634\u0627\u0631\u0643\u0627\u062a\u0646\u0627\u060c \u0641\u0639\u0627\u0644\u064a\u0627\u062a\u0646\u0627 \u0648\u0622\u062e\u0631 \u0623\u0645\u0627\u0643\u0646 \u062a\u0648\u0627\u062c\u062f\u0646\u0627.",
    count: "\u0642\u0635\u0629 \u0645\u0646\u0634\u0648\u0631\u0629",
    read: "\u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0632\u064a\u062f",
    empty: "\u0633\u0646\u0646\u0634\u0631 \u0623\u0648\u0644\u0649 \u0642\u0635\u0635\u0646\u0627 \u0642\u0631\u064a\u0628\u064b\u0627.",
    error: "\u062a\u0639\u0630\u0631 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0645\u062c\u0644\u0629 \u0627\u0644\u0622\u0646.",
  },
  en: {
    kicker: "From Alkutbi Group",
    title: "Our Journal",
    intro: "Our contributions, events, and latest locations.",
    count: "published stories",
    read: "Read more",
    empty: "Our first journal stories will be published soon.",
    error: "The journal could not be loaded right now.",
  },
};

const formatDate = (value: string | null | undefined, language: Language) =>
  value ? new Intl.DateTimeFormat(language === "ar" ? "ar-SA" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) : "";

export default function JournalPage({ language }: { language: Language }) {
  const [posts, setPosts] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const copy = ui[language];

  useEffect(() => {
    let active = true;
    getPublishedPosts()
      .then((nextPosts) => {
        if (active) {
          setPosts([...nextPosts].sort((a, b) => {
            const aDate = Date.parse(a.published_at ?? a.created_at ?? "") || 0;
            const bDate = Date.parse(b.published_at ?? b.created_at ?? "") || 0;
            return bDate - aDate;
          }));
        }
      })
      .catch(() => { if (active) setFailed(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const title = (post: BlogSummary) => language === "ar" ? post.title_ar : post.title_en;
  const excerpt = (post: BlogSummary) => language === "ar" ? post.excerpt_ar : post.excerpt_en;

  return (
    <section className="journal-page routed-page">
      <header className="journal-masthead content-wrap">
        <div><p>{copy.kicker}</p><h1>{copy.title}</h1></div>
        <div className="journal-masthead-copy">
          <span>{copy.intro}</span>
          {!loading && !failed && posts.length ? <small><b>{String(posts.length).padStart(2, "0")}</b> {copy.count}</small> : null}
        </div>
      </header>

      {loading ? <div className="journal-state content-wrap" aria-label="Loading"><i /><i /><i /><i /></div> : null}
      {!loading && failed ? <p className="journal-message content-wrap" role="alert">{copy.error}</p> : null}
      {!loading && !failed && posts.length === 0 ? <p className="journal-message content-wrap">{copy.empty}</p> : null}

      {posts.length ? (
        <div className="journal-grid journal-archive-grid content-wrap">
          {posts.map((post) => {
            const publishedDate = post.published_at ?? post.created_at;
            return (
              <article className="journal-card" key={post.id}>
                <Link className="journal-card-media" to={`/journal/${post.slug}`} aria-label={title(post)}>
                  <img src={post.image_url} alt={title(post)} loading="lazy" decoding="async" />
                </Link>
                <div className="journal-card-copy">
                  {publishedDate ? <time dateTime={publishedDate}>{formatDate(publishedDate, language)}</time> : null}
                  <h2><Link to={`/journal/${post.slug}`}>{title(post)}</Link></h2>
                  <p>{excerpt(post).split(" ").slice(0, 10).join(" ") + "..."}</p>
                  <Link className="journal-read-more" to={`/journal/${post.slug}`}>{copy.read}<span aria-hidden="true">&#8599;</span></Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}