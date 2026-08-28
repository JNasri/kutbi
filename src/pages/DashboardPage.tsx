import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import Logo from '../components/Logo';
import { ApiError, apiRequest } from '../lib/api';
import type { BlogInput, BlogPost } from '../types/blog';

const createEmptyPost = (): BlogInput => ({
  slug: '', title_ar: '', title_en: '', excerpt_ar: '', excerpt_en: '',
  content_ar: '', content_en: '', image_url: '', gallery_images: [], status: 'draft',
});

const slugPattern = /[^a-z0-9]+/g;
const createSlug = (value: string) => value.toLowerCase().trim().replace(slugPattern, '-').replace(/^-|-$/g, '');
const imageAccept = 'image/jpeg,image/png,image/webp,image/avif';

type UploadResponse = { mainImage: string | null; galleryImages: string[] };

export default function DashboardPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<BlogInput>(createEmptyPost);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.title = 'Journal dashboard | Alkutbi Group';
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
    setDraft(createEmptyPost());
    setMessage('');
    setError('');
    document.querySelector('#post-editor')?.scrollIntoView({ behavior: 'smooth' });
  }

  function beginEdit(post: BlogPost) {
    setEditingId(post.id);
    setDraft({
      slug: post.slug, title_ar: post.title_ar, title_en: post.title_en,
      excerpt_ar: post.excerpt_ar, excerpt_en: post.excerpt_en,
      content_ar: post.content_ar, content_en: post.content_en,
      image_url: post.image_url, gallery_images: post.gallery_images ?? [], status: post.status ?? 'draft',
    });
    setMessage('');
    setError('');
    document.querySelector('#post-editor')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function uploadImages(field: 'mainImage' | 'galleryImages', files: FileList | null) {
    if (!files?.length) return;
    const isMain = field === 'mainImage';
    if (!isMain && draft.gallery_images.length + files.length > 10) {
      setError('A journal can contain up to 10 gallery images.');
      return;
    }
    isMain ? setUploadingMain(true) : setUploadingGallery(true);
    setError('');
    setMessage('');
    try {
      const body = new FormData();
      Array.from(files).forEach((file) => body.append(field, file));
      const uploaded = await apiRequest<UploadResponse>('/api/admin/uploads', { method: 'POST', body });
      setDraft((current) => ({
        ...current,
        image_url: uploaded.mainImage ?? current.image_url,
        gallery_images: [...current.gallery_images, ...uploaded.galleryImages].slice(0, 10),
      }));
      setMessage(isMain ? 'Main image uploaded.' : `${uploaded.galleryImages.length} gallery image${uploaded.galleryImages.length === 1 ? '' : 's'} uploaded.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to upload the image.');
    } finally {
      isMain ? setUploadingMain(false) : setUploadingGallery(false);
    }
  }

  function handleImageSelection(field: 'mainImage' | 'galleryImages') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      void uploadImages(field, event.target.files);
      event.target.value = '';
    };
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.image_url) {
      setError('Upload a main image before saving the journal.');
      return;
    }
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const path = editingId ? `/api/admin/blogs/${editingId}` : '/api/admin/blogs';
      await apiRequest(path, { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(draft) });
      const { posts: refreshedPosts } = await apiRequest<{ posts: BlogPost[] }>('/api/admin/blogs');
      const successMessage = editingId ? 'Journal updated successfully.' : 'Journal created successfully.';
      setPosts(refreshedPosts);
      setEditingId(null);
      setDraft(createEmptyPost());
      setMessage(successMessage);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save the journal.');
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(post: BlogPost) {
    if (!window.confirm(`Delete “${post.title_en}” and its locally stored images? This cannot be undone.`)) return;
    try {
      await apiRequest(`/api/admin/blogs/${post.id}`, { method: 'DELETE' });
      setPosts((current) => current.filter((item) => item.id !== post.id));
      if (editingId === post.id) beginCreate();
      setMessage('Journal deleted.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete the journal.');
    }
  }

  async function logout() {
    await apiRequest('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    navigate('/login', { replace: true });
  }

  const publishedCount = posts.filter((post) => post.status === 'published').length;
  const busy = saving || uploadingMain || uploadingGallery;

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <a className="admin-brand" href="/"><Logo /><span>ALKUTBI<br />ADMIN</span></a>
        <nav><a className="active" href="#posts">Journals</a><a href="/journal" target="_blank" rel="noreferrer">View journal ↗</a></nav>
        <div className="admin-user"><span>{user?.username?.slice(0, 1).toUpperCase() ?? 'A'}</span><div><b>{user?.username ?? 'Admin'}</b><small>Administrator</small></div></div>
        <button type="button" onClick={logout}>Sign out</button>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header"><div><p>CONTENT STUDIO</p><h1>Journal</h1></div><button className="admin-primary-button" type="button" onClick={beginCreate}>New journal <span>＋</span></button></header>
        <section className="dashboard-metrics" aria-label="Journal summary"><article><span>{posts.length}</span><p>Total journals</p></article><article><span>{publishedCount}</span><p>Published</p></article><article><span>{posts.length - publishedCount}</span><p>Drafts</p></article></section>

        {message ? <p className="dashboard-notice success" role="status">{message}</p> : null}
        {error ? <p className="dashboard-notice error" role="alert">{error}</p> : null}

        <section id="posts" className="post-library" aria-labelledby="library-title">
          <div className="dashboard-section-title"><h2 id="library-title">Journal library</h2><span>{posts.length} entries</span></div>
          {loading ? <p className="dashboard-empty">Loading journals…</p> : posts.length === 0 ? <p className="dashboard-empty">No journals yet. Create the first entry below.</p> : (
            <div className="admin-post-list">{posts.map((post) => <article className="admin-post-row" key={post.id}>
              <img src={post.image_url} alt="" />
              <div><span className={`status-pill ${post.status}`}>{post.status}</span><h3>{post.title_en}</h3><p dir="rtl">{post.title_ar}</p></div>
              <small>{post.updated_at ? new Date(post.updated_at).toLocaleDateString() : '—'}</small>
              <div className="row-actions"><button type="button" onClick={() => beginEdit(post)}>Edit</button><button className="danger" type="button" onClick={() => deletePost(post)}>Delete</button></div>
            </article>)}</div>
          )}
        </section>

        <section id="post-editor" className="post-editor" aria-labelledby="editor-title">
          <div className="dashboard-section-title"><div><p>{editingId ? 'EDITING' : 'NEW ENTRY'}</p><h2 id="editor-title">{editingId ? 'Update journal' : 'Create a journal'}</h2></div><button type="button" onClick={beginCreate}>Clear form</button></div>
          <form className="admin-form editor-form" onSubmit={savePost}>
            <div className="editor-grid">
              <label>English title<input value={draft.title_en} onChange={(event) => setDraft((value) => ({ ...value, title_en: event.target.value, slug: value.slug || createSlug(event.target.value) }))} required /></label>
              <label dir="rtl">العنوان العربي<input value={draft.title_ar} onChange={(event) => setDraft((value) => ({ ...value, title_ar: event.target.value }))} required /></label>
              <label className="editor-span-two">Slug<input dir="ltr" value={draft.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" onChange={(event) => setDraft((value) => ({ ...value, slug: createSlug(event.target.value) }))} required /></label>

              <section className="editor-media-block editor-span-two" aria-labelledby="main-image-title">
                <div><p>MAIN IMAGE</p><h3 id="main-image-title">Journal cover</h3><span>This image appears in the homepage carousel and journal listing.</span></div>
                {draft.image_url ? <figure className="admin-main-preview"><img src={draft.image_url} alt="Current journal cover" /></figure> : <div className="admin-image-placeholder">No cover uploaded</div>}
                <label className="admin-upload-control"><input type="file" accept={imageAccept} onChange={handleImageSelection('mainImage')} disabled={uploadingMain} /><b>{uploadingMain ? 'Uploading…' : draft.image_url ? 'Replace main image' : 'Upload main image'}</b><small>JPG, PNG, WebP, or AVIF · maximum 12 MB</small></label>
              </section>

              <label>English excerpt<textarea rows={4} maxLength={600} value={draft.excerpt_en} onChange={(event) => setDraft((value) => ({ ...value, excerpt_en: event.target.value }))} required /></label>
              <label dir="rtl">الملخص العربي<textarea rows={4} maxLength={600} value={draft.excerpt_ar} onChange={(event) => setDraft((value) => ({ ...value, excerpt_ar: event.target.value }))} required /></label>
              <label>English article<textarea rows={14} placeholder="Separate paragraphs with a blank line." value={draft.content_en} onChange={(event) => setDraft((value) => ({ ...value, content_en: event.target.value }))} required /></label>
              <label dir="rtl">المقال بالعربية<textarea rows={14} placeholder="افصل بين الفقرات بسطر فارغ." value={draft.content_ar} onChange={(event) => setDraft((value) => ({ ...value, content_ar: event.target.value }))} required /></label>

              <section className="editor-media-block editor-span-two" aria-labelledby="gallery-title">
                <div><p>ARTICLE GALLERY</p><h3 id="gallery-title">Supporting images</h3><span>Add up to 10 images. They will appear throughout the article after the written details.</span></div>
                {draft.gallery_images.length > 0 ? <div className="admin-gallery-grid">{draft.gallery_images.map((image, index) => <figure key={image}><img src={image} alt={`Gallery ${index + 1}`} /><button type="button" onClick={() => setDraft((current) => ({ ...current, gallery_images: current.gallery_images.filter((item) => item !== image) }))} aria-label={`Remove gallery image ${index + 1}`}>×</button><span>{String(index + 1).padStart(2, '0')}</span></figure>)}</div> : <div className="admin-image-placeholder compact">No supporting images uploaded</div>}
                <label className="admin-upload-control"><input type="file" accept={imageAccept} multiple onChange={handleImageSelection('galleryImages')} disabled={uploadingGallery || draft.gallery_images.length >= 10} /><b>{uploadingGallery ? 'Uploading…' : 'Add gallery images'}</b><small>{draft.gallery_images.length} / 10 images</small></label>
              </section>
            </div>
            <div className="editor-footer"><label>Status<select value={draft.status} onChange={(event) => setDraft((value) => ({ ...value, status: event.target.value as BlogInput['status'] }))}><option value="draft">Draft</option><option value="published">Published</option></select></label><button className="admin-primary-button" disabled={busy}>{saving ? 'Saving…' : uploadingMain || uploadingGallery ? 'Uploading images…' : editingId ? 'Save changes' : 'Create journal'}<span>↗</span></button></div>
          </form>
        </section>
      </div>
    </main>
  );
}