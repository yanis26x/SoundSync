import "./Footer.css";

const turnHerOffSound = new URL("../../../../SOUND/Miku/Turnheroff.mp3", import.meta.url).href;

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

  const playTurnHerOffSound = () => {
    const audio = new Audio(turnHerOffSound);
    audio.volume = 0.55;
    audio.play().catch(() => {});
  };

  return (
    <footer className="siteFooter">
      <div className="footerGlow" aria-hidden="true"></div>

      <div className="footerTop">
        <div className="footerBrand">
          <p>SoundSync</p>
          <span>Transfer Anywhere, Sync Everything</span>
        </div>

        <div className="footerCenter">
          <nav className="footerLinks" aria-label="Footer links">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </nav>

          <span className="footerSocialTag">@yanis26x on all socials</span>
        </div>

        <div className="footerCopyright">
          <span>© 2026 SoundSync</span>
          <span>© 2026 yanis26x · all rights reserved</span>
        </div>
      </div>

      <div className="footerDivider">
      </div>

      <div className="footerBottom">
        <p>BL00d + F13nD & V@mP+ N1t3MaR3!</p>

        <span className="footerStar">
hello?!</span>

        <a
          href="https://apps.apple.com/us/app/qibla/id6754793667"
          target="_blank"
          rel="noreferrer"
          className="appStoreBtn"
        >
          Download my latest app on the App Store
        </a>
      </div>

      <button
        type="button"
        className="footerMikuOnionBtn"
        onClick={playTurnHerOffSound}
        aria-label="Play Miku sound"
      >
        <img
          src="/utils/miku-onion.webp"
          alt=""
          aria-hidden="true"
          className="footerMikuOnion"
        />
      </button>
    </footer>
  );
}
