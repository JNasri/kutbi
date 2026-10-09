import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import { content, type Language } from './siteContent';
import Header, { type Theme } from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import LoadingSpinner from './components/LoadingSpinner';
import type { PlannerMode } from './components/TripPlanner';
import { preloadHeroPosts, preloadPublishedPosts } from './lib/blogs';
import { getTravelContent } from './lib/siteContentApi';
import type { TravelContent } from './types/siteContent';

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
  const [travelContent, setTravelContent] = useState<TravelContent | null>(null);
  useEffect(() => { void getTravelContent().then(setTravelContent).catch(() => undefined); }, []);
  const copy = useMemo(() => {
    const base = content[language];
    if (!travelContent) return base;
    const packages = travelContent.packages.map(({ key, data }) => ({
      id:key, image:data.image_url, name:language === 'ar' ? data.name_ar : data.name_en,
      label:language === 'ar' ? data.label_ar : data.label_en, price:data.price,
      pricePrefix:language === 'ar' ? data.price_prefix_ar : data.price_prefix_en,
      priceLabel:language === 'ar' ? data.price_label_ar : data.price_label_en,
      description:language === 'ar' ? data.description_ar : data.description_en,
      features:language === 'ar' ? data.features_ar : data.features_en,
      cta:language === 'ar' ? data.cta_ar : data.cta_en, featured:data.featured,
    }));
    const offers = travelContent.offers.map(({ data }) => ({
      title:language === 'ar' ? data.title_ar : data.title_en,
      text:language === 'ar' ? data.text_ar : data.text_en,
      image:data.image_url,
    }));
    return { ...base, planner:{ ...base.planner, packages }, offers:{ ...base.offers, offers } };
  }, [language, travelContent]);

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
          <Route path="trips" element={<div className="routed-page"><TripPlanner key={`planner-${language}`} copy={copy.planner} transport={copy.transport} mode={plannerMode} onModeChange={changePlannerMode} /><SeasonalOffers copy={copy.offers} /><DiscoverSaudi key={`discover-${language}`} copy={copy.discover} /></div>} />
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
  return (
    <Suspense fallback={<LoadingSpinner label="Loading… / جارٍ التحميل…" fullPage />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashborad" element={<Navigate to="/dashboard" replace />} />
        <Route path="/*" element={<MarketingSite />} />
      </Routes>
    </Suspense>
  );
}


