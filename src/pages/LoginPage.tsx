import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router';
import Logo from '../components/Logo';
import { apiRequest } from '../lib/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.title = 'Admin login | Alkutbi Group';
    apiRequest<{ user: { id: number } | null }>('/api/auth/session')
      .then(({ user }) => setAuthenticated(Boolean(user)))
      .catch(() => setAuthenticated(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: form.get('username'), password: form.get('password') }),
      });
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  }

  if (authenticated) return <Navigate to="/dashboard" replace />;

  return (
    <main className="admin-auth-shell">
      <section className="login-panel" aria-labelledby="login-title">
        <a className="admin-brand" href="/" aria-label="Back to Alkutbi Group"><Logo /><span>ALKUTBI GROUP</span></a>
        <div className="login-heading">
          <p>PRIVATE ADMINISTRATION</p>
          <h1 id="login-title">Welcome back.</h1>
          <span>Sign in to manage the stories shown on the website.</span>
        </div>
        <form className="admin-form login-form" onSubmit={handleSubmit}>
          <label>Username<input name="username" autoComplete="username" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" minLength={8} required /></label>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button className="admin-primary-button" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}<span>↗</span></button>
        </form>
        <a className="back-link" href="/">← Return to website</a>
      </section>
      <aside className="login-art" aria-hidden="true"><div><small>CURATE THE JOURNEY</small><p>Every story becomes an invitation to discover Saudi Arabia.</p></div></aside>
    </main>
  );
}

