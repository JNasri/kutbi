import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import { content, type Language } from './siteContent';
import Header, { type Theme } from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import type { PlannerMode } from './components/TripPlanner';

const Hero = lazy(() => import('./components/Hero'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const Services = lazy(() => import('./components/Services'));
const UmrahVisa = lazy(() => import('./components/UmrahVisa'));
const TripPlanner = lazy(() => import('./components/TripPlanner'));
const Transport = lazy(() => import('./components/Transport'));
const SeasonalOffers = lazy(() => import('./components/SeasonalOffers'));
const DiscoverSaudi = lazy(() => import('./components/DiscoverSaudi'));
const TestimonialsContact = lazy(() => import('./components/TestimonialsContact'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

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
    const currentPage = copy.nav.find((item) => item.href === location.pathname)?.label;
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

    const scrollTimer = window.setTimeout(() => {
      document.querySelector(location.hash)?.scrollIntoView({ block: 'start' });
    }, 180);

    return () => window.clearTimeout(scrollTimer);
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
          <Route path="trips" element={<div className="routed-page"><TripPlanner key={`planner-${language}`} copy={copy.planner} discover={copy.discover} transport={copy.transport} mode={plannerMode} onModeChange={changePlannerMode} /><SeasonalOffers copy={copy.offers} /><DiscoverSaudi key={`discover-${language}`} copy={copy.discover} /></div>} />
          <Route path="contact" element={<div className="routed-page"><TestimonialsContact copy={copy.testimonialsContact} /></div>} />
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
  return (
    <Suspense fallback={<div className="route-loader">Loading…</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashborad" element={<Navigate to="/dashboard" replace />} />
        <Route path="/*" element={<MarketingSite />} />
      </Routes>
    </Suspense>
  );
}
