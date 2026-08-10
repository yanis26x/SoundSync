import { useEffect, useState } from "react";
import { themes } from "../../themes";
import MusicParticles from "../../components/TOUTLESPAGES/Particles/MusicParticles";
import Navbar from "../../components/TOUTLESPAGES/Navbar/Navbar";
import "../Menu/Menu.css";
import "./Info.css";

const transferSteps = [
  {
    number: "00",
    title: "Watch the demo",
    text: "Start here if you want to see the full transfer flow before trying it yourself.",
    videoId: "tJKpbC9Y5h0",
  },
  {
    number: "01",
    title: "Start a transfer",
    text: "Click START, then choose the platform where your playlist already exists.",
  },
  {
    number: "02",
    title: "Connect your accounts",
    text: "Log in to Spotify, YouTube, or Apple Music when SoundSync asks for access.",
  },
  {
    number: "03",
    title: "Pick a playlist",
    text: "Choose the source playlist you want to sync. SoundSync will load the tracks for you.",
  },
  {
    number: "04",
    title: "Choose where it goes",
    text: "Select the destination platform, then choose a new playlist or add to an existing one.",
  },
  {
    number: "05",
    title: "Review and launch",
    text: "Keep all tracks selected or remove the ones you do not want, then start the transfer.",
  },
];

const tips = [
  {
    title: "Disconnect a platform",
    text: "Go to Profil, find the connected platform, then use Disconnect.",
  },
  {
    title: "Change account",
    text: "Go to Profil and use Switch account on the platform you want to replace.",
  },
  {
    title: "Customize the app",
    text: "Open Custom from the navbar to change themes, sounds, notifications, voices, and particles.",
  },
  {
    title: "Retry missing songs",
    text: "If some tracks fail, use Retry failed tracks after the transfer instead of restarting everything.",
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

      <section className="infoPanel">
        <section className="infoSection" aria-labelledby="transferStepsTitle">
          <div className="infoSectionHeader">
            <span>Transfer</span>
            <h2 id="transferStepsTitle">Steps</h2>
          </div>

          <div className="infoStepsGrid">
            {transferSteps.map((step) => (
              <article
                className={`infoStepCard ${step.videoId ? "infoVideoStepCard" : ""}`}
                key={step.number}
              >
                {step.videoId && (
                  <div className="infoStepVideo">
                    <iframe
                      src={`https://www.youtube.com/embed/${step.videoId}`}
                      title="SoundSync app demo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                )}

                <div>
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="infoSection" aria-labelledby="tipsTitle">
          <div className="infoSectionHeader">
            <span>Tips</span>
            <h2 id="tipsTitle">Useful things to know</h2>
          </div>

          <div className="infoTipsGrid">
            {tips.map((tip) => (
              <article className="infoTipCard" key={tip.title}>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="infoCreatorSection" aria-labelledby="creatorTitle">
          <div className="infoCreatorCard">
            <img src="/IMAGE/utils/yanis26xPFP2.jpg" alt="" />
            <div>
              <span>Made by @yanis26x</span>
              <h2 id="creatorTitle">From Spotify2YTB to SoundSync</h2>
              <p>
                About a year ago, I built a small project called Spotify2YTB. It could transfer playlists from Spotify to YouTube, but the code was messy, slow, and honestly... pretty terrible. I abandoned it for almost a year. Then I came back, deleted everything, started from scratch, redesigned the whole experience, and built what eventually became SoundSync.
              </p>
              <a
                href="https://youtu.be/sBKze5G8eKU"
                target="_blank"
                rel="noreferrer"
                className="oldAppDemoBtn"
              >
                Watch old app demo
              </a>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Info;
