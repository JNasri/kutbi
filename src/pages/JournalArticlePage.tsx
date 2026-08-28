import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { apiRequest } from '../lib/api';
import type { Language } from '../siteContent';
import type { BlogPost } from '../types/blog';

const labels = {
  ar: { journal: '\u0627\u0644\u0645\u062c\u0644\u0629', back: '\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0645\u062c\u0644\u0629', gallery: '\u0645\u0646 \u0627\u0644\u0631\u062d\u0644\u0629', error: '\u0644\u0645 \u0646\u062a\u0645\u0643\u0646 \u0645\u0646 \u0627\u0644\u0639\u062b\u0648\u0631 \u0639\u0644\u0649 \u0647\u0630\u0647 \u0627\u0644\u0642\u0635\u0629.' },
  en: { journal: 'Alkutbi Journal', back: 'Back to the journal', gallery: 'From the journey', error: 'We could not find this journal story.' },
};

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

  return (
    <article className="journal-article routed-page">
      <header className="article-hero">
        <img src={post.image_url} alt={title} />
        <div className="article-hero-shade" />
        <div className="article-heading content-wrap">
          <Link to="/journal">{copy.journal}</Link>
          <h1>{title}</h1>
          <p>{excerpt}</p>
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

      <footer className="article-back content-wrap"><Link to="/journal"><span aria-hidden="true">\u2190</span>{copy.back}</Link></footer>
    </article>
  );
}