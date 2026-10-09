import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import Logo from "../components/Logo";
import LoadingSpinner from "../components/LoadingSpinner";
import { apiRequest } from "../lib/api";
import useStoredTheme from "../hooks/useStoredTheme";

type LoginLanguage = "en" | "ar";

const loginCopy = {
  en: {
    pageTitle: "Admin login | Alkutbi Group",
    eyebrow: "PRIVATE ADMINISTRATION",
    title: "Welcome back.",
    intro: "Sign in to manage journals, packages, and seasonal offers.",
    username: "Username",
    password: "Password",
    submit: "Sign in",
    submitting: "Signing in…",
    error: "Unable to sign in. Check your username and password.",
    back: "Return to website",
    artLabel: "CURATE THE JOURNEY",
    art: "Keep every journey, offer, and story up to date.",
    switchLabel: "العربية",
  },
  ar: {
    pageTitle: "دخول الإدارة | مجموعة الكتبي",
    eyebrow: "لوحة الإدارة",
    title: "مرحباً بعودتك.",
    intro: "سجّل الدخول لإدارة اليوميات والباقات والعروض الموسمية.",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    submit: "تسجيل الدخول",
    submitting: "جارٍ تسجيل الدخول…",
    error: "تعذّر تسجيل الدخول. تحقق من اسم المستخدم وكلمة المرور.",
    back: "العودة إلى الموقع",
    artLabel: "اصنع الرحلة",
    art: "حافظ على تحديث كل رحلة وعرض وحكاية.",
    switchLabel: "English",
  },
} as const;

export default function LoginPage() {
  const navigate = useNavigate();
  const theme = useStoredTheme();
  const [language, setLanguage] = useState<LoginLanguage>(() =>
    localStorage.getItem("alkutbi-admin-language") === "ar" ? "ar" : "en",
  );
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const copy = loginCopy[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = copy.pageTitle;
    localStorage.setItem("alkutbi-admin-language", language);
  }, [copy.pageTitle, language]);

  useEffect(() => {
    apiRequest<{ user: { id: number } | null }>("/api/auth/session")
      .then(({ user }) => setAuthenticated(Boolean(user)))
      .catch(() => setAuthenticated(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });
      navigate("/dashboard", { replace: true });
    } catch {
      setError(copy.error);
    } finally {
      setSubmitting(false);
    }
  }

  if (authenticated === null)
    return (
      <LoadingSpinner
        label={
          language === "ar" ? "جارٍ التحقق من الجلسة…" : "Checking session…"
        }
        fullPage
        inverse={theme === "dark"}
      />
    );
  if (authenticated) return <Navigate to="/dashboard" replace />;

  return (
    <main className="admin-auth-shell" dir="ltr">
      <button
        className="login-language-toggle login-language-floating"
        type="button"
        onClick={() =>
          setLanguage((current) => (current === "en" ? "ar" : "en"))
        }
        aria-label={
          language === "en"
            ? "عرض صفحة الدخول بالعربية"
            : "Show the login page in English"
        }
      >
        <span aria-hidden="true">文</span>
        <span>EN</span>
        <i aria-hidden="true" />
        <span>العربية</span>
      </button>
      <section
        className="login-panel"
        dir={language === "ar" ? "rtl" : "ltr"}
        aria-labelledby="login-title"
      >
        <div className="login-topbar">
          <a className="admin-brand" href="/" aria-label={copy.back}>
            <Logo />
            <span>ALKUTBI GROUP</span>
          </a>
        </div>
        <div className="login-heading">
          <p>{copy.eyebrow}</p>
          <h1 id="login-title">{copy.title}</h1>
          <span>{copy.intro}</span>
        </div>
        <form className="admin-form login-form" onSubmit={handleSubmit}>
          <label>
            {copy.username}
            <input name="username" autoComplete="username" required dir="ltr" />
          </label>
          <label>
            {copy.password}
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={8}
              required
              dir="ltr"
            />
          </label>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <button
            className="admin-primary-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? copy.submitting : copy.submit}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
        <a className="back-link" href="/">
          ← {copy.back}
        </a>
      </section>
      <aside
        className="login-art"
        aria-hidden="true"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div></div>
      </aside>
    </main>
  );
}
