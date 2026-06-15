import "./Footer.css";

export default function Footer() {
  const footerLinks = [
    {
      label: "GitHub",
      href: "https://github.com/yanis26x",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/yanis26x",
    },
    {
      label: "Website",
      href: "https://yanis26x.github.io/yanis26x/",
    },
  ];

  return (
    <footer className="siteFooter">
      <div className="footerTop">
        <div className="footerBrand">
          <span>SoundSync</span>
          <small>Transfer Anywhere, Sync Everything</small>
        </div>

        <div className="footerCenter">
          <nav className="footerLinks">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <span className="footerSocialTag">
            @yanis26x on all socials
          </span>
        </div>

        <div className="footerCopyright">
          <span>© 2026 SoundSync</span>
          <span>© 2026 yanis26x · all rights reserved</span>
        </div>
      </div>

      <div className="footerBottom">
        <p>BL00d + F13nD & V@mP+ N1t3MaR3! </p>

        <a
          href="https://apps.apple.com/us/app/qibla/id6754793667"
          target="_blank"
          rel="noreferrer"
          className="appStoreBtn"
        >
          Download my latest app on the App Store
        </a>
      </div>

      <img
        src="/miku-onion.webp"
        alt=""
        aria-hidden="true"
        className="footerMikuOnion"
      />
    </footer>
  );
}
