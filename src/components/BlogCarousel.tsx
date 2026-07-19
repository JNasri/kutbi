import { useEffect, useState } from 'react';
import type { Language } from '../siteContent';
import type { BlogPost } from '../types/blog';
import { apiRequest } from '../lib/api';

const fallbackPosts: BlogPost[] = [
  {
    id: -1, slug: 'saudi-welcome', image_url: '/images/saudi-atlas.jpg',
    title_ar: 'رحلة تبدأ بحفاوة سعودية', title_en: 'A journey shaped by Saudi hospitality',
    excerpt_ar: 'قصص ونصائح ملهمة تساعد ضيوف المملكة على صناعة رحلة أكثر ثراءً وراحة.',
    excerpt_en: 'Stories and practical inspiration for a richer, more comfortable journey across the Kingdom.',
    content_ar: '', content_en: '',
  },
  {
    id: -2, slug: 'travel-in-comfort', image_url: '/images/bus-fleet.jpg',
    title_ar: 'تنقّل بثقة وراحة', title_en: 'Travel with confidence and comfort',
    excerpt_ar: 'تعرّف على أسطولنا وكيف نخطط لكل انتقال بعناية من الوصول وحتى المغادرة.',
    excerpt_en: 'Discover how our fleet supports every transfer, from arrival through departure.',
    content_ar: '', content_en: '',
  },
  {
    id: -3, slug: 'discover-saudi', image_url: '/images/hero-city.png',
    title_ar: 'اكتشف وجهًا جديدًا للمملكة', title_en: 'Discover a new side of Saudi Arabia',
    excerpt_ar: 'وجهات دينية وثقافية وطبيعية مختارة لتمنح كل رحلة معنى لا يُنسى.',
    excerpt_en: 'Religious, cultural, and natural destinations selected for unforgettable journeys.',
    content_ar: '', content_en: '',
  },
];

export default function BlogCarousel({ language }: { language: Language }) {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiRequest<{ posts: BlogPost[] }>('/api/blogs')
      .then(({ posts: publishedPosts }) => {
        if (!cancelled && publishedPosts.length > 0) setPosts(publishedPosts);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (paused || posts.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % posts.length);
    }, 5_500);
    return () => window.clearInterval(timer);
  }, [paused, posts.length]);

  const post = posts[activeIndex] ?? posts[0];
  const title = language === 'ar' ? post.title_ar : post.title_en;
  const excerpt = language === 'ar' ? post.excerpt_ar : post.excerpt_en;

  return (
    <aside
      className="hero-blog reveal-item"
      aria-label={language === 'ar' ? 'أحدث القصص' : 'Latest stories'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-blog-image" key={`${post.id}-image`}>
        <img src={post.image_url} alt="" />
        <span>{language === 'ar' ? 'من مدونتنا' : 'From our journal'}</span>
      </div>
      <div className="hero-blog-copy" key={`${post.id}-copy`}>
        <small>{String(activeIndex + 1).padStart(2, '0')} / {String(posts.length).padStart(2, '0')}</small>
        <h2>{title}</h2>
        <p>{excerpt}</p>
      </div>
      <div className="hero-blog-controls" aria-label={language === 'ar' ? 'اختيار القصة' : 'Choose story'}>
        {posts.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={index === activeIndex ? 'active' : ''}
            onClick={() => setActiveIndex(index)}
            aria-label={`${language === 'ar' ? 'القصة' : 'Story'} ${index + 1}`}
            aria-current={index === activeIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </aside>
  );
}

