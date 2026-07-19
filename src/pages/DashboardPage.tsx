import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import Logo from '../components/Logo';
import { ApiError, apiRequest } from '../lib/api';
import type { BlogInput, BlogPost } from '../types/blog';

const emptyPost: BlogInput = {
  slug: '', title_ar: '', title_en: '', excerpt_ar: '', excerpt_en: '',
  content_ar: '', content_en: '', image_url: '', status: 'draft',
};

const slugPattern = /[^a-z0-9]+/g;
const createSlug = (value: string) => value.toLowerCase().trim().replace(slugPattern, '-').replace(/^-|-$/g, '');

export default function DashboardPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<BlogInput>(emptyPost);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.title = 'Blog dashboard | Alkutbi Group';
    Promise.all([
      apiRequest<{ user: { id: number; username: string } | null }>('/api/auth/session'),
      apiRequest<{ posts: BlogPost[] }>('/api/admin/blogs'),
    ]).then(([session, blogData]) => {
      if (!session.user) {
        navigate('/login', { replace: true });
        return;
      }
      setUser(session.user);
      setPosts(blogData.posts);
    }).catch((requestError) => {
      if (requestError instanceof ApiError && requestError.status === 401) navigate('/login', { replace: true });
      else setError(requestError instanceof Error ? requestError.message : 'Unable to load the dashboard.');
    }).finally(() => setLoading(false));
  }, [navigate]);

  function beginCreate() {
    setEditingId(null);
    setDraft(emptyPost);
    setMessage('');
    document.querySelector('#post-editor')?.scrollIntoView({ behavior: 'smooth' });
  }

  function beginEdit(post: BlogPost) {
    setEditingId(post.id);
    setDraft({
      slug: post.slug, title_ar: post.title_ar, title_en: post.title_en,
      excerpt_ar: post.excerpt_ar, excerpt_en: post.excerpt_en,
      content_ar: post.content_ar, content_en: post.content_en,
      image_url: post.image_url, status: post.status ?? 'draft',
    });
    setMessage('');
    document.querySelector('#post-editor')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const path = editingId ? `/api/admin/blogs/${editingId}` : '/api/admin/blogs';
      await apiRequest(path, { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(draft) });
      const { posts: refreshedPosts } = await apiRequest<{ posts: BlogPost[] }>('/api/admin/blogs');
      setPosts(refreshedPosts);
      setEditingId(null);
      setDraft(emptyPost);
      setMessage(editingId ? 'Post updated successfully.' : 'Post created successfully.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save the post.');
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(post: BlogPost) {
    if (!window.confirm(`Delete “${post.title_en}”? This cannot be undone.`)) return;
    try {
      await apiRequest(`/api/admin/blogs/${post.id}`, { method: 'DELETE' });
      setPosts((current) => current.filter((item) => item.id !== post.id));
      if (editingId === post.id) beginCreate();
      setMessage('Post deleted.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete the post.');
    }
  }

  async function logout() {
    await apiRequest('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    navigate('/login', { replace: true });
  }

  const publishedCount = posts.filter((post) => post.status === 'published').length;

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <a className="admin-brand" href="/"><Logo /><span>ALKUTBI<br />ADMIN</span></a>
        <nav><a className="active" href="#posts">Stories</a><a href="/" target="_blank" rel="noreferrer">View website ↗</a></nav>
        <div className="admin-user"><span>{user?.username?.slice(0, 1).toUpperCase() ?? 'A'}</span><div><b>{user?.username ?? 'Admin'}</b><small>Administrator</small></div></div>
        <button type="button" onClick={logout}>Sign out</button>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header"><div><p>CONTENT STUDIO</p><h1>Stories</h1></div><button className="admin-primary-button" type="button" onClick={beginCreate}>New story <span>＋</span></button></header>
        <section className="dashboard-metrics" aria-label="Blog summary"><article><span>{posts.length}</span><p>Total stories</p></article><article><span>{publishedCount}</span><p>Published</p></article><article><span>{posts.length - publishedCount}</span><p>Drafts</p></article></section>

        {message ? <p className="dashboard-notice success" role="status">{message}</p> : null}
        {error ? <p className="dashboard-notice error" role="alert">{error}</p> : null}

        <section id="posts" className="post-library" aria-labelledby="library-title">
          <div className="dashboard-section-title"><h2 id="library-title">Post library</h2><span>{posts.length} entries</span></div>
          {loading ? <p className="dashboard-empty">Loading stories…</p> : posts.length === 0 ? <p className="dashboard-empty">No stories yet. Create the first post below.</p> : (
            <div className="admin-post-list">{posts.map((post) => <article className="admin-post-row" key={post.id}>
              <img src={post.image_url} alt="" />
              <div><span className={`status-pill ${post.status}`}>{post.status}</span><h3>{post.title_en}</h3><p dir="rtl">{post.title_ar}</p></div>
              <small>{post.updated_at ? new Date(post.updated_at).toLocaleDateString() : '—'}</small>
              <div className="row-actions"><button type="button" onClick={() => beginEdit(post)}>Edit</button><button className="danger" type="button" onClick={() => deletePost(post)}>Delete</button></div>
            </article>)}</div>
          )}
        </section>

        <section id="post-editor" className="post-editor" aria-labelledby="editor-title">
          <div className="dashboard-section-title"><div><p>{editingId ? 'EDITING' : 'NEW ENTRY'}</p><h2 id="editor-title">{editingId ? 'Update story' : 'Create a story'}</h2></div><button type="button" onClick={beginCreate}>Clear form</button></div>
          <form className="admin-form editor-form" onSubmit={savePost}>
            <div className="editor-grid">
              <label>English title<input value={draft.title_en} onChange={(event) => setDraft((value) => ({ ...value, title_en: event.target.value, slug: value.slug || createSlug(event.target.value) }))} required /></label>
              <label dir="rtl">العنوان العربي<input value={draft.title_ar} onChange={(event) => setDraft((value) => ({ ...value, title_ar: event.target.value }))} required /></label>
              <label>Slug<input dir="ltr" value={draft.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" onChange={(event) => setDraft((value) => ({ ...value, slug: createSlug(event.target.value) }))} required /></label>
              <label>Image URL<input dir="ltr" type="text" placeholder="/images/story.jpg or https://…" value={draft.image_url} onChange={(event) => setDraft((value) => ({ ...value, image_url: event.target.value }))} required /></label>
              <label>English excerpt<textarea rows={3} maxLength={600} value={draft.excerpt_en} onChange={(event) => setDraft((value) => ({ ...value, excerpt_en: event.target.value }))} required /></label>
              <label dir="rtl">الملخص العربي<textarea rows={3} maxLength={600} value={draft.excerpt_ar} onChange={(event) => setDraft((value) => ({ ...value, excerpt_ar: event.target.value }))} required /></label>
              <label>English content<textarea rows={8} value={draft.content_en} onChange={(event) => setDraft((value) => ({ ...value, content_en: event.target.value }))} /></label>
              <label dir="rtl">المحتوى العربي<textarea rows={8} value={draft.content_ar} onChange={(event) => setDraft((value) => ({ ...value, content_ar: event.target.value }))} /></label>
            </div>
            <div className="editor-footer"><label>Status<select value={draft.status} onChange={(event) => setDraft((value) => ({ ...value, status: event.target.value as BlogInput['status'] }))}><option value="draft">Draft</option><option value="published">Published</option></select></label><button className="admin-primary-button" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create story'}<span>↗</span></button></div>
          </form>
        </section>
      </div>
    </main>
  );
}

