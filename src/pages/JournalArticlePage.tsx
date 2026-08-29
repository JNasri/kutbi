import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { apiRequest } from '../lib/api';
import type { Language } from '../siteContent';
import type { BlogPost } from '../types/blog';

const labels = {
  ar: {
    journal: 'مجلة الكتبي',
    back: 'العودة إلى المجلة',
    gallery: 'من الحدث',
    published: 'نُشر في',
    story: 'قصة من مجموعة الكتبي',
    error: 'لم نتمكن من العثور على هذه القصة.',
  },
  en: {
    journal: 'Alkutbi Journal',
    back: 'Back to the journal',
    gallery: 'From the event',
    published: 'Published',
    story: 'A story from Alkutbi Group',
    error: 'We could not find this journal story.',
  },
};

const formatDate = (value: string | null | undefined, language: Language) =>
  value
    ? new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(value))
    : '';

export default function JournalArticlePage({ language }: { language: Language }) {
  const { slug = '' } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const copy = labels[language];

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest<{ post: BlogPost }>(`/api/blogs/${encodeURIComponent(slug)}`)
      .then(({ post: nextPost }) => { if (active) setPost(nextPost); })
      .catch(() => { if (active) setPost(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  const title = post ? (language === 'ar' ? post.title_ar : post.title_en) : '';
  const excerpt = post ? (language === 'ar' ? post.excerpt_ar : post.excerpt_en) : '';
  const article = post ? (language === 'ar' ? post.content_ar : post.content_en) : '';
  const paragraphs = article.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);

  useEffect(() => {
    if (title) document.title = `${title} | ${copy.journal}`;
  }, [copy.journal, title]);

  if (loading) return <section className="journal-article routed-page"><div className="journal-article-loading" aria-label="Loading" /></section>;
  if (!post) return <section className="journal-article routed-page"><div className="journal-not-found content-wrap"><p>{copy.error}</p><Link to="/journal">{copy.back}</Link></div></section>;

  const publishedDate = post.published_at ?? post.created_at;

  return (
    <article className="journal-article routed-page">
      <header className="article-intro">
        <div className="article-intro-grid content-wrap">
          <div className="article-heading">
            <Link to="/journal"><span aria-hidden="true">←</span>{copy.journal}</Link>
            <div className="article-meta">
              <span>{copy.story}</span>
              {publishedDate ? <time dateTime={publishedDate}>{copy.published} · {formatDate(publishedDate, language)}</time> : null}
            </div>
            <h1>{title}</h1>
            <p>{excerpt}</p>
          </div>
          <figure className="article-cover">
            <img src={post.image_url} alt={title} />
          </figure>
        </div>
      </header>

      <div className="article-body content-wrap">
        <aside><span>ALKUTBI</span><i /><b>JOURNAL</b></aside>
        <div className="article-prose">
          {paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>)}
        </div>
      </div>

      {post.gallery_images?.length ? (
        <section className="article-gallery content-wrap" aria-labelledby="article-gallery-title">
          <header><small>{String(post.gallery_images.length).padStart(2, '0')}</small><h2 id="article-gallery-title">{copy.gallery}</h2></header>
          <div>{post.gallery_images.map((image, index) => <figure key={image}><img src={image} alt={`${title} ${index + 1}`} loading="lazy" /></figure>)}</div>
        </section>
      ) : null}

      <footer className="article-back content-wrap"><Link to="/journal"><span aria-hidden="true">←</span>{copy.back}</Link></footer>
    </article>
  );
}