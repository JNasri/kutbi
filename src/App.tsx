import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import { content, type Language } from './siteContent';
import Header, { type Theme } from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import type { PlannerMode } from './components/TripPlanner';
import { preloadHeroPosts, preloadPublishedPosts } from './lib/blogs';
import LoadingScreen from './components/LoadingScreen';

const Hero = lazy(() => import('./components/Hero'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const Services = lazy(() => import('./components/Services'));
const UmrahVisa = lazy(() => import('./components/UmrahVisa'));
const Transport = lazy(() => import('./components/Transport'));
const TripsPage = lazy(() => import('./pages/TripsPage'));
const TestimonialsContact = lazy(() => import('./components/TestimonialsContact'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const JournalArticlePage = lazy(() => import('./pages/JournalArticlePage'));

if (typeof window !== 'undefined') {
  if (window.location.pathname === '/') preloadHeroPosts();
  else if (window.location.pathname === '/journal') preloadPublishedPosts();
}

function MarketingSite() {
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem('alkutbi-theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [plannerMode, setPlannerMode] = useState<PlannerMode>(() => new URLSearchParams(window.location.search).get('mode') === 'custom' ? 'custom' : 'packages');
  const copy = content[language];

  const changePlannerMode = useCallback((mode: PlannerMode) => {
    setPlannerMode(mode);
    if (location.pathname === '/trips') navigate(`/trips?mode=${mode}`, { replace: true });
  }, [location.pathname, navigate]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    const currentPage = copy.nav.find((item) => item.href === location.pathname || (item.href === '/journal' && location.pathname.startsWith('/journal/')))?.label;
    document.title = currentPage ? `${currentPage} | ${copy.brand}` : `${copy.brand} | Alkutbi Group`;
  }, [copy.brand, copy.nav, language, location.pathname]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('alkutbi-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f7f3e8' : '#03110a');
  }, [theme]);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    let frame = 0;
    let attempts = 0;
    const scrollToTarget = () => {
      const target = document.querySelector(location.hash);
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
      attempts += 1;
      if (attempts < 120) frame = window.requestAnimationFrame(scrollToTarget);
    };

    frame = window.requestAnimationFrame(scrollToTarget);
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/trips') return;
    const requestedMode = new URLSearchParams(location.search).get('mode');
    if (requestedMode === 'packages' || requestedMode === 'custom') setPlannerMode(requestedMode);
  }, [location.pathname, location.search]);

  return (
    <div className="page-shell">
      <Header language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} copy={copy} />
      <main>
        <Routes>
          <Route index element={<div className="routed-page home-page"><Hero copy={copy.hero} language={language} onSelectPlannerMode={changePlannerMode} /><AboutUs copy={copy.about} /></div>} />
          <Route path="services" element={<div className="routed-page"><Services copy={copy.services} theme={theme} /><UmrahVisa copy={copy.visa} /><Transport copy={copy.transport} /></div>} />
          <Route path="trips" element={<TripsPage language={language} mode={plannerMode} onModeChange={changePlannerMode} />} />
          <Route path="contact" element={<div className="routed-page"><TestimonialsContact copy={copy.testimonialsContact} /></div>} />
          <Route path="journal" element={<JournalPage language={language} />} />
          <Route path="journal/:slug" element={<JournalArticlePage language={language} />} />
          <Route path="about" element={<Navigate to="/#about" replace />} />
          <Route path="fleet" element={<Navigate to="/services#transport" replace />} />
          <Route path="offers" element={<Navigate to="/trips#offers" replace />} />
          <Route path="discover" element={<Navigate to="/trips#discover" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <WhatsAppButton label={copy.whatsapp} />
      <Footer copy={copy.footer} nav={copy.nav} brand={copy.brand} />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const adminRoute = ['/login', '/dashboard', '/dashborad'].includes(location.pathname);
  const loadingLabel = adminRoute && localStorage.getItem('alkutbi-admin-language') === 'ar' ? 'جارٍ التحميل…' : 'Loading…';
  return (
    <Suspense fallback={<LoadingScreen dark={adminRoute} label={loadingLabel} />}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="/dashborad" element={<Navigate to="/dashboard" replace />} />
        <Route path="/*" element={<MarketingSite />} />
      </Routes>
    </Suspense>
  );
}
