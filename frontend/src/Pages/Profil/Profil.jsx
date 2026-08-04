import axios from "axios";
import { useEffect, useState } from "react";
import { themes } from "../../themes";
import MusicParticles from "../../components/TOUTLESPAGES/Particles/MusicParticles";
import Navbar from "../../components/TOUTLESPAGES/Navbar/Navbar";
import changeProfilIcon from "../../../ASSETS/IMAGE/logo/icon/changeProfil.png";
import evilLaughSound from "../../../ASSETS/SOUND/sfx/evilLaugh.mp3";
import "./Profil.css";

function Profil() {
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

    document.documentElement.style.setProperty("--bg-image", theme.background ? `url(${theme.background})` : theme.backgroundColor || "none");
    document.documentElement.style.setProperty("--bg-color", theme.background ? theme.backgroundColor || "#0d0d0d" : "#000000");
    document.documentElement.style.setProperty("--bg-size", theme.background ? "cover" : "170% 170%");
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

  const playEvilLaugh = () => {
    const audio = new Audio(evilLaughSound);
    audio.play().catch(() => {});
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
      logo: "/IMAGE/logo/mini/spotify-mini.png",
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
      logo: "/IMAGE/logo/mini/Youtube-mini.svg",
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
      logo: "/IMAGE/logo/mini/Apple-Music-mini.png",
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
      {particlesEnabled && <MusicParticles />}

      <Navbar
        themes={themes}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        onOpenTransfer={() => {
          window.location.href = "/";
        }}
        onOpenInfo={() => {
          window.location.href = "/info";
        }}
        transferLabel="Home"
        activePage="profile"
        showTransferButton={true}
        showInfoButton={true}
        showProfileButton={true}
        showThemeButton={true}
      />

      <section className="profilPanel">
        <div className="profilHeader">
          <div>
            <h1>{text.profileTitle}</h1>
            <span>{text.profileSubtitle}</span>
          </div>

          <div className="profilContactCard">
            <p>im allways open 2 make new friends, if u want 2 talk or collaborate, contact @yanis26x on all socials.</p>
            <a
              className="profilePlayMeBtn profileContactBtn"
              href="https://www.instagram.com/yanis26x"
              target="_blank"
              rel="noreferrer"
            >
              Contact me
            </a>
          </div>
        </div>

        {appleError && <p className="error profilError">{appleError}</p>}

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

                  {platform.isConnected && (
                    <strong className="profileUsername">{presentation.username || "acc info"}</strong>
                  )}

                  <p className={platform.isConnected ? "success" : "offlineText"}>
                    <span></span>
                    {platform.isConnected ? text.online : text.offline}
                  </p>

                  {platform.isConnected && (
                    <div className="profileAccountStats">
                      {detailsLoading ? (
                        <span className="profileStatsPlaceholder">Loading account details...</span>
                      ) : details && !details.statsUnavailable ? (
                        <>
                          <span><strong>{details.playlists}</strong> playlists</span>
                          <span><strong>{details.totalTracks}</strong> tracks</span>
                        </>
                      ) : (
                        <span className="profileStatsPlaceholder">acc info</span>
                      )}

                      {!detailsLoading && details && !details.statsUnavailable && presentation.extraValue !== undefined && (
                        <span><strong>{Number(presentation.extraValue).toLocaleString()}</strong> {presentation.extraLabel}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="profileAccountActions">
                {platform.isConnected ? (
                  <>
                    <button
                      className="secondaryBtn compactBtn switchIconBtn"
                      onClick={platform.switchAccount}
                      aria-label={text.switchAccount}
                      title={text.switchAccount}
                    >
                      <img src={changeProfilIcon} alt="" aria-hidden="true" />
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

        <button className="profilePlayMeBtn" type="button" onClick={playEvilLaugh}>
          FFXV Button style
        </button>
      </section>
    </main>
  );
}

export default Profil;
