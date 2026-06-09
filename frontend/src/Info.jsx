import { useEffect, useState } from "react";
import { themes } from "./themes";
import MusicParticles from "./components/Particles/MusicParticles";
import TopLeftBtn from "./components/TopLeft/TopLeftBtn";
import TopRightActionBtn from "./components/TopRight/TopRightActionBtn";
import "./App.css";
import "./Info.css";

function Info() {
  const [currentTheme, setCurrentTheme] = useState("tomo");
  const [language, setLanguageState] = useState(
    () => localStorage.getItem("language") || "en"
  );

  const setLanguage = (nextLanguage) => {
    localStorage.setItem("language", nextLanguage);
    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    const theme = themes[currentTheme];

    document.documentElement.style.setProperty("--bg-image", `url(${theme.background})`);
    document.documentElement.style.setProperty("--card-bg", theme.cardBg);
    document.documentElement.style.setProperty("--border-color", theme.border);
    document.documentElement.style.setProperty("--accent", theme.accent);
    document.documentElement.style.setProperty("--accent-soft", theme.accentSoft);
    document.documentElement.style.setProperty("--text-color", theme.text);
  }, [currentTheme]);

  return (
    <main className="infoPage">
      <MusicParticles />
      <TopLeftBtn />
      <TopRightActionBtn
        themes={themes}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        language={language}
        setLanguage={setLanguage}
        onOpenProfile={() => {
          window.location.href = "/";
        }}
        profileLabel="Home"
        onOpenInfo={() => {
          window.location.href = "/Profil";
        }}
        infoLabel="Profil"
      />

      <section className="infoHero">
        <img
          src="/SoundSync/SoundSyncLogoNoBG.png"
          alt="SoundSync"
          className="infoHeroLogo"
        />

        <div className="infoHeroText">
          <h1>SoundSync Info𖤐</h1>
          <p>
            SoundSync is made to move your music between platforms without
            making playlist transfer feel complicated. Connect your accounts,
            choose the source playlist, pick where it should go, then follow the
            live transfer progress track by track.
          </p>
        </div>
      </section>

      <section className="infoGrid">
        <article className="infoCard">
          <img src="/logo/mini/spotify-mini.png" alt="Spotify" />
          <h2>Spotify</h2>
          <p>
            Import your Spotify playlists, keep track names clean, and create or
            update playlists during a transfer.
          </p>
        </article>

        <article className="infoCard">
          <img src="/logo/mini/youtube-mini.png" alt="YouTube" />
          <h2>YouTube</h2>
          <p>
            Use YouTube playlists as a source or destination while SoundSync
            searches matching videos for each song.
          </p>
        </article>

        <article className="infoCard">
          <img src="/logo/appleMusic.png" alt="Apple Music" />
          <h2>Apple Music</h2>
          <p>
            Apple Music login and playlist reading are included, with transfer
            support expanding as platform APIs allow it.
          </p>
        </article>
      </section>

      <section className="infoBanner">
        <div>
          <h2>How it works</h2>
          <p>
            Pick platform one, pick platform two, select a playlist, then choose
            between a new playlist or an existing one. SoundSync shows added
            tracks, failed matches, and songs that were already present.
          </p>
        </div>
        <img src="/logo/mini/SoundSync-mini-logo-noBG.png" alt="" />
      </section>

    </main>
  );
}

export default Info;
