import AdminForm from '../components/AdminForm';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { FiArrowLeft, FiBookOpen, FiChevronDown, FiEdit2, FiExternalLink, FiGrid, FiLogOut, FiPackage, FiPlus, FiSearch, FiTag, FiTrash2 } from 'react-icons/fi';
import Logo from '../components/Logo';
import { useAdmin } from '../components/AdminLayout';
import LoadingScreen from '../components/LoadingScreen';
import PublicationDatePicker from '../components/PublicationDatePicker';
import CatalogManager from '../components/CatalogManager';
import type { CatalogKind } from '../../shared/catalog';
import { ApiError, apiRequest } from '../lib/api';
import { createJournalSlug } from '../lib/journalSlug';
import type { BlogInput, BlogPost } from '../types/blog';

const createEmptyPost = (): BlogInput => ({
  slug: '', title_ar: '', title_en: '', excerpt_ar: '', excerpt_en: '',
  content_ar: '', content_en: '', image_url: '', gallery_images: [], status: 'draft',
  published_at: new Date().toISOString(),
});

const imageAccept = 'image/jpeg,image/png,image/webp,image/avif';

type UploadResponse = { mainImage: string | null; galleryImages: string[] };

export default function DashboardPage() {
  const navigate = useNavigate();
  const { language, t } = useAdmin();
  const [expandedSection, setExpandedSection] = useState<'journals' | CatalogKind | null>('journals');
  const [section, setSection] = useState<'journals' | CatalogKind>('journals');
  const [catalogView, setCatalogView] = useState<'list' | 'create' | 'edit'>('list');
  const [catalogRevision, setCatalogRevision] = useState(0);
  const [catalogOperation, setCatalogOperation] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [view, setView] = useState<'library' | 'editor'>('library');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<BlogInput>(createEmptyPost);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { document.title = `${t('Journals')} | ${t('Alkutbi Group')}`; }, [language]);

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest<{ user: { id: number; username: string } | null }>('/api/auth/session'),
      apiRequest<{ posts: BlogPost[] }>('/api/admin/blogs'),
    ]).then(([session, blogData]) => {
      if (!active) return;
      if (!session.user) {
        navigate('/login', { replace: true });
        return;
      }
      setUser(session.user);
      setPosts(blogData.posts);
    }).catch((requestError) => {
      if (!active) return;
      if (requestError instanceof ApiError && requestError.status === 401) navigate('/login', { replace: true });
      else setError(requestError instanceof Error ? requestError.message : 'Unable to load the dashboard.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [navigate]);

  function beginCreate() {
    setSection('journals'); setExpandedSection('journals');
    setEditingId(null);
    setDraft(createEmptyPost());
    setMessage('');
    setError('');
    setView('editor');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function beginEdit(post: BlogPost) {
    setEditingId(post.id);
    setDraft({
      slug: post.slug, title_ar: post.title_ar, title_en: post.title_en,
      excerpt_ar: post.excerpt_ar, excerpt_en: post.excerpt_en,
      content_ar: post.content_ar, content_en: post.content_en,
      image_url: post.image_url, gallery_images: post.gallery_images ?? [], status: post.status ?? 'draft',
      published_at: post.published_at ?? post.created_at ?? new Date().toISOString(),
    });
    setMessage('');
    setError('');
    setView('editor');
    window.scrollTo({ top: 0, behavior: 'instant' });
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
      setMessage(isMain ? 'Main image uploaded.' : 'Gallery images uploaded.');
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
      const payload = {
        ...draft,
        slug: draft.slug || createJournalSlug(draft.title_en) || `journal-${crypto.randomUUID()}`,
      };
      await apiRequest(path, { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      const { posts: refreshedPosts } = await apiRequest<{ posts: BlogPost[] }>('/api/admin/blogs');
      const successMessage = editingId ? 'Journal updated successfully.' : 'Journal created successfully.';
      setPosts(refreshedPosts);
      setEditingId(null);
      setDraft(createEmptyPost());
      setMessage(successMessage);
      setView('library');
      setSearch('');
      setFilter('all');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save the journal.');
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(post: BlogPost) {
    if (!window.confirm(t('This journal and its images will be permanently deleted. Continue?'))) return;
    setDeleting(true);
    setError('');
    try {
      await apiRequest(`/api/admin/blogs/${post.id}`, { method: 'DELETE' });
      setPosts((current) => current.filter((item) => item.id !== post.id));
      if (editingId === post.id) {
        setEditingId(null);
        setDraft(createEmptyPost());
      }
      setMessage('Journal deleted.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete the journal.');
    } finally { setDeleting(false); }
  }

  async function logout() {
    setSigningOut(true);
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
      navigate('/login', { replace: true });
    } catch { setError('Unable to sign out.'); }
    finally { setSigningOut(false); }
  }

  const publishedCount = posts.filter((post) => post.status === 'published').length;
  const busy = saving || uploadingMain || uploadingGallery || deleting || signingOut || Boolean(catalogOperation);
  const articleSlug = draft.slug || createJournalSlug(draft.title_en);
  const visiblePosts = posts.filter((post) => (
    (filter === 'all' || (post.status ?? 'draft') === filter)
    && `${post.title_en} ${post.title_ar}`.toLowerCase().includes(search.trim().toLowerCase())
  ));

  function showLibrary() {
    setSection('journals'); setExpandedSection('journals');
    setView('library');
    setError('');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function openCatalog(kind: CatalogKind, nextView: 'list' | 'create') {
    setSection(kind); setExpandedSection(kind); setCatalogView(nextView); setCatalogRevision((value) => value + 1);
    setMessage(''); setError(''); window.scrollTo({ top: 0, behavior: 'instant' });
  }

  return (
    <>
    <main className="dashboard-shell dashboard-studio" inert={loading || busy} aria-busy={loading || busy}>
      <aside className="dashboard-sidebar" aria-label={t('Administration')}>
        <a className="admin-brand" href="/" aria-label={t('Alkutbi Group home')}><Logo decorative /><span>{t('Alkutbi Group')}<small>{t('CONTENT STUDIO')}</small></span></a>
        <nav aria-label={t('Content navigation')}>
          {(['journals', 'packages', 'offers'] as const).map((kind) => {
            const expanded = expandedSection === kind;
            const label = kind === 'journals' ? 'Journals' : kind === 'packages' ? 'Packages' : 'Seasonal offers';
            return <div className="sidebar-content-group" key={kind}>
              <button type="button" className="sidebar-accordion-trigger" aria-expanded={expanded} aria-controls={`sidebar-${kind}`} onClick={() => setExpandedSection(expanded ? null : kind)} disabled={busy || loading} title={t(label)}>
                {kind === 'journals' ? <FiBookOpen aria-hidden="true" /> : kind === 'packages' ? <FiPackage aria-hidden="true" /> : <FiTag aria-hidden="true" />}<span>{t(label)}</span><FiChevronDown className="sidebar-accordion-chevron" aria-hidden="true" />
              </button>
              <div id={`sidebar-${kind}`} className="sidebar-accordion-panel" hidden={!expanded}>
                <button type="button" className={section === kind && (kind === 'journals' ? view === 'library' || editingId !== null : catalogView !== 'create') ? 'active' : ''} aria-current={section === kind && (kind === 'journals' ? view === 'library' || editingId !== null : catalogView !== 'create') ? 'page' : undefined} onClick={() => kind === 'journals' ? showLibrary() : openCatalog(kind, 'list')} disabled={busy || loading} title={t(kind === 'journals' ? 'View journals' : kind === 'packages' ? 'View packages' : 'View offers')} aria-label={t(kind === 'journals' ? 'View journals' : kind === 'packages' ? 'View packages' : 'View offers')}><FiGrid aria-hidden="true" /><span>{t(kind === 'journals' ? 'View journals' : kind === 'packages' ? 'View packages' : 'View offers')}</span>{kind === 'journals' ? <b>{posts.length}</b> : null}</button>
                <button type="button" className={section === kind && (kind === 'journals' ? view === 'editor' && editingId === null : catalogView === 'create') ? 'active' : ''} onClick={() => kind === 'journals' ? beginCreate() : openCatalog(kind, 'create')} disabled={busy || loading} title={t(kind === 'journals' ? 'Add journal' : kind === 'packages' ? 'Add package' : 'Add offer')} aria-label={t(kind === 'journals' ? 'Add journal' : kind === 'packages' ? 'Add package' : 'Add offer')}><FiPlus aria-hidden="true" /><span>{t(kind === 'journals' ? 'Add journal' : kind === 'packages' ? 'Add package' : 'Add offer')}</span></button>
              </div>
            </div>;
          })}
        </nav>
        <div className="sidebar-account">
          <div className="admin-user" title={user?.username ?? t('Admin')}><span aria-hidden="true">{user?.username?.slice(0, 1).toUpperCase() ?? 'A'}</span><div><b>{user?.username ?? t('Admin')}</b><small>{t('Administrator')}</small></div></div>
          <button type="button" onClick={logout} disabled={busy} title={t('Sign out')} aria-label={t('Sign out')}><FiLogOut aria-hidden="true" /><span>{t('Sign out')}</span></button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header"><div><p>{t('YOUR CONTENT, BEAUTIFULLY ORGANIZED')}</p><h1>{section === 'journals' ? view === 'library' ? t('Journals') : editingId ? t('Edit journal') : t('Add journal') : t(section === 'packages' ? 'Packages' : 'Seasonal offers')}</h1><span>{section === 'journals' ? view === 'library' ? t('Stories, journeys, and a little inspiration. All in one place.') : t('Bring your next story to life. Save a draft or publish when you are ready.') : t(section === 'packages' ? 'Manage package artwork, prices, features, and every detail in both languages.' : 'Create and update the three seasonal cards shown on the website.')}</span></div><a className="studio-site-link" href="/" target="_blank" rel="noreferrer">{t('View website')} <FiExternalLink aria-hidden="true" /></a></header>

        {message ? <p className="dashboard-notice success" role="status">{t(message)}</p> : null}
        {error ? <p className="dashboard-notice error" role="alert">{t(error)}</p> : null}

        {section !== 'journals' ? <CatalogManager key={`${section}-${catalogRevision}`} kind={section} initialView={catalogView} onViewChange={setCatalogView} onOperation={setCatalogOperation} /> : view === 'library' ? (
        <section id="posts" className="post-library" aria-label={t('Journal library')}>
          <div className="library-toolbar">
            <div className="library-filters" aria-label={t('Filter journals')}>{(['all', 'published', 'draft'] as const).map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item === 'all' ? t('All journals') : item === 'published' ? t('Published') : t('Drafts')}<span>{item === 'all' ? posts.length : item === 'published' ? publishedCount : posts.length - publishedCount}</span></button>)}</div>
            <label className="library-search"><FiSearch aria-hidden="true" /><input type="search" aria-label={t('Search journals')} placeholder={t('Search journals...')} value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          </div>
          <div className="library-list-heading"><span>{t('JOURNAL')}</span><span>{t('MANAGE YOUR STORIES')}</span></div>
          {loading ? <p className="dashboard-empty" role="status">{t('Loading your journals…')}</p> : visiblePosts.length === 0 ? <div className="dashboard-empty"><FiBookOpen aria-hidden="true" /><h2>{posts.length === 0 ? t('Your stories start here') : t('No matching journals')}</h2><p>{posts.length === 0 ? t('Choose Add journal in the sidebar to create your first story.') : t('Try another search or choose a different filter.')}</p></div> : (
            <div className="admin-post-list">{visiblePosts.map((post) => <article className="admin-post-row" key={post.id}>
              <img src={post.image_url} alt="" loading="lazy" />
              <div className="post-row-copy"><span className={`status-pill ${post.status ?? 'draft'}`}>{t(post.status ?? 'draft')}</span><h2 dir={language === 'ar' ? 'rtl' : 'ltr'}>{language === 'ar' ? post.title_ar : post.title_en}</h2><p dir={language === 'ar' ? 'ltr' : 'rtl'}>{language === 'ar' ? post.title_en : post.title_ar}</p><small>{post.published_at || post.created_at ? new Date(post.published_at ?? post.created_at!).toLocaleDateString(language === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : t('Not published yet')}</small></div>
              <div className="row-actions"><button type="button" onClick={() => beginEdit(post)} aria-label={`${t('Edit')} ${language === 'ar' ? post.title_ar : post.title_en}`}><FiEdit2 aria-hidden="true" />{t('Edit journal')}</button><button className="danger" type="button" onClick={() => deletePost(post)} aria-label={`${t('Delete')} ${language === 'ar' ? post.title_ar : post.title_en}`} title={t('Delete journal')}><FiTrash2 aria-hidden="true" /></button></div>
            </article>)}</div>
          )}
          <p className="library-count">{t('Journals')}: <bdi>{visiblePosts.length} / {posts.length}</bdi></p>
        </section>
        ) : (
        <section id="post-editor" className="post-editor" aria-labelledby="editor-title">
          <div className="dashboard-section-title"><div><p>{t('THE STORY')}</p><h2 id="editor-title">{t('Journal details')}</h2></div><button type="button" onClick={showLibrary} disabled={busy}><FiArrowLeft aria-hidden="true" />{t('Back to journals')}</button></div>
          <AdminForm className="admin-form editor-form" onSubmit={savePost}>
            <fieldset className="editor-grid" disabled={busy || loading}>
              <legend className="sr-only">{t('Journal details')}</legend>
              <div className="editor-step editor-span-two"><span>01</span><div><h3>{t('Start with the essentials')}</h3><p>{t('Add a title in both languages and choose a publication date.')}</p></div></div>
              <label>{t('English title')}<input dir="ltr" value={draft.title_en} onChange={(event) => setDraft((value) => ({ ...value, title_en: event.target.value }))} required /></label>
              <label dir="rtl">{t('Arabic title')}<input value={draft.title_ar} onChange={(event) => setDraft((value) => ({ ...value, title_ar: event.target.value }))} required /></label>
              <PublicationDatePicker value={draft.published_at} onChange={(published_at) => setDraft((value) => ({ ...value, published_at }))} required={draft.status === 'published'} disabled={busy || loading} />

              <label className="editor-span-two">{t('Article URL (automatic)')}
                <input dir="ltr" value={articleSlug ? `/journal/${articleSlug}` : ''} placeholder={t('Generated from the English title when you save.')} readOnly />
                <small>{t('The URL ending is called a slug. Existing article URLs stay the same when you edit the title.')}</small>
              </label>

              <div className="editor-step editor-span-two"><span>02</span><div><h3>{t('Give it a cover')}</h3><p>{t('Choose a photo that makes readers want to explore.')}</p></div></div>
              <section className="editor-media-block editor-span-two" aria-labelledby="main-image-title">
                <div><p>{t('MAIN IMAGE')}</p><h3 id="main-image-title">{t('Journal cover')}</h3><span>{t('This image appears in the homepage carousel and journal listing.')}</span></div>
                {draft.image_url ? <figure className="admin-main-preview"><img src={draft.image_url} alt={t('Current journal cover')} /></figure> : <div className="admin-image-placeholder">{t('No cover uploaded')}</div>}
                <label className="admin-upload-control"><input type="file" accept={imageAccept} onChange={handleImageSelection('mainImage')} disabled={uploadingMain} /><b>{uploadingMain ? t('Uploading images…') : draft.image_url ? t('Replace main image') : t('Upload main image')}</b><small>{t('JPG, PNG, WebP, or AVIF · maximum 12 MB')}</small></label>
              </section>

              <div className="editor-step editor-span-two"><span>03</span><div><h3>{t('Tell your story')}</h3><p>{t('Write a short introduction, then the full article in each language.')}</p></div></div>
              <label>{t('English excerpt')}<textarea dir="ltr" rows={4} maxLength={600} value={draft.excerpt_en} onChange={(event) => setDraft((value) => ({ ...value, excerpt_en: event.target.value }))} required /></label>
              <label dir="rtl">{t('Arabic excerpt')}<textarea rows={4} maxLength={600} value={draft.excerpt_ar} onChange={(event) => setDraft((value) => ({ ...value, excerpt_ar: event.target.value }))} required /></label>
              <label>{t('English article')}<textarea dir="ltr" rows={14} placeholder={t('Separate paragraphs with a blank line.')} value={draft.content_en} onChange={(event) => setDraft((value) => ({ ...value, content_en: event.target.value }))} required /></label>
              <label dir="rtl">{t('Arabic article')}<textarea rows={14} placeholder={t('Separate paragraphs with a blank line.')} value={draft.content_ar} onChange={(event) => setDraft((value) => ({ ...value, content_ar: event.target.value }))} required /></label>

              <div className="editor-step editor-span-two"><span>04</span><div><h3>{t('A little more to see')}</h3><p>{t('Add supporting photos to make the story your own. Optional.')}</p></div></div>
              <section className="editor-media-block editor-span-two" aria-labelledby="gallery-title">
                <div><p>{t('ARTICLE GALLERY')}</p><h3 id="gallery-title">{t('Supporting images')}</h3><span>{t('Add up to 10 images. They will appear throughout the article after the written details.')}</span></div>
                {draft.gallery_images.length > 0 ? <div className="admin-gallery-grid">{draft.gallery_images.map((image, index) => <figure key={image}><img src={image} alt={`${t('Gallery')} ${index + 1}`} /><button type="button" onClick={() => setDraft((current) => ({ ...current, gallery_images: current.gallery_images.filter((item) => item !== image) }))} aria-label={`${t('Remove gallery image')} ${index + 1}`}>×</button><span>{String(index + 1).padStart(2, '0')}</span></figure>)}</div> : <div className="admin-image-placeholder compact">{t('No supporting images uploaded')}</div>}
                <label className="admin-upload-control"><input type="file" accept={imageAccept} multiple onChange={handleImageSelection('galleryImages')} disabled={uploadingGallery || draft.gallery_images.length >= 10} /><b>{uploadingGallery ? t('Uploading images…') : t('Add gallery images')}</b><small>{t('Supporting images')}: <bdi>{draft.gallery_images.length} / 10</bdi></small></label>
              </section>
            </fieldset>
            <div className="editor-footer"><label>{t('Visibility')}<select disabled={busy || loading} value={draft.status} onChange={(event) => setDraft((value) => ({ ...value, status: event.target.value as BlogInput['status'] }))}><option value="draft">{t('Draft - only you can see it')}</option><option value="published">{t('Published - visible on website')}</option></select></label><button className="admin-primary-button" disabled={busy || loading}>{saving ? t('Saving journal…') : uploadingMain || uploadingGallery ? t('Uploading images…') : editingId ? t('Save changes') : draft.status === 'published' ? t('Publish journal') : t('Save draft')}<span>↗</span></button></div>
          </AdminForm>
        </section>
        )}
      </div>
    </main>
    {loading || busy ? <LoadingScreen overlay label={t(catalogOperation ?? (loading ? 'Loading your workspace…' : saving ? 'Saving journal…' : deleting ? 'Deleting journal…' : signingOut ? 'Signing out…' : 'Uploading images…'))} detail={busy ? t('Your changes are being processed.') : undefined} /> : null}
    </>
  );
}
