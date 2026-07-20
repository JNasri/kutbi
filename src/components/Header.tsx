import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuLockKeyhole } from 'react-icons/lu';
import type { Language } from '../siteContent';
import Logo from './Logo';

export type Theme = 'light' | 'dark';

type HeaderCopy = {
  brand: string; brandEn: string; menu: string; close: string; language: string; portal: string;
  nav: readonly { label: string; href: string }[];
};

const employeePortalUrl = 'https://alkutbigroup.click';

type HeaderProps = {
  language: Language;
  setLanguage: (value: Language) => void;
  theme: Theme;
  setTheme: (value: Theme) => void;
  copy: HeaderCopy;
};

export default function Header({ language, setLanguage, theme, setTheme, copy }: HeaderProps) {
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

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const goTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const themeLabel = language === 'ar'
    ? (theme === 'light' ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح')
    : (theme === 'light' ? 'Enable dark mode' : 'Enable light mode');

  const mobileMenu = createPortal(
    <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open} role="dialog" aria-modal="true" aria-label={copy.menu}>
      <div className="mobile-menu-top">
        <span className="brand"><Logo /><span><b>{copy.brand}</b><small>{copy.brandEn}</small></span></span>
        <div className="mobile-menu-actions">
          <button className="language-switch" type="button" onClick={toggleLanguage} aria-label={copy.language}><span>{language === 'ar' ? 'EN' : 'AR'}</span></button>
          <button className="theme-switch" type="button" onClick={toggleTheme} aria-label={themeLabel}><span className="theme-icon" aria-hidden="true">{theme === 'light' ? '◐' : '◑'}</span></button>
          <button className="close-button" type="button" onClick={() => setOpen(false)} aria-label={copy.close}>×</button>
        </div>
      </div>

      <div className="mobile-menu-body">
        <div className="mobile-menu-intro">
          <small>{language === 'ar' ? 'مجموعة الكتبي' : 'ALKUTBI GROUP'}</small>
          <p>{language === 'ar' ? 'رحلتك إلى المملكة، نصنعها بعناية.' : 'Your journey to Saudi, designed with care.'}</p>
          <span>{language === 'ar' ? 'نبني ما يبقى.' : 'Building what endures.'}</span>
        </div>
        <nav>
          {copy.nav.map((item, index) => (
            <a key={item.href} href={item.href} onClick={(event) => { event.preventDefault(); goTo(item.href); }}>
              <small>0{index + 1}</small><span>{item.label}</span><b>↗</b>
            </a>
          ))}
          <a className="mobile-portal-link" href={employeePortalUrl} target="_blank" rel="noopener noreferrer">
            <small>06</small><span>{copy.portal}</span><LuLockKeyhole aria-hidden="true" focusable="false" />
          </a>
        </nav>
      </div>

      <div className="mobile-menu-footer"><span>ALKUTBI GROUP · SAUDI ARABIA</span><i /></div>
    </div>,
    document.body,
  );

  return <>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); goTo('#home'); }} aria-label={copy.brand}>
        <Logo />
        <span><b>{copy.brand}</b><small>{copy.brandEn}</small></span>
      </a>

      <nav className="desktop-nav" aria-label={copy.menu}>
        {copy.nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
      </nav>

      <div className="header-actions">
        <a className="employee-portal" href={employeePortalUrl} target="_blank" rel="noopener noreferrer" aria-label={copy.portal} title={copy.portal}>
          <LuLockKeyhole aria-hidden="true" focusable="false" />
          <span className="employee-portal-label">{copy.portal}</span>
        </a>
        <button className="theme-switch" type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}><span className="theme-icon" aria-hidden="true">{theme === 'light' ? '◐' : '◑'}</span></button>
        <button className="language-switch" type="button" onClick={toggleLanguage} aria-label={copy.language} title={copy.language}><span aria-hidden="true">{language === 'ar' ? 'EN' : 'AR'}</span></button>
        <button className="menu-button" type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-label={copy.menu}><span /><span /></button>
      </div>
    </header>
    {mobileMenu}
  </>;
}
