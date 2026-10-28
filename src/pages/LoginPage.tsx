import AdminForm from '../components/AdminForm';
import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import Logo from '../components/Logo';
import LoadingScreen from '../components/LoadingScreen';
import { useAdmin } from '../components/AdminLayout';
import { ApiError, apiRequest } from '../lib/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { language, t } = useAdmin();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { document.title = `${t('Sign in')} | ${t('Alkutbi Group')}`; }, [language]);
  useEffect(() => {
    let active = true;
    apiRequest<{ user: { id: number } | null }>('/api/auth/session')
      .then(({ user }) => { if (active) setAuthenticated(Boolean(user)); })
      .catch(() => { if (active) setAuthenticated(false); });
    return () => { active = false; };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ username: form.get('username'), password: form.get('password') }) });
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError instanceof ApiError && requestError.status === 401 ? 'Please check your username and password.' : requestError instanceof Error ? requestError.message : 'Unable to sign in.');
    } finally { setSubmitting(false); }
  }

  if (authenticated) return <Navigate to="/dashboard" replace />;
  if (authenticated === null) return <LoadingScreen overlay label={t('Checking your session…')} />;

  return (
    <>
      <main className="studio-login-minimal" inert={submitting} aria-busy={submitting}>
        <section className="minimal-login-card" aria-labelledby="login-title">
          <div className="minimal-login-heading"><Logo decorative /><h1 id="login-title">{t('Sign in')}</h1></div>
            <AdminForm className="studio-login-form" onSubmit={handleSubmit}>
              <label>{t('Username')}<input name="username" autoComplete="username" dir="ltr" required disabled={submitting} /></label>
              <div className="studio-password-field"><label htmlFor="admin-password">{t('Password')}</label><div><input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" dir="ltr" minLength={8} required disabled={submitting} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={t(showPassword ? 'Hide password' : 'Show password')}>{showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}</button></div></div>
              {error ? <p className="studio-login-error" role="alert">{t(error)}</p> : null}
              <button className="studio-login-submit" type="submit" disabled={submitting}>{t('Sign in')}</button>
            </AdminForm>
          <a className="studio-login-back" href="/"><FiArrowLeft aria-hidden="true" />{t('Return to website')}</a>
        </section>
      </main>
      {submitting ? <LoadingScreen overlay label={t('Signing in…')} /> : null}
    </>
  );
}
