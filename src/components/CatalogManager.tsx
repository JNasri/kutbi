import AdminForm from './AdminForm';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { FiArrowLeft, FiEdit2, FiImage, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAdmin } from './AdminLayout';
import { apiRequest } from '../lib/api';
import type { CatalogKind, CatalogLanguage, CatalogOffer, CatalogPackage, OfferInput, PackageInput, PackageTranslation } from '../../shared/catalog';

type Entry = CatalogPackage | CatalogOffer;
type Draft = PackageInput | OfferInput;
type View = 'list' | 'create' | 'edit';
type Props = { kind: CatalogKind; initialView: View; onViewChange: (view: View) => void; onOperation: (label: string | null) => void };

function emptyDraft(kind: CatalogKind, order: number): Draft {
  const base = { image_url: '', status: 'draft' as const, sort_order: order };
  const translation = (ar: boolean): PackageTranslation => ({ name: '', label: '', price: '', pricePrefix: ar ? 'ابتداءً من' : 'Starting from', priceLabel: ar ? 'ريال سعودي للفرد' : 'Saudi riyals per person', description: '', features: [], cta: ar ? 'اختيار الباقة' : 'Choose package', details: [] });
  return kind === 'packages'
    ? { ...base, featured: false, translations: { en: translation(false), ar: translation(true) } }
    : { ...base, image_layout: 'cover', image_x: 50, image_y: 50, translations: { en: { title: '', text: '' }, ar: { title: '', text: '' } } };
}

export default function CatalogManager({ kind, initialView, onViewChange, onOperation }: Props) {
  const { language, t } = useAdmin();
  const [items, setItems] = useState<Entry[]>([]);
  const [draft, setDraft] = useState<Draft | null>(() => initialView === 'create' ? emptyDraft(kind, 0) : null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const isPackages = kind === 'packages';
  const published = items.filter((item) => item.status === 'published').length;

  useEffect(() => {
    let active = true;
    setLoading(true);
    onOperation('Loading content…');
    apiRequest<{ items: Entry[] }>(`/api/admin/catalog/${kind}`).then(({ items: loaded }) => {
      if (!active) return;
      setItems(loaded);
      if (initialView === 'create') setDraft(emptyDraft(kind, Math.max(-1, ...loaded.map((item) => item.sort_order)) + 1));
      setError('');
    }).catch((requestError) => { if (active) setError(requestError instanceof Error ? requestError.message : 'Unable to load content.'); })
      .finally(() => { if (active) { setLoading(false); onOperation(null); } });
    return () => { active = false; onOperation(null); };
  }, [kind, attempt, onOperation]);

  function backToList() { setDraft(null); setEditingId(null); setError(''); onViewChange('list'); window.scrollTo({ top: 0, behavior: 'instant' }); }
  function edit(item: Entry) {
    const { id, created_at: _created, updated_at: _updated, ...data } = item;
    setDraft(structuredClone(data)); setEditingId(id); setError(''); setMessage(''); onViewChange('edit'); window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function updatePackage(locale: CatalogLanguage, key: keyof PackageTranslation, value: string | string[] | PackageTranslation['details']) {
    setDraft((current) => current && 'featured' in current ? { ...current, translations: { ...current.translations, [locale]: { ...current.translations[locale], [key]: value } } } : current);
  }
  function updateOffer(locale: CatalogLanguage, key: 'title' | 'text', value: string) {
    setDraft((current) => current && 'image_layout' in current ? { ...current, translations: { ...current.translations, [locale]: { ...current.translations[locale], [key]: value } } } : current);
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    if (file.size > 12 * 1024 * 1024) { setError('Each image must be 12 MB or smaller.'); return; }
    setBusy(true); setError(''); onOperation('Uploading images…');
    try {
      const body = new FormData(); body.append('mainImage', file);
      const result = await apiRequest<{ mainImage: string }>('/api/admin/uploads', { method: 'POST', body });
      setDraft((current) => current ? { ...current, image_url: result.mainImage, ...('image_layout' in current ? { image_layout: 'cover' as const, image_x: 50, image_y: 50 } : {}) } : current);
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to upload the image.'); }
    finally { setBusy(false); onOperation(null); }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!draft) return;
    if (!draft.image_url) { setError('Upload an image before saving.'); return; }
    if ('featured' in draft && Object.values(draft.translations).some((copy) => copy.features.filter((line) => line.trim()).length > 30)) { setError('Use up to 30 feature lines per language.'); return; }
    const payload = 'featured' in draft ? { ...draft, translations: Object.fromEntries(Object.entries(draft.translations).map(([locale, copy]) => [locale, { ...copy, features: copy.features.map((line) => line.trim()).filter(Boolean) }])) } : draft;
    setBusy(true); setError(''); onOperation('Saving content…');
    try {
      const result = await apiRequest<{ item: Entry }>(`/api/admin/catalog/${kind}${editingId ? `/${editingId}` : ''}`, { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      setItems((current) => [...current.filter((item) => item.id !== result.item.id), result.item].sort((a, b) => a.sort_order - b.sort_order || (a.created_at ?? '').localeCompare(b.created_at ?? '') || a.id.localeCompare(b.id)));
      setMessage('Content saved successfully.'); backToList();
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to save content.'); }
    finally { setBusy(false); onOperation(null); }
  }

  async function remove(item: Entry) {
    if (!window.confirm(t('Delete this item? It will be removed from the website.'))) return;
    setBusy(true); setError(''); onOperation('Deleting content…');
    try {
      await apiRequest(`/api/admin/catalog/${kind}/${item.id}`, { method: 'DELETE' });
      setItems((current) => current.filter((entry) => entry.id !== item.id)); setMessage('Content deleted.');
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to delete content.'); }
    finally { setBusy(false); onOperation(null); }
  }

  return <>
    {message ? <p className="dashboard-notice success" role="status">{t(message)}</p> : null}
    {error ? <p className="dashboard-notice error" role="alert">{t(error)}</p> : null}
    {!isPackages ? <p className="catalog-limit-note">{t('Published seasonal cards')}: <bdi>{published} / 3</bdi>. {t('Keep up to three cards live. Prepare additional offers as drafts.')}</p> : null}
    {!draft ? <section className="post-library" aria-label={t(isPackages ? 'Packages' : 'Seasonal offers')}>
      <div className="library-list-heading"><span>{t(isPackages ? 'Packages' : 'Seasonal offers')}</span><span>{t('Display order')}</span></div>
      {!loading && !items.length ? <div className="dashboard-empty"><FiImage aria-hidden="true" /><h2>{t('No content yet')}</h2><p>{t('Use the sidebar to add your first item.')}</p></div> : null}
      <div className="admin-post-list">{items.map((item) => {
        const copy = item.translations[language]; const title = 'name' in copy ? copy.name : copy.title;
        return <article className="admin-post-row" key={item.id}>
          <div className="catalog-thumb" role="img" aria-label={title} style={{ backgroundImage: `url(${JSON.stringify(item.image_url)})`, backgroundSize: 'image_layout' in item && item.image_layout === 'atlas' ? '400% 300%' : 'cover', backgroundPosition: 'image_x' in item ? `${item.image_x}% ${item.image_y}%` : 'center' }} />
          <div className="post-row-copy"><span className={`status-pill ${item.status}`}>{t(item.status)}</span><h2>{title}</h2><p>{'name' in copy ? copy.label : copy.text}</p><small>{t('Display order')}: {item.sort_order}{'featured' in item && item.featured ? ` · ${t('Featured package')}` : ''}</small></div>
          <div className="row-actions"><button type="button" disabled={busy} onClick={() => edit(item)} aria-label={`${t('Edit')} ${title}`}><FiEdit2 aria-hidden="true" />{t('Edit')}</button><button className="danger" type="button" disabled={busy} onClick={() => remove(item)} aria-label={`${t('Delete')} ${title}`}><FiTrash2 aria-hidden="true" /></button></div>
        </article>;
      })}</div>
      {error ? <button className="catalog-secondary" onClick={() => setAttempt((value) => value + 1)}>{t('Try again')}</button> : null}
    </section> : <section className="post-editor catalog-editor" aria-labelledby="catalog-editor-title">
      <div className="dashboard-section-title"><div><p>{t('CONTENT DETAILS')}</p><h2 id="catalog-editor-title">{t(isPackages ? editingId ? 'Edit package' : 'Add package' : editingId ? 'Edit offer' : 'Add offer')}</h2></div><button type="button" disabled={busy} onClick={backToList}><FiArrowLeft aria-hidden="true" />{t('Back to list')}</button></div>
      <AdminForm className="admin-form editor-form" onSubmit={save}>
        <fieldset className="editor-grid" disabled={busy || loading}>
          <legend className="sr-only">{t('Content details')}</legend>
          <div className="editor-step editor-span-two"><span>01</span><div><h3>{t('Image and display settings')}</h3><p>{t('Update the artwork, visibility, and position on the website.')}</p></div></div>
          <div className="catalog-image-preview editor-span-two" style={draft.image_url ? { backgroundImage: `url(${JSON.stringify(draft.image_url)})`, backgroundSize: 'image_layout' in draft ? draft.image_layout === 'atlas' ? '400% 300%' : 'cover' : 'contain', backgroundPosition: 'image_x' in draft ? `${draft.image_x}% ${draft.image_y}%` : 'center' } : undefined}>{!draft.image_url ? <span><FiImage />{t('No image uploaded')}</span> : null}</div>
          <label className="admin-upload-control editor-span-two"><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={upload} /><b>{t(draft.image_url ? 'Replace image' : 'Upload image')}</b><small>{t('JPG, PNG, WebP, or AVIF · maximum 12 MB')}</small></label>
          <label>{t('Visibility')}<select aria-label={t('Visibility')} value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Draft['status'] })}><option value="draft">{t('Draft - only you can see it')}</option><option value="published">{t('Published - visible on website')}</option></select></label>
          <label>{t('Display order')}<input type="number" aria-label={t('Display order')} min={0} max={9999} step={1} required value={draft.sort_order} onChange={(event) => setDraft({ ...draft, sort_order: Number(event.target.value) })} /><small>{t('Lower numbers appear first.')}</small></label>
          {'featured' in draft ? <label className="catalog-checkbox editor-span-two"><input type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} /><span>{t('Featured package')}</span></label> : <>
            <label>{t('Image layout')}<select value={draft.image_layout} onChange={(event) => setDraft({ ...draft, image_layout: event.target.value as 'atlas' | 'cover' })}><option value="cover">{t('Single image')}</option><option value="atlas">{t('Original image collage')}</option></select></label>
            <div className="catalog-focus"><label>{t('Horizontal image focus')}<input type="range" min={0} max={100} step={0.001} value={draft.image_x} onChange={(event) => setDraft({ ...draft, image_x: Number(event.target.value) })} /></label><label>{t('Vertical image focus')}<input type="range" min={0} max={100} step={0.001} value={draft.image_y} onChange={(event) => setDraft({ ...draft, image_y: Number(event.target.value) })} /></label></div>
          </>}
          <div className="editor-step editor-span-two"><span>02</span><div><h3>{t('Content in both languages')}</h3><p>{t('Each language has its own text. The image and visibility are shared.')}</p></div></div>
          {(['en', 'ar'] as const).map((locale) => <section className="catalog-language-panel" dir={locale === 'ar' ? 'rtl' : 'ltr'} key={locale} aria-label={t(locale === 'en' ? 'English content' : 'Arabic content')}>
            <h3>{t(locale === 'en' ? 'English' : 'Arabic')}</h3>
            {'featured' in draft ? <>
              {([['name', 'Package name', 220, 2], ['label', 'Short label', 300, 0], ['price', 'Price', 40, 1], ['pricePrefix', 'Price prefix', 80, 0], ['priceLabel', 'Price unit', 120, 1], ['cta', 'Button text', 120, 1]] as const).map(([key, label, max, min]) => <label key={key}>{t(label)}<input aria-label={`${t(label)} (${t(locale === 'en' ? 'English' : 'Arabic')})`} value={draft.translations[locale][key]} maxLength={max} minLength={min} required={min > 0} onChange={(event) => updatePackage(locale, key, event.target.value)} /></label>)}
              <label>{t('Description')}<textarea aria-label={`${t('Description')} (${t(locale === 'en' ? 'English' : 'Arabic')})`} value={draft.translations[locale].description} rows={4} minLength={2} maxLength={3000} required onChange={(event) => updatePackage(locale, 'description', event.target.value)} /></label>
              <label>{t('Included features')}<textarea aria-label={`${t('Included features')} (${t(locale === 'en' ? 'English' : 'Arabic')})`} value={draft.translations[locale].features.join('\n')} rows={5} maxLength={18000} onChange={(event) => updatePackage(locale, 'features', event.target.value.split('\n'))} /><small>{t('One feature per line. Up to 30 features.')}</small></label>
              <div className="catalog-details-heading"><h4>{t('Additional details')}</h4><button type="button" className="catalog-secondary" disabled={draft.translations[locale].details.length >= 30} onClick={() => updatePackage(locale, 'details', [...draft.translations[locale].details, { label: '', value: '' }])}><FiPlus aria-hidden="true" />{t('Add detail')}</button></div>
              {draft.translations[locale].details.map((detail, index) => <div className="catalog-detail-row" key={index}>
                <label>{t('Detail label')}<input aria-label={`${t('Detail label')} ${index + 1} (${t(locale === 'en' ? 'English' : 'Arabic')})`} value={detail.label} required maxLength={160} onChange={(event) => updatePackage(locale, 'details', draft.translations[locale].details.map((entry, i) => i === index ? { ...entry, label: event.target.value } : entry))} /></label>
                <label>{t('Detail value')}<textarea aria-label={`${t('Detail value')} ${index + 1} (${t(locale === 'en' ? 'English' : 'Arabic')})`} value={detail.value} rows={2} required maxLength={1500} onChange={(event) => updatePackage(locale, 'details', draft.translations[locale].details.map((entry, i) => i === index ? { ...entry, value: event.target.value } : entry))} /></label>
                <button type="button" className="catalog-remove" aria-label={`${t('Remove detail')} ${index + 1} (${t(locale === 'en' ? 'English' : 'Arabic')})`} onClick={() => updatePackage(locale, 'details', draft.translations[locale].details.filter((_, i) => i !== index))}><FiTrash2 aria-hidden="true" /></button>
              </div>)}
            </> : <>
              <label>{t('Offer title')}<input aria-label={`${t('Offer title')} (${t(locale === 'en' ? 'English' : 'Arabic')})`} value={draft.translations[locale].title} required minLength={2} maxLength={220} onChange={(event) => updateOffer(locale, 'title', event.target.value)} /></label>
              <label>{t('Description')}<textarea aria-label={`${t('Description')} (${t(locale === 'en' ? 'English' : 'Arabic')})`} value={draft.translations[locale].text} required minLength={2} maxLength={3000} rows={6} onChange={(event) => updateOffer(locale, 'text', event.target.value)} /></label>
            </>}
          </section>)}
        </fieldset>
        <div className="editor-footer"><p className="catalog-save-note">{t('Published changes appear on the website after saving.')}</p><button type="submit" className="admin-primary-button" disabled={busy || loading}>{t(editingId ? 'Save changes' : draft.status === 'published' ? 'Publish content' : 'Save draft')}</button></div>
      </AdminForm>
    </section>}
  </>;
}
