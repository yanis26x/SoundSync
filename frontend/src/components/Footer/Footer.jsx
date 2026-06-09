import "./Footer.css";

export default function Footer() {
  const footerLinks = [
    { label: "GitHub", href: "https://github.com/yanis26x" },
    { label: "Instagram", href: "https://www.instagram.com/yanis26x" },
    { label: "Portfolio", href: "https://yanis26x.github.io/yanis26x/" },
    { label: "Contact", href: "mailto:yanis26x@gmail.com" },
    { label: "Site web", href: "https://yanis26x.github.io/yanis26x/" },
  ];

  return (
    <footer className="siteFooter">
      <div className="footerBrand">
        <span>SoundSync</span>
        <small>Sync your music anywhere</small>
      </div>

      <nav className="footerLinks" aria-label="Footer links">
        {footerLinks.map((link) => (
          <a href={link.href} key={link.label} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </nav>

      <div className="footerCopyright">
        <span>© 2026 SoundSync</span>
        <span>© 2026 yanis26x · all rights reserved</span>
      </div>
    </footer>
  );
}
