import axios from "axios";
import { useEffect, useState } from "react";
import { themes } from "./themes";
import MusicParticles from "./components/Particles/MusicParticles";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import "./Profil.css";

function Profil() {
  const [currentTheme, setCurrentTheme] = useState("tomo");
  const [language, setLanguageState] = useState(
    () => localStorage.getItem("language") || "en"
  );
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("spotify_access_token") || ""
  );
  const [youtubeAccessToken, setYoutubeAccessToken] = useState(
    () => localStorage.getItem("youtube_access_token") || ""
  );
  const [appleMusicUserToken, setAppleMusicUserToken] = useState(
    () => localStorage.getItem("apple_music_user_token") || ""
  );
  const [appleError, setAppleError] = useState("");

  const copy = {
    en: {
      profileTitle: "Profile",
      online: "Connected",
      offline: "Offline",
      connect: "Connect",
      disconnect: "Disconnect",
      switchAccount: "Switch account",
      appleLoginError: "Unable to connect to Apple Music.",
    },
    fr: {
      profileTitle: "Profil",
      online: "Connecte",
      offline: "Offline",
      connect: "Se connecter",
      disconnect: "Deconnecter",
      switchAccount: "Changer de compte",
      appleLoginError: "Impossible de se connecter a Apple Music.",
    },
  };
  const text = copy[language] || copy.en;

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

  const removePlatformChoice = (platformId) => {
    const savedOrder = localStorage.getItem("platform_order");

    try {
      const nextOrder = savedOrder
        ? JSON.parse(savedOrder).filter((currentPlatformId) => currentPlatformId !== platformId)
        : [];
      localStorage.setItem("platform_order", JSON.stringify(nextOrder));
    } catch {
      localStorage.setItem("platform_order", JSON.stringify([]));
    }
  };

  const loginSpotify = () => {
    window.location.href = "http://127.0.0.1:8000/auth/spotify";
  };

  const loginYoutube = () => {
    window.location.href = "http://127.0.0.1:8000/auth/google";
  };

  const loadMusicKit = () =>
    new Promise((resolve, reject) => {
      if (window.MusicKit) {
        resolve(window.MusicKit);
        return;
      }

      const existingScript = document.querySelector("script[data-musickit]");

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(window.MusicKit));
        existingScript.addEventListener("error", reject);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://js-cdn.music.apple.com/musickit/v1/musickit.js";
      script.async = true;
      script.dataset.musickit = "true";
      script.addEventListener("load", () => resolve(window.MusicKit));
      script.addEventListener("error", reject);
      document.body.appendChild(script);
    });

  const loginAppleMusic = async () => {
    setAppleError("");

    try {
      const tokenResponse = await axios.get("http://127.0.0.1:8000/api/apple/token");
      const MusicKit = await loadMusicKit();

      MusicKit.configure({
        developerToken: tokenResponse.data.token,
        app: {
          name: "SoundSync",
          build: "1.0.0",
        },
      });

      const music = MusicKit.getInstance();
      await music.unauthorize().catch(() => {});
      const userToken = await music.authorize();

      localStorage.setItem("apple_music_user_token", userToken);
      setAppleMusicUserToken(userToken);
    } catch (err) {
      setAppleError(err.response?.data?.message || text.appleLoginError);
    }
  };

  const logoutSpotify = () => {
    localStorage.removeItem("spotify_access_token");
    removePlatformChoice("spotify");
    setAccessToken("");
  };

  const logoutYoutube = () => {
    localStorage.removeItem("youtube_access_token");
    removePlatformChoice("youtube");
    setYoutubeAccessToken("");
  };

  const logoutAppleMusic = async () => {
    localStorage.removeItem("apple_music_user_token");
    removePlatformChoice("apple");
    setAppleMusicUserToken("");

    try {
      const tokenResponse = await axios.get("http://127.0.0.1:8000/api/apple/token");
      const MusicKit = await loadMusicKit();

      MusicKit.configure({
        developerToken: tokenResponse.data.token,
        app: {
          name: "SoundSync",
          build: "1.0.0",
        },
      });

      await MusicKit.getInstance().unauthorize();
    } catch (err) {
      console.warn("Apple Music logout local only:", err);
    }
  };

  const accountPlatforms = [
    {
      id: "spotify",
      name: "Spotify",
      logo: "/logo/mini/spotify-mini.png",
      isConnected: Boolean(accessToken),
      login: loginSpotify,
      switchAccount: () => {
        logoutSpotify();
        loginSpotify();
      },
      logout: logoutSpotify,
    },
    {
      id: "youtube",
      name: "YouTube",
      logo: "/logo/mini/youtube-mini.png",
      isConnected: Boolean(youtubeAccessToken),
      login: loginYoutube,
      switchAccount: () => {
        logoutYoutube();
        loginYoutube();
      },
      logout: logoutYoutube,
    },
    {
      id: "apple",
      name: "Apple Music",
      logo: "/logo/appleMusic.png",
      isConnected: Boolean(appleMusicUserToken),
      login: loginAppleMusic,
      switchAccount: async () => {
        await logoutAppleMusic();
        loginAppleMusic();
      },
      logout: logoutAppleMusic,
    },
  ];

  return (
    <main className="profilPage">
      <MusicParticles />
      <Navbar
        themes={themes}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        language={language}
        setLanguage={setLanguage}
        onOpenProfile={() => {
          window.location.href = "/";
        }}
        profileLabel="Home"
      />

      <section className="profilPanel">
        <h1>{text.profileTitle}</h1>

        {appleError && (
          <p className="error">{appleError}</p>
        )}

        <div className="profileAccountList">
          {accountPlatforms.map((platform) => (
            <article className="profileAccountCard" key={platform.id}>
              <div className="profileAccountMain">
                <img src={platform.logo} alt={platform.name} />

                <div>
                  <h3>{platform.name}</h3>
                  <p className={platform.isConnected ? "success" : "offlineText"}>
                    {platform.isConnected ? text.online : text.offline}
                  </p>
                </div>
              </div>

              <div className="profileAccountActions">
                {platform.isConnected ? (
                  <>
                    <button
                      className="secondaryBtn"
                      onClick={platform.switchAccount}
                    >
                      {text.switchAccount}
                    </button>

                    <button
                      className="dangerBtn"
                      onClick={platform.logout}
                    >
                      {text.disconnect}
                    </button>
                  </>
                ) : (
                  <button onClick={platform.login}>
                    {text.connect}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Profil;
