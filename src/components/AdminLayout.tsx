import { createContext, Suspense, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { FiGlobe } from 'react-icons/fi';
import { translateAdmin } from '../lib/adminCopy';
import LoadingScreen from './LoadingScreen';
import '../adminStyles.css';

type Preferences = { language: 'en' | 'ar'; t: (text: string) => string };
const AdminContext = createContext<Preferences>({ language: 'en', t: (text) => text });
export const useAdmin = () => useContext(AdminContext);

export default function AdminLayout() {
  const [language, setLanguage] = useState<'en' | 'ar'>(() => localStorage.getItem('alkutbi-admin-language') === 'ar' ? 'ar' : 'en');
  const t = (text: string) => translateAdmin(text, language);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.style.colorScheme = 'dark';
    localStorage.setItem('alkutbi-admin-language', language);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#10271f');
  }, [language]);

  return (
    <AdminContext.Provider value={{ language, t }}>
      <div className="admin-interface" data-admin-theme="dark" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <header className="admin-topbar"><a href="/" className="admin-topbar-brand">{t('ALKUTBI')}<span>{t('Content studio')}</span></a><div className="admin-preferences">
          <button type="button" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} aria-label={t(language === 'en' ? 'Switch to Arabic' : 'Switch to English')}><FiGlobe aria-hidden="true" /><span>{language === 'en' ? 'العربية' : 'English'}</span></button>
        </div></header>
        <Suspense fallback={<LoadingScreen overlay label={t('Loading…')} />}><Outlet /></Suspense>
      </div>
    </AdminContext.Provider>
  );
}
