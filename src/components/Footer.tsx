import Logo from './Logo';

type FooterCopy = { statement: string; explore: string; contact: string; email: string; location: string; rights: string };
type NavItem = { label: string; href: string };

export default function Footer({ copy, nav, brand }: { copy: FooterCopy; nav: readonly NavItem[]; brand: string }) {
  return (
    <footer className="site-footer">
      <div className="footer-top content-wrap">
        <div className="footer-lead"><Logo /><p>{copy.statement}</p></div>
        <div className="footer-column"><h3>{copy.explore}</h3>{nav.slice(1).map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
        <div className="footer-column"><h3>{copy.contact}</h3><a href={`mailto:${copy.email}`}>{copy.email}</a><span>{copy.location}</span></div>
      </div>
      <div className="footer-bottom content-wrap"><p>© {new Date().getFullYear()} {brand}. {copy.rights}</p><a href="#home">↑</a></div>
    </footer>
  );
}
