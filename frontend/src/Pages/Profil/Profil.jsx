import axios from "axios";
import { useEffect, useState } from "react";
import { themes } from "../../themes";
import MusicParticles from "../../components/TOUTLESPAGES/Particles/MusicParticles";
import Navbar from "../../components/TOUTLESPAGES/Navbar/Navbar";
import "../Menu/Menu.css";
import "./Profil.css";
import Info from "./Info/Info";

function Profil() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("sound_sync_theme");

    return themes[savedTheme] ? savedTheme : "miku";
  });
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
  const [accountDetails, setAccountDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");

  const text = {
      profileTitle: "Profile",
      profileSubtitle: "Manage your connected music accounts.",
      online: "Connected",
      offline: "Offline",
      connect: "Connect",
      disconnect: "Disconnect",
      switchAccount: "Switch",
      appleLoginError: "Unable to connect to Apple Music.",
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

  useEffect(() => {
    const loadAccountDetails = async () => {
      setDetailsLoading(true);

      const loadPlatform = async (id, token, profilePath) => {
        if (!token) return [id, null];

        const headers = { Authorization: `Bearer ${token}` };
        const [playlistResult, profileResult] = await Promise.allSettled([
          axios.get(`http://127.0.0.1:8000/api/${id}/playlists`, { headers }),
          profilePath
            ? axios.get(`http://127.0.0.1:8000${profilePath}`, { headers })
            : Promise.resolve(null),
        ]);

        const playlistResponse = playlistResult.status === "fulfilled"
          ? playlistResult.value
          : null;
        const profileResponse = profileResult.status === "fulfilled"
          ? profileResult.value
          : null;
        const playlists = playlistResponse?.data?.playlists || [];
          const totalTracks = playlists.reduce((total, playlist) => {
            const count = id === "spotify"
              ? playlist.tracks?.total
              : id === "youtube"
                ? playlist.contentDetails?.itemCount
                : playlist.attributes?.trackCount;

            return total + (Number(count) || 0);
          }, 0);

        const profile = profileResponse?.data?.user || profileResponse?.data?.channel;

        return [id, {
          playlists: playlists.length,
          totalTracks,
          profile,
          statsUnavailable: !playlistResponse,
          profileUnavailable: Boolean(profilePath) && !profileResponse,
        }];
      };

      const entries = await Promise.all([
        loadPlatform("spotify", accessToken, "/api/spotify/me"),
        loadPlatform("youtube", youtubeAccessToken, "/api/youtube/me"),
        loadPlatform("apple", appleMusicUserToken),
      ]);

      setAccountDetails(Object.fromEntries(entries));
      setDetailsLoading(false);
    };

    loadAccountDetails();
  }, [accessToken, youtubeAccessToken, appleMusicUserToken]);

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
      logo: "/logo/mini/ytb-mini.png",
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
      logo: "/logo/mini/Apple-Music-mini.png",
      isConnected: Boolean(appleMusicUserToken),
      login: loginAppleMusic,
      switchAccount: async () => {
        await logoutAppleMusic();
        loginAppleMusic();
      },
      logout: logoutAppleMusic,
    },
  ];

  const getAccountPresentation = (platform) => {
    const details = accountDetails[platform.id];
    const profile = details?.profile;

    if (platform.id === "spotify") {
      return {
        username: profile?.display_name || profile?.id,
        extraLabel: "followers",
        extraValue: profile?.followers?.total,
      };
    }

    if (platform.id === "youtube") {
      return {
        username: profile?.snippet?.title,
        extraLabel: "videos",
        extraValue: profile?.statistics?.videoCount,
      };
    }

    return { username: platform.isConnected ? "Apple Music Library" : "" };
  };

  return (
    <main className="profilPage">
      <MusicParticles />

      <Navbar
        themes={themes}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        onOpenTransfer={() => {
          window.location.href = "/";
        }}
        transferLabel="Home"
        showTransferButton={true}
        showProfileButton={false}
        showThemeButton={false}
      />

      <section className="profilPanel">
        <div className="profilHeader">
          <div>
            <h1>{activeSection === "profile" ? text.profileTitle : "Info"}</h1>
            <span>
              {activeSection === "profile"
                ? text.profileSubtitle
                : "Learn more about SoundSync, the app, and the person behind it."}
            </span>
          </div>
        </div>

        <div className="profilSectionSwitch" aria-label="Profile sections">
          <button
            type="button"
            className={activeSection === "profile" ? "activeProfilSection" : ""}
            onClick={() => setActiveSection("profile")}
          >
            Profil
          </button>

          <button
            type="button"
            className={activeSection === "info" ? "activeProfilSection" : ""}
            onClick={() => setActiveSection("info")}
          >
            Info
          </button>
        </div>

        {appleError && <p className="error profilError">{appleError}</p>}

        {activeSection === "profile" ? (
        <div className="profileAccountList">
          {accountPlatforms.map((platform) => {
            const details = accountDetails[platform.id];
            const presentation = getAccountPresentation(platform);

            return (
            <article
              className={`profileAccountCard ${platform.isConnected ? "isConnected" : ""}`}
              key={platform.id}
            >
              <div className="profileAccountMain">
                <div className="profileLogoBox">
                  <img src={platform.logo} alt={platform.name} />
                </div>

                <div className="profileAccountText">
                  <h3>{platform.name}</h3>

                  {platform.isConnected && presentation.username && (
                    <strong className="profileUsername">{presentation.username}</strong>
                  )}

                  <p className={platform.isConnected ? "success" : "offlineText"}>
                    <span></span>
                    {platform.isConnected ? text.online : text.offline}
                  </p>

                  {platform.isConnected && !detailsLoading && details && !details.statsUnavailable && (
                    <div className="profileAccountStats">
                      <span><strong>{details.playlists}</strong> playlists</span>
                      <span><strong>{details.totalTracks}</strong> tracks</span>
                      {presentation.extraValue !== undefined && (
                        <span><strong>{Number(presentation.extraValue).toLocaleString()}</strong> {presentation.extraLabel}</span>
                      )}
                    </div>
                  )}

                  {platform.isConnected && detailsLoading && (
                    <span className="profileDetailsLoading">Loading account details...</span>
                  )}
                </div>
              </div>

              <div className="profileAccountActions">
                {platform.isConnected ? (
                  <>
                    <button className="secondaryBtn compactBtn" onClick={platform.switchAccount}>
                      {text.switchAccount}
                    </button>

                    <button className="dangerBtn compactBtn" onClick={platform.logout}>
                      {text.disconnect}
                    </button>
                  </>
                ) : (
                  <button className="compactBtn connectBtn" onClick={platform.login}>
                    {text.connect}
                  </button>
                )}
              </div>
            </article>
            );
          })}
        </div>
        ) : (
          <Info />
        )}
      </section>
    </main>
  );
}

export default Profil;
