import { useEffect, useState } from "react";
import { themes } from "../../themes";
import MusicParticles from "../../components/TOUTLESPAGES/Particles/MusicParticles";
import Navbar from "../../components/TOUTLESPAGES/Navbar/Navbar";
import "../Menu/Menu.css";
import "./Info.css";

const infoCards = [
  {
    title: "Built for playlist chaos",
    text: "SoundSync keeps your playlists moving between Spotify, YouTube Music, Apple Music, and more without forcing you to rebuild everything by hand.",
    image: "/SoundSync/logo-SS.png",
    className: "soundSyncInfoLogo",
  },

  {
    title: "From Spotify2YTB to SoundSync",
    text: "About a year ago, I built a small project called Spotify2YTB. It could transfer playlists from Spotify to YouTube, but the code was messy, slow, and honestly... pretty terrible. I abandoned it for almost a year. Then I came back, deleted everything, started from scratch, redesigned the whole experience, and built what eventually became SoundSync.",
    image: "/SoundSync/logo-SS.png",
    className: "soundSyncInfoLogo",
  },



  {
    title: "Made by @yanis26x",
    text: "I'm Yanis, a 20-year-old developer from Montreal who loves building weird, fun, and useful apps. SoundSync is one of many personal projects I've made, alongside websites, mobile apps, and other experiments. If you like this project, feel free to check out my other work and say hi on social media.",
    image: "/utils/yanis26xPFP2.jpg",
    className: "creatorInfoImage",
  },

  {
    title: "Do it with Miku",
    text: "Miku guides you through every step of the syncing process. I wrote dozens of different voice lines so she doesn't keep repeating the same thing. The goal was to make it feel like she's actually talking to you instead of sounding like a boring assistant.",
    image: "/utils/miku-onion.webp",
    className: "mikuInfoImage",
  },

  {
    title: "No subscriptions. No premium.",
    text: "SoundSync is designed to stay simple. No subscriptions, no paywalls, and no 'upgrade to continue' messages. Just connect your accounts, choose your playlist, and sync.",
    image: "/SoundSync/logo-SS.png",
    className: "soundSyncInfoLogo",
  },

  {
    title: "More platforms are coming",
    text: "Spotify, Apple Music, YouTube Music, SoundCloud, Deezer... SoundSync will continue growing over time. Every new platform means more freedom for your playlists.",
    image: "/SoundSync/logo-SS.png",
    className: "soundSyncInfoLogo",
  },
];

function Info() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("sound_sync_theme");

    return themes[savedTheme] ? savedTheme : "miku";
  });
  const [particlesEnabled] = useState(() => {
    const savedSettings = localStorage.getItem("sound_sync_custom_settings");

    try {
      return savedSettings
        ? JSON.parse(savedSettings).particlesEnabled !== false
        : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const theme = themes[currentTheme];

    document.documentElement.style.setProperty("--bg-image", theme.background ? `url(${theme.background})` : theme.backgroundColor || "none");
    document.documentElement.style.setProperty("--bg-color", theme.background ? theme.backgroundColor || "#0d0d0d" : "#000000");
    document.documentElement.style.setProperty("--bg-size", theme.background ? "cover" : "170% 170%");
    document.documentElement.style.setProperty("--card-bg", theme.cardBg);
    document.documentElement.style.setProperty("--border-color", theme.border);
    document.documentElement.style.setProperty("--accent", theme.accent);
    document.documentElement.style.setProperty("--accent-soft", theme.accentSoft);
    document.documentElement.style.setProperty("--text-color", theme.text);
  }, [currentTheme]);

  return (
    <main className="infoPage">
      {particlesEnabled && <MusicParticles />}

      <Navbar
        themes={themes}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        onOpenTransfer={() => {
          window.location.href = "/";
        }}
        transferLabel="Home"
        activePage="info"
        showTransferButton={true}
        showInfoButton={true}
        showProfileButton={true}
        showThemeButton={false}
      />

      <section className="infoPanel" aria-labelledby="infoTitle">
        <div className="infoHero">
          <div>
            <h1 id="infoTitle">Info</h1>
            <span>Learn more about SoundSync, the app, and the person behind it.</span>
          </div>
        </div>

        <div className="profilInfoSection">
          <div className="profilInfoHeader">
            <span>Info</span>
            <h2>About SoundSync</h2>
          </div>

          <div className="profilInfoGrid">
            {infoCards.map((card) => (
              <article className="profilInfoCard" key={card.title}>
                <div className="profilInfoImageBox">
                  <img src={card.image} alt="" className={card.className} />
                </div>

                <div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Info;
