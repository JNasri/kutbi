import { useEffect, useState } from 'react';
import type { Language } from '../siteContent';
import Logo from './Logo';

export type Theme = 'light' | 'dark';

type HeaderCopy = {
  brand: string; brandEn: string; menu: string; close: string; language: string;
  nav: readonly { label: string; href: string }[];
};

export default function Header({ language, setLanguage, theme, setTheme, copy }: { language: Language; setLanguage: (value: Language) => void; theme: Theme; setTheme: (value: Theme) => void; copy: HeaderCopy }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const goTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); goTo('#home'); }} aria-label={copy.brand}>
        <Logo />
        <span><b>{copy.brand}</b><small>{copy.brandEn}</small></span>
      </a>

      <nav className="desktop-nav" aria-label={copy.menu}>
        {copy.nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
      </nav>

      <div className="header-actions">
        <button
          className="theme-switch"
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={language === 'ar' ? (theme === 'light' ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح') : (theme === 'light' ? 'Enable dark mode' : 'Enable light mode')}
          title={language === 'ar' ? (theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح') : (theme === 'light' ? 'Dark mode' : 'Light mode')}
        >
          <span className="theme-icon" aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
        </button>
        <button className="language-switch" onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} aria-label={copy.language}>
          <span className={language === 'ar' ? 'active' : ''}>ع</span><i /><span className={language === 'en' ? 'active' : ''}>EN</span>
        </button>
        <button className="menu-button" onClick={() => setOpen(true)} aria-expanded={open} aria-label={copy.menu}>
          <span /><span />
        </button>
      </div>

      <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="mobile-menu-top">
          <span className="brand"><Logo /><span><b>{copy.brand}</b><small>{copy.brandEn}</small></span></span>
          <div className="mobile-menu-actions">
            <button className="theme-switch" type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={language === 'ar' ? 'تغيير المظهر' : 'Change theme'}><span className="theme-icon" aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span></button>
            <button className="close-button" onClick={() => setOpen(false)} aria-label={copy.close}>×</button>
          </div>
        </div>
        <nav>
          {copy.nav.map((item, index) => (
            <a key={item.href} href={item.href} onClick={(event) => { event.preventDefault(); goTo(item.href); }}>
              <small>0{index + 1}</small><span>{item.label}</span><b>↗</b>
            </a>
          ))}
        </nav>
        <p>{language === 'ar' ? 'نبني ما يبقى.' : 'Building what endures.'}</p>
      </div>
    </header>
  );
}
