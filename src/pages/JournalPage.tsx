import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiRequest } from "../lib/api";
import type { Language } from "../siteContent";
import type { BlogPost } from "../types/blog";

const ui = {
  ar: {
    kicker: "من مجموعة الكتبي",
    title: "مجلة الكتبي",
    intro: "مشاركاتنا، فعالياتنا وآخر أماكن تواجدنا.",
    count: "قصة منشورة",
    read: "اقرأ المزيد",
    empty: "سننشر أولى قصصنا قريبًا.",
    error: "تعذر تحميل المجلة الآن.",
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

  const title = (post: BlogPost) =>
    language === "ar" ? post.title_ar : post.title_en;
  const excerpt = (post: BlogPost) =>
    language === "ar" ? post.excerpt_ar : post.excerpt_en;

  return (
    <section className="journal-page routed-page">
      <header className="journal-masthead content-wrap">
        <div>
          <p>{copy.kicker}</p>
          <h1>{copy.title}</h1>
        </div>
        <div className="journal-masthead-copy">
          <span>{copy.intro}</span>
          {!loading && !failed && posts.length ? (
            <small>
              <b>{String(posts.length).padStart(2, "0")}</b> {copy.count}
            </small>
          ) : null}
        </div>
      </header>

      {loading ? (
        <div className="journal-state content-wrap" aria-label="Loading">
          <i />
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
      {!loading && !failed && posts.length === 0 ? (
        <p className="journal-message content-wrap">{copy.empty}</p>
      ) : null}

      {posts.length ? (
        <div className="journal-grid journal-archive-grid content-wrap">
          {posts.map((post) => {
            const publishedDate = post.published_at ?? post.created_at;
            return (
              <article className="journal-card" key={post.id}>
                <Link
                  className="journal-card-media"
                  to={`/journal/${post.slug}`}
                  aria-label={title(post)}
                >
                  <img src={post.image_url} alt={title(post)} loading="lazy" />
                </Link>
                <div className="journal-card-copy">
                  {publishedDate ? (
                    <time dateTime={publishedDate}>
                      {formatDate(publishedDate, language)}
                    </time>
                  ) : null}
                  <h2>
                    <Link to={`/journal/${post.slug}`}>{title(post)}</Link>
                  </h2>
                  <p>
                    {excerpt(post).split(" ").slice(0, 10).join(" ") + "..."}
                  </p>
                  <Link
                    className="journal-read-more"
                    to={`/journal/${post.slug}`}
                  >
                    {copy.read}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
