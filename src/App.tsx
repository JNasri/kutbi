import { useEffect, useState } from 'react';
import { content, type Language } from './siteContent';
import Header from './components/Header';
import type { Theme } from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Services from './components/Services';
import Transport from './components/Transport';
import DiscoverSaudi from './components/DiscoverSaudi';
import TripPlanner from './components/TripPlanner';
import WhatsAppButton from './components/WhatsAppButton';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem('alkutbi-theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });
  const copy = content[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = language === 'ar' ? 'مجموعة الكتبي | Alkutbi Group' : 'Alkutbi Group | مجموعة الكتبي';
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('alkutbi-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f7f3e8' : '#03110a');
  }, [theme]);

  useEffect(() => {
    if (!window.location.hash) return;

    const scrollTimer = window.setTimeout(() => {
      document.querySelector(window.location.hash)?.scrollIntoView({ block: 'start' });
    }, 120);

    return () => window.clearTimeout(scrollTimer);
  }, []);

  return (
    <div className="page-shell">
      <Header language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} copy={copy} />
      <main>
        <Hero copy={copy.hero} />
        <Services copy={copy.services} />
        <Transport copy={copy.transport} />
        <DiscoverSaudi key={`discover-${language}`} copy={copy.discover} />
        <TripPlanner key={`planner-${language}`} copy={copy.planner} />
      </main>
      <WhatsAppButton label={copy.whatsapp} />
      <Footer copy={copy.footer} nav={copy.nav} brand={copy.brand} />
    </div>
  );
}
