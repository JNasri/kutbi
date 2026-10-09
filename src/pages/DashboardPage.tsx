import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import Logo from "../components/Logo";
import LoadingSpinner from "../components/LoadingSpinner";
import { ApiError, apiRequest } from "../lib/api";
import { clearBlogCaches } from "../lib/blogs";
import { clearTravelContentCache } from "../lib/siteContentApi";
import useStoredTheme from "../hooks/useStoredTheme";
import type { BlogInput, BlogPost } from "../types/blog";
import type {
  ContentStatus,
  OfferData,
  PackageData,
  SiteContentItem,
} from "../types/siteContent";

type Section = "journals" | "packages" | "offers";
type Editor =
  | { kind: "journal"; id: number | null }
  | { kind: "package" | "offer"; id: number | null };
type UploadResponse = { mainImage: string | null; galleryImages: string[] };

const imageAccept = "image/jpeg,image/png,image/webp,image/avif";
const slugPattern = /[^a-z0-9]+/g;
const createSlug = (value: string) =>
  value.toLowerCase().trim().replace(slugPattern, "-").replace(/^-|-$/g, "");
const toLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
const fromLines = (value: string[]) => value.join("\n");
const toDateTimeLocal = (value?: string | null) =>
  value
    ? new Date(
        new Date(value).getTime() -
          new Date(value).getTimezoneOffset() * 60_000,
      )
        .toISOString()
        .slice(0, 16)
    : "";

const createEmptyPost = (): BlogInput => ({
  slug: "",
  title_ar: "",
  title_en: "",
  excerpt_ar: "",
  excerpt_en: "",
  content_ar: "",
  content_en: "",
  image_url: "",
  gallery_images: [],
  status: "draft",
  published_at: new Date().toISOString(),
});
const createEmptyPackage = (): PackageData => ({
  image_url: "",
  name_ar: "",
  name_en: "",
  label_ar: "",
  label_en: "",
  price: "",
  price_prefix_ar: "ابتداءً من",
  price_prefix_en: "Starting from",
  price_label_ar: "ريال سعودي للفرد",
  price_label_en: "Saudi riyals per person",
  description_ar: "",
  description_en: "",
  features_ar: [],
  features_en: [],
  cta_ar: "اختيار الباقة",
  cta_en: "Choose package",
  featured: false,
});
const createEmptyOffer = (): OfferData => ({
  image_url: "",
  title_ar: "",
  title_en: "",
  text_ar: "",
  text_en: "",
});

function Modal({
  title,
  eyebrow,
  onClose,
  children,
}: {
  title: string;
  eyebrow: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="admin-editor-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="admin-editor-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-editor-title"
      >
        <header>
          <div>
            <p>{eyebrow}</p>
            <h2 id="admin-editor-title">{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close editor">
            ×
          </button>
        </header>
        <div className="admin-editor-body">{children}</div>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const theme = useStoredTheme();
  const [language, setLanguage] = useState<"en" | "ar">(() =>
    localStorage.getItem("alkutbi-admin-language") === "ar" ? "ar" : "en",
  );
  const ar = language === "ar";
  const [section, setSection] = useState<Section>("journals");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [items, setItems] = useState<SiteContentItem[]>([]);
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null,
  );
  const [editor, setEditor] = useState<Editor | null>(null);
  const [postDraft, setPostDraft] = useState<BlogInput>(createEmptyPost);
  const [packageDraft, setPackageDraft] =
    useState<PackageData>(createEmptyPackage);
  const [offerDraft, setOfferDraft] = useState<OfferData>(createEmptyOffer);
  const [contentMeta, setContentMeta] = useState({
    key: "",
    sort_order: 1,
    status: "draft" as ContentStatus,
  });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const packages = items.filter(
    (item): item is SiteContentItem<PackageData> => item.section === "packages",
  );
  const offers = items.filter(
    (item): item is SiteContentItem<OfferData> => item.section === "offers",
  );

  async function refresh() {
    const [blogData, contentData] = await Promise.all([
      apiRequest<{ posts: BlogPost[] }>("/api/admin/blogs"),
      apiRequest<{ items: SiteContentItem[] }>("/api/admin/site-content"),
    ]);
    setPosts(blogData.posts);
    setItems(contentData.items);
  }

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = ar ? "rtl" : "ltr";
    document.title = ar
      ? "لوحة إدارة المحتوى | مجموعة الكتبي"
      : "Content dashboard | Alkutbi Group";
    localStorage.setItem("alkutbi-admin-language", language);
  }, [language, ar]);

  useEffect(() => {
    Promise.all([
      apiRequest<{ user: { id: number; username: string } | null }>(
        "/api/auth/session",
      ),
      apiRequest<{ posts: BlogPost[] }>("/api/admin/blogs"),
      apiRequest<{ items: SiteContentItem[] }>("/api/admin/site-content"),
    ])
      .then(([session, blogData, contentData]) => {
        if (!session.user) return navigate("/login", { replace: true });
        setUser(session.user);
        setPosts(blogData.posts);
        setItems(contentData.items);
      })
      .catch((requestError) => {
        if (requestError instanceof ApiError && requestError.status === 401)
          navigate("/login", { replace: true });
        else
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load the dashboard.",
          );
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    if (!editor) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEditor(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [editor]);

  function clearFeedback() {
    setMessage("");
    setError("");
  }
  function openCreate() {
    clearFeedback();
    if (section === "journals") {
      setPostDraft(createEmptyPost());
      setEditor({ kind: "journal", id: null });
      return;
    }
    const sort_order = (section === "packages" ? packages : offers).length + 1;
    setContentMeta({ key: "", sort_order, status: "draft" });
    if (section === "packages") {
      setPackageDraft(createEmptyPackage());
      setEditor({ kind: "package", id: null });
    } else {
      setOfferDraft(createEmptyOffer());
      setEditor({ kind: "offer", id: null });
    }
  }
  function openJournal(post: BlogPost) {
    clearFeedback();
    setPostDraft({
      slug: post.slug,
      title_ar: post.title_ar,
      title_en: post.title_en,
      excerpt_ar: post.excerpt_ar,
      excerpt_en: post.excerpt_en,
      content_ar: post.content_ar,
      content_en: post.content_en,
      image_url: post.image_url,
      gallery_images: post.gallery_images ?? [],
      status: post.status ?? "draft",
      published_at:
        post.published_at ?? post.created_at ?? new Date().toISOString(),
    });
    setEditor({ kind: "journal", id: post.id });
  }
  function openContent(item: SiteContentItem) {
    clearFeedback();
    setContentMeta({
      key: item.key,
      sort_order: item.sort_order,
      status: item.status ?? "draft",
    });
    if (item.section === "packages") {
      setPackageDraft(item.data as PackageData);
      setEditor({ kind: "package", id: item.id });
    } else {
      setOfferDraft(item.data as OfferData);
      setEditor({ kind: "offer", id: item.id });
    }
  }

  async function upload(
    field: "mainImage" | "galleryImages",
    files: FileList | null,
    target: "journal" | "package" | "offer",
  ) {
    if (!files?.length) return;
    if (
      field === "galleryImages" &&
      postDraft.gallery_images.length + files.length > 10
    )
      return setError("A journal can contain up to 10 gallery images.");
    setUploading(target + field);
    setError("");
    try {
      const body = new FormData();
      Array.from(files).forEach((file) => body.append(field, file));
      const result = await apiRequest<UploadResponse>("/api/admin/uploads", {
        method: "POST",
        body,
      });
      if (target === "journal")
        setPostDraft((current) => ({
          ...current,
          image_url: result.mainImage ?? current.image_url,
          gallery_images: [
            ...current.gallery_images,
            ...result.galleryImages,
          ].slice(0, 10),
        }));
      if (target === "package" && result.mainImage)
        setPackageDraft((current) => ({
          ...current,
          image_url: result.mainImage!,
        }));
      if (target === "offer" && result.mainImage)
        setOfferDraft((current) => ({
          ...current,
          image_url: result.mainImage!,
        }));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Image upload failed.",
      );
    } finally {
      setUploading("");
    }
  }
  function imageInput(
    field: "mainImage" | "galleryImages",
    target: "journal" | "package" | "offer",
  ) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      void upload(field, event.target.files, target);
      event.target.value = "";
    };
  }

  async function saveJournal(event: FormEvent) {
    event.preventDefault();
    if (!postDraft.image_url)
      return setError("Upload a main image before saving.");
    setBusy(true);
    clearFeedback();
    try {
      const payload = {
        ...postDraft,
        slug:
          postDraft.slug ||
          createSlug(postDraft.title_en) ||
          `journal-${Date.now()}`,
      };
      await apiRequest(
        editor?.id ? `/api/admin/blogs/${editor.id}` : "/api/admin/blogs",
        { method: editor?.id ? "PUT" : "POST", body: JSON.stringify(payload) },
      );
      await refresh();
      clearBlogCaches();
      setEditor(null);
      setMessage(editor?.id ? "Journal updated." : "Journal created.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save journal.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function saveContent(event: FormEvent, kind: "package" | "offer") {
    event.preventDefault();
    const data = kind === "package" ? packageDraft : offerDraft;
    if (!data.image_url) return setError("Upload an image before saving.");
    const key =
      contentMeta.key ||
      createSlug(
        kind === "package" ? packageDraft.name_en : offerDraft.title_en,
      ) ||
      `${kind}-${Date.now()}`;
    setBusy(true);
    clearFeedback();
    try {
      await apiRequest(
        editor?.id
          ? `/api/admin/site-content/${editor.id}`
          : "/api/admin/site-content",
        {
          method: editor?.id ? "PUT" : "POST",
          body: JSON.stringify({
            section: kind === "package" ? "packages" : "offers",
            key,
            sort_order: contentMeta.sort_order,
            status: contentMeta.status,
            data,
          }),
        },
      );
      await refresh();
      clearTravelContentCache();
      setEditor(null);
      setMessage(`${kind === "package" ? "Package" : "Offer"} saved.`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save content.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(
    kind: "journal" | "content",
    id: number,
    title: string,
  ) {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    clearFeedback();
    try {
      await apiRequest(
        kind === "journal"
          ? `/api/admin/blogs/${id}`
          : `/api/admin/site-content/${id}`,
        { method: "DELETE" },
      );
      if (kind === "journal") {
        clearBlogCaches();
        setPosts((current) => current.filter((item) => item.id !== id));
      }
      else {
        setItems((current) => current.filter((item) => item.id !== id));
        clearTravelContentCache();
      }
      setMessage("Record deleted.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to delete record.",
      );
    }
  }
  async function logout() {
    await apiRequest("/api/auth/logout", { method: "POST" }).catch(
      () => undefined,
    );
    navigate("/login", { replace: true });
  }

  const records =
    section === "journals"
      ? posts.length
      : section === "packages"
        ? packages.length
        : offers.length;
  const published =
    section === "journals"
      ? posts.filter((item) => item.status === "published").length
      : (section === "packages" ? packages : offers).filter(
          (item) => item.status === "published",
        ).length;
  const titles = ar
    ? ({
        journals: ["الأخبار", "الخبر"],
        packages: ["الباقات", "باقة"],
        offers: ["العروض الموسمية", "عرض"],
      } as const)
    : ({
        journals: ["Journals", "stories"],
        packages: ["Packages", "travel packages"],
        offers: ["Seasonal offers", "offers"],
      } as const);
  const addLabel = ar
    ? section === "journals"
      ? "إضافة يومية"
      : section === "packages"
        ? "إضافة باقة"
        : "إضافة عرض"
    : "Add " +
      (section === "journals"
        ? "journal"
        : section === "packages"
          ? "package"
          : "offer");

  return (
    <main className="dashboard-shell" dir={ar ? "rtl" : "ltr"}>
      <aside className="dashboard-sidebar">
        <a className="admin-brand" href="/">
          <Logo />
          <span>
            {ar ? (
              <>
                إدارة
                <br />
                الكتبي
              </>
            ) : (
              <>
                ALKUTBI
                <br />
                ADMIN
              </>
            )}
          </span>
        </a>
        <button
          className="dashboard-language-toggle"
          type="button"
          onClick={() =>
            setLanguage((current) => (current === "en" ? "ar" : "en"))
          }
          aria-label={
            ar
              ? "Switch dashboard to English"
              : "تحويل لوحة الإدارة إلى العربية"
          }
        >
          <span aria-hidden="true">文</span>
          {ar ? "English" : "العربية"}
        </button>
        <nav aria-label={ar ? "أقسام لوحة الإدارة" : "Dashboard sections"}>
          {(["journals", "packages", "offers"] as Section[]).map((value) => (
            <button
              className={section === value ? "active" : ""}
              type="button"
              key={value}
              onClick={() => {
                setSection(value);
                clearFeedback();
              }}
            >
              {titles[value][0]}
            </button>
          ))}
        </nav>
        <a
          className="dashboard-view-site"
          href="/"
          target="_blank"
          rel="noreferrer"
        >
          {ar ? "عرض الموقع ↗" : "View website ↗"}
        </a>
        <div className="admin-user">
          <span>{user?.username?.slice(0, 1).toUpperCase() ?? "A"}</span>
          <div>
            <b>{user?.username ?? "Admin"}</b>
            <small>{ar ? "مدير الموقع" : "Administrator"}</small>
          </div>
        </div>
        <button type="button" onClick={logout}>
          {ar ? "تسجيل الخروج" : "Sign out"}
        </button>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p>{ar ? "إدارة المحتوى" : "CONTENT STUDIO"}</p>
            <h1>{titles[section][0]}</h1>
          </div>
          <button
            className="admin-primary-button"
            type="button"
            onClick={openCreate}
          >
            {addLabel} <span>＋</span>
          </button>
        </header>
        <section
          className="dashboard-metrics"
          aria-label={ar ? "ملخص القسم" : "Section summary"}
        >
          <article>
            <span>{records}</span>
            <p>
              {ar ? "الإجمالي: " : "Total "}
              {titles[section][1]}
            </p>
          </article>
          <article>
            <span>{published}</span>
            <p>{ar ? "منشور" : "Published"}</p>
          </article>
          <article>
            <span>{records - published}</span>
            <p>{ar ? "مسودة" : "Drafts"}</p>
          </article>
        </section>
        {message ? (
          <p className="dashboard-notice success" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="dashboard-notice error" role="alert">
            {error}
          </p>
        ) : null}
        <section className="post-library">
          <div className="dashboard-section-title">
            <h2>
              {ar ? "كل " : "All "}
              {titles[section][0].toLowerCase()}
            </h2>
            <span>
              {records} {ar ? "سجل" : "records"}
            </span>
          </div>
          {loading ? (
            <div className="dashboard-empty">
              <LoadingSpinner label={ar ? "جارٍ تحميل السجلات…" : "Loading records…"} compact inverse={theme === "dark"} />
            </div>
          ) : records === 0 ? (
            <p className="dashboard-empty">
              {ar
                ? "لا توجد سجلات بعد. استخدم زر الإضافة لإنشاء أول سجل."
                : "No records yet. Use the Add button to create one."}
            </p>
          ) : (
            <div className="admin-post-list">
              {section === "journals" &&
                posts.map((post) => (
                  <article className="admin-post-row" key={post.id}>
                    <img src={post.image_url} alt="" />
                    <div>
                      <span className={`status-pill ${post.status}`}>
                        {ar
                          ? post.status === "published"
                            ? "منشور"
                            : "مسودة"
                          : post.status}
                      </span>
                      <h3>{post.title_en}</h3>
                      <p dir="rtl">{post.title_ar}</p>
                    </div>
                    <small>
                      {new Date(
                        post.published_at ?? post.created_at ?? "",
                      ).toLocaleDateString(ar ? "ar-SA" : "en-GB")}
                    </small>
                    <div className="row-actions">
                      <button onClick={() => openJournal(post)}>
                        {ar ? "تعديل" : "Edit"}
                      </button>
                      <button
                        className="danger"
                        onClick={() =>
                          void remove("journal", post.id, post.title_en)
                        }
                      >
                        {ar ? "حذف" : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              {section === "packages" &&
                packages.map((item) => (
                  <article className="admin-post-row" key={item.id}>
                    <img src={item.data.image_url} alt="" />
                    <div>
                      <span className={`status-pill ${item.status}`}>
                        {ar
                          ? item.status === "published"
                            ? "منشور"
                            : "مسودة"
                          : item.status}
                      </span>
                      <h3>{item.data.name_en}</h3>
                      <p dir="rtl">{item.data.name_ar}</p>
                    </div>
                    <small>
                      {ar ? "الترتيب" : "Order"} {item.sort_order}
                    </small>
                    <div className="row-actions">
                      <button onClick={() => openContent(item)}>
                        {ar ? "تعديل" : "Edit"}
                      </button>
                      <button
                        className="danger"
                        onClick={() =>
                          void remove("content", item.id, item.data.name_en)
                        }
                      >
                        {ar ? "حذف" : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              {section === "offers" &&
                offers.map((item) => (
                  <article className="admin-post-row" key={item.id}>
                    <img src={item.data.image_url} alt="" />
                    <div>
                      <span className={`status-pill ${item.status}`}>
                        {ar
                          ? item.status === "published"
                            ? "منشور"
                            : "مسودة"
                          : item.status}
                      </span>
                      <h3>{item.data.title_en}</h3>
                      <p dir="rtl">{item.data.title_ar}</p>
                    </div>
                    <small>
                      {ar ? "الترتيب" : "Order"} {item.sort_order}
                    </small>
                    <div className="row-actions">
                      <button onClick={() => openContent(item)}>
                        {ar ? "تعديل" : "Edit"}
                      </button>
                      <button
                        className="danger"
                        onClick={() =>
                          void remove("content", item.id, item.data.title_en)
                        }
                      >
                        {ar ? "حذف" : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          )}
        </section>
      </div>

      {editor?.kind === "journal" ? (
        <Modal
          eyebrow={
            ar
              ? editor.id
                ? "تعديل اليومية"
                : "يومية جديدة"
              : editor.id
                ? "EDIT JOURNAL"
                : "NEW JOURNAL"
          }
          title={
            ar
              ? editor.id
                ? "تحديث اليومية"
                : "إنشاء يومية"
              : editor.id
                ? "Update journal"
                : "Create journal"
          }
          onClose={() => setEditor(null)}
        >
          <form className="admin-form editor-form" onSubmit={saveJournal}>
            <div className="editor-grid">
              <label>
                {ar ? "العنوان بالإنجليزية" : "English title"}
                <input
                  value={postDraft.title_en}
                  onChange={(e) =>
                    setPostDraft((v) => ({ ...v, title_en: e.target.value }))
                  }
                  required
                />
              </label>
              <label dir="rtl">
                العنوان العربي
                <input
                  value={postDraft.title_ar}
                  onChange={(e) =>
                    setPostDraft((v) => ({ ...v, title_ar: e.target.value }))
                  }
                  required
                />
              </label>
              <label>
                {ar ? "الملخص بالإنجليزية" : "English excerpt"}
                <textarea
                  rows={3}
                  value={postDraft.excerpt_en}
                  onChange={(e) =>
                    setPostDraft((v) => ({ ...v, excerpt_en: e.target.value }))
                  }
                  required
                />
              </label>
              <label dir="rtl">
                الملخص العربي
                <textarea
                  rows={3}
                  value={postDraft.excerpt_ar}
                  onChange={(e) =>
                    setPostDraft((v) => ({ ...v, excerpt_ar: e.target.value }))
                  }
                  required
                />
              </label>
              <label>
                {ar ? "المقال بالإنجليزية" : "English article"}
                <textarea
                  rows={9}
                  value={postDraft.content_en}
                  onChange={(e) =>
                    setPostDraft((v) => ({ ...v, content_en: e.target.value }))
                  }
                  required
                />
              </label>
              <label dir="rtl">
                المقال بالعربية
                <textarea
                  rows={9}
                  value={postDraft.content_ar}
                  onChange={(e) =>
                    setPostDraft((v) => ({ ...v, content_ar: e.target.value }))
                  }
                  required
                />
              </label>
              <label>
                {ar ? "تاريخ النشر" : "Publication date"}
                <input
                  type="datetime-local"
                  value={toDateTimeLocal(postDraft.published_at)}
                  onChange={(e) =>
                    setPostDraft((v) => ({
                      ...v,
                      published_at: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null,
                    }))
                  }
                />
              </label>
              <label>
                {ar ? "الحالة" : "Status"}
                <select
                  value={postDraft.status}
                  onChange={(e) =>
                    setPostDraft((v) => ({
                      ...v,
                      status: e.target.value as BlogInput["status"],
                    }))
                  }
                >
                  <option value="draft">{ar ? "مسودة" : "Draft"}</option>
                  <option value="published">
                    {ar ? "منشور" : "Published"}
                  </option>
                </select>
              </label>
              <section className="editor-media-block editor-span-two">
                <div>
                  <p>{ar ? "الصورة الرئيسية" : "MAIN IMAGE"}</p>
                  <h3>{ar ? "غلاف اليومية" : "Journal cover"}</h3>
                </div>
                {postDraft.image_url ? (
                  <figure className="admin-main-preview">
                    <img src={postDraft.image_url} alt="" />
                  </figure>
                ) : (
                  <div className="admin-image-placeholder">
                    {ar ? "لم يُرفع غلاف بعد" : "No cover uploaded"}
                  </div>
                )}
                <label className="admin-upload-control">
                  <input
                    type="file"
                    accept={imageAccept}
                    onChange={imageInput("mainImage", "journal")}
                  />
                  <b>
                    {uploading
                      ? ar
                        ? "جارٍ الرفع…"
                        : "Uploading…"
                      : ar
                        ? "رفع الغلاف"
                        : "Upload cover"}
                  </b>
                </label>
              </section>
              <section className="editor-media-block editor-span-two">
                <div>
                  <p>{ar ? "معرض الصور" : "GALLERY"}</p>
                  <h3>{ar ? "الصور الإضافية" : "Supporting images"}</h3>
                </div>
                {postDraft.gallery_images.length ? (
                  <div className="admin-gallery-grid">
                    {postDraft.gallery_images.map((image, index) => (
                      <figure key={image}>
                        <img src={image} alt="" />
                        <button
                          type="button"
                          onClick={() =>
                            setPostDraft((v) => ({
                              ...v,
                              gallery_images: v.gallery_images.filter(
                                (_, i) => i !== index,
                              ),
                            }))
                          }
                        >
                          ×
                        </button>
                      </figure>
                    ))}
                  </div>
                ) : null}
                <label className="admin-upload-control">
                  <input
                    type="file"
                    accept={imageAccept}
                    multiple
                    onChange={imageInput("galleryImages", "journal")}
                  />
                  <b>
                    {ar ? "إضافة صور" : "Add images"} (
                    {postDraft.gallery_images.length}/10)
                  </b>
                </label>
              </section>
            </div>
            <div className="editor-footer">
              <span>
                {ar
                  ? "تبقى المسودة خاصة حتى نشرها."
                  : "Drafts stay private until published."}
              </span>
              <button
                className="admin-primary-button"
                disabled={busy || Boolean(uploading)}
              >
                {busy
                  ? ar
                    ? "جارٍ الحفظ…"
                    : "Saving…"
                  : ar
                    ? "حفظ اليومية"
                    : "Save journal"}{" "}
                <span>↗</span>
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {editor?.kind === "package" ? (
        <Modal
          eyebrow={
            ar
              ? editor.id
                ? "تعديل الباقة"
                : "باقة جديدة"
              : editor.id
                ? "EDIT PACKAGE"
                : "NEW PACKAGE"
          }
          title={
            ar
              ? editor.id
                ? "تحديث الباقة"
                : "إنشاء باقة"
              : editor.id
                ? "Update package"
                : "Create package"
          }
          onClose={() => setEditor(null)}
        >
          <form
            className="admin-form editor-form"
            onSubmit={(e) => void saveContent(e, "package")}
          >
            <div className="editor-grid">
              <label>
                {ar ? "الاسم بالإنجليزية" : "English name"}
                <input
                  value={packageDraft.name_en}
                  onChange={(e) =>
                    setPackageDraft((v) => ({ ...v, name_en: e.target.value }))
                  }
                  required
                />
              </label>
              <label dir="rtl">
                الاسم بالعربية
                <input
                  value={packageDraft.name_ar}
                  onChange={(e) =>
                    setPackageDraft((v) => ({ ...v, name_ar: e.target.value }))
                  }
                  required
                />
              </label>
              <label>
                {ar ? "العنوان المختصر بالإنجليزية" : "English label"}
                <input
                  value={packageDraft.label_en}
                  onChange={(e) =>
                    setPackageDraft((v) => ({ ...v, label_en: e.target.value }))
                  }
                  required
                />
              </label>
              <label dir="rtl">
                الوصف المختصر
                <input
                  value={packageDraft.label_ar}
                  onChange={(e) =>
                    setPackageDraft((v) => ({ ...v, label_ar: e.target.value }))
                  }
                  required
                />
              </label>
              <label>
                {ar ? "السعر (ر.س)" : "Price (SAR)"}
                <input
                  value={packageDraft.price}
                  onChange={(e) =>
                    setPackageDraft((v) => ({ ...v, price: e.target.value }))
                  }
                  required
                />
              </label>
              <label>
                {ar ? "ترتيب العرض" : "Display order"}
                <input
                  type="number"
                  min="0"
                  value={contentMeta.sort_order}
                  onChange={(e) =>
                    setContentMeta((v) => ({
                      ...v,
                      sort_order: Number(e.target.value),
                    }))
                  }
                />
              </label>
              <label>
                {ar ? "الوصف بالإنجليزية" : "English description"}
                <textarea
                  rows={3}
                  value={packageDraft.description_en}
                  onChange={(e) =>
                    setPackageDraft((v) => ({
                      ...v,
                      description_en: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label dir="rtl">
                الوصف بالعربية
                <textarea
                  rows={3}
                  value={packageDraft.description_ar}
                  onChange={(e) =>
                    setPackageDraft((v) => ({
                      ...v,
                      description_ar: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label>
                {ar
                  ? "المزايا بالإنجليزية (ميزة في كل سطر)"
                  : "English features (one per line)"}
                <textarea
                  rows={5}
                  value={fromLines(packageDraft.features_en)}
                  onChange={(e) =>
                    setPackageDraft((v) => ({
                      ...v,
                      features_en: toLines(e.target.value),
                    }))
                  }
                  required
                />
              </label>
              <label dir="rtl">
                المزايا بالعربية (ميزة في كل سطر)
                <textarea
                  rows={5}
                  value={fromLines(packageDraft.features_ar)}
                  onChange={(e) =>
                    setPackageDraft((v) => ({
                      ...v,
                      features_ar: toLines(e.target.value),
                    }))
                  }
                  required
                />
              </label>
              <label>
                {ar ? "نص الزر بالإنجليزية" : "English button text"}
                <input
                  value={packageDraft.cta_en}
                  onChange={(e) =>
                    setPackageDraft((v) => ({ ...v, cta_en: e.target.value }))
                  }
                  required
                />
              </label>
              <label dir="rtl">
                نص الزر بالعربية
                <input
                  value={packageDraft.cta_ar}
                  onChange={(e) =>
                    setPackageDraft((v) => ({ ...v, cta_ar: e.target.value }))
                  }
                  required
                />
              </label>
              <label>
                {ar ? "الحالة" : "Status"}
                <select
                  value={contentMeta.status}
                  onChange={(e) =>
                    setContentMeta((v) => ({
                      ...v,
                      status: e.target.value as ContentStatus,
                    }))
                  }
                >
                  <option value="draft">{ar ? "مسودة" : "Draft"}</option>
                  <option value="published">
                    {ar ? "منشور" : "Published"}
                  </option>
                </select>
              </label>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={packageDraft.featured}
                  onChange={(e) =>
                    setPackageDraft((v) => ({
                      ...v,
                      featured: e.target.checked,
                    }))
                  }
                />{" "}
                {ar ? "باقة مميزة" : "Featured package"}
              </label>
              <section className="editor-media-block editor-span-two">
                {packageDraft.image_url ? (
                  <figure className="admin-main-preview">
                    <img src={packageDraft.image_url} alt="" />
                  </figure>
                ) : (
                  <div className="admin-image-placeholder">
                    {ar ? "لم تُرفع صورة بعد" : "No image uploaded"}
                  </div>
                )}
                <label className="admin-upload-control">
                  <input
                    type="file"
                    accept={imageAccept}
                    onChange={imageInput("mainImage", "package")}
                  />
                  <b>
                    {uploading
                      ? ar
                        ? "جارٍ الرفع…"
                        : "Uploading…"
                      : ar
                        ? "رفع صورة الباقة"
                        : "Upload package image"}
                  </b>
                </label>
              </section>
            </div>
            <div className="editor-footer">
              <span>
                {ar
                  ? "لا تستبدل المسودة الباقة المنشورة."
                  : "Drafts do not replace the live package."}
              </span>
              <button
                className="admin-primary-button"
                disabled={busy || Boolean(uploading)}
              >
                {busy
                  ? ar
                    ? "جارٍ الحفظ…"
                    : "Saving…"
                  : ar
                    ? "حفظ الباقة"
                    : "Save package"}{" "}
                <span>↗</span>
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {editor?.kind === "offer" ? (
        <Modal
          eyebrow={
            ar
              ? editor.id
                ? "تعديل العرض"
                : "عرض جديد"
              : editor.id
                ? "EDIT OFFER"
                : "NEW OFFER"
          }
          title={
            ar
              ? editor.id
                ? "تحديث العرض"
                : "إنشاء عرض"
              : editor.id
                ? "Update offer"
                : "Create offer"
          }
          onClose={() => setEditor(null)}
        >
          <form
            className="admin-form editor-form"
            onSubmit={(e) => void saveContent(e, "offer")}
          >
            <div className="editor-grid">
              <label>
                {ar ? "العنوان بالإنجليزية" : "English title"}
                <input
                  value={offerDraft.title_en}
                  onChange={(e) =>
                    setOfferDraft((v) => ({ ...v, title_en: e.target.value }))
                  }
                  required
                />
              </label>
              <label dir="rtl">
                العنوان بالعربية
                <input
                  value={offerDraft.title_ar}
                  onChange={(e) =>
                    setOfferDraft((v) => ({ ...v, title_ar: e.target.value }))
                  }
                  required
                />
              </label>
              <label>
                {ar ? "التفاصيل بالإنجليزية" : "English details"}
                <textarea
                  rows={5}
                  value={offerDraft.text_en}
                  onChange={(e) =>
                    setOfferDraft((v) => ({ ...v, text_en: e.target.value }))
                  }
                  required
                />
              </label>
              <label dir="rtl">
                التفاصيل بالعربية
                <textarea
                  rows={5}
                  value={offerDraft.text_ar}
                  onChange={(e) =>
                    setOfferDraft((v) => ({ ...v, text_ar: e.target.value }))
                  }
                  required
                />
              </label>
              <label>
                {ar ? "ترتيب العرض" : "Display order"}
                <input
                  type="number"
                  min="0"
                  value={contentMeta.sort_order}
                  onChange={(e) =>
                    setContentMeta((v) => ({
                      ...v,
                      sort_order: Number(e.target.value),
                    }))
                  }
                />
              </label>
              <label>
                {ar ? "الحالة" : "Status"}
                <select
                  value={contentMeta.status}
                  onChange={(e) =>
                    setContentMeta((v) => ({
                      ...v,
                      status: e.target.value as ContentStatus,
                    }))
                  }
                >
                  <option value="draft">{ar ? "مسودة" : "Draft"}</option>
                  <option value="published">
                    {ar ? "منشور" : "Published"}
                  </option>
                </select>
              </label>
              <section className="editor-media-block editor-span-two">
                {offerDraft.image_url ? (
                  <figure className="admin-main-preview">
                    <img src={offerDraft.image_url} alt="" />
                  </figure>
                ) : (
                  <div className="admin-image-placeholder">
                    {ar ? "لم تُرفع صورة بعد" : "No image uploaded"}
                  </div>
                )}
                <label className="admin-upload-control">
                  <input
                    type="file"
                    accept={imageAccept}
                    onChange={imageInput("mainImage", "offer")}
                  />
                  <b>
                    {uploading
                      ? ar
                        ? "جارٍ الرفع…"
                        : "Uploading…"
                      : ar
                        ? "رفع صورة العرض"
                        : "Upload offer image"}
                  </b>
                </label>
              </section>
            </div>
            <div className="editor-footer">
              <span>
                {ar
                  ? "لا تستبدل المسودة العرض المنشور."
                  : "Drafts do not replace the live offer."}
              </span>
              <button
                className="admin-primary-button"
                disabled={busy || Boolean(uploading)}
              >
                {busy
                  ? ar
                    ? "جارٍ الحفظ…"
                    : "Saving…"
                  : ar
                    ? "حفظ العرض"
                    : "Save offer"}{" "}
                <span>↗</span>
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </main>
  );
}



