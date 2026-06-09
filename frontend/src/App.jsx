import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { themes } from "./themes";
import ThemeSelector from "./components/ThemeSelector";
import Parental from "./components/Parental";
import "./App.css";

function App() {
  const [initialConnection] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const spotifyTokenFromUrl = params.get("spotify_access_token");
    const youtubeTokenFromUrl = params.get("youtube_access_token");
    const savedSpotifyToken = localStorage.getItem("spotify_access_token");
    const savedYoutubeToken = localStorage.getItem("youtube_access_token");

    return {
      spotifyToken: spotifyTokenFromUrl || savedSpotifyToken || "",
      youtubeToken: youtubeTokenFromUrl || savedYoutubeToken || "",
      spotifyTokenFromUrl,
      youtubeTokenFromUrl,
      savedSpotifyToken,
      savedYoutubeToken,
    };
  });
  const [accessToken, setAccessToken] = useState(initialConnection.spotifyToken);
  const [youtubeAccessToken, setYoutubeAccessToken] = useState(
    initialConnection.youtubeToken
  );
  const [playlists, setPlaylists] = useState([]);
  const [youtubePlaylists, setYoutubePlaylists] = useState([]);
  const [error, setError] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [youtubeLoading, setYoutubeLoading] = useState(false);

  const [currentTheme, setCurrentTheme] = useState("tomo");
  const [platformOrder, setPlatformOrder] = useState(() => {
    const savedOrder = localStorage.getItem("platform_order");

    try {
      return savedOrder ? JSON.parse(savedOrder) : [];
    } catch {
      return [];
    }
  });
  const platformData = {
    spotify: accessToken && {
      id: "spotify",
      name: "Spotify",
      logo: "/image/logo/Spotify-Black-Logo.png",
      logoClassName: "spotifyStepLogo",
    },
    youtube: youtubeAccessToken && {
      id: "youtube",
      name: "YouTube",
      logo: "/image/logo/YouTube-Logo.png",
      logoClassName: "youtubeStepLogo",
    },
  };
  const connectedPlatforms = [
    ...platformOrder
      .map((platformId) => platformData[platformId])
      .filter(Boolean),
    ...Object.values(platformData).filter(
      (platform) => platform && !platformOrder.includes(platform.id)
    ),
  ];
  const sourcePlatform = connectedPlatforms[0];
  const destinationPlatform = connectedPlatforms[1];
  const chooseText = sourcePlatform
    ? "Choose where u want to move ur music"
    : "Choose a platform to start syncing your playlists";

  const addPlatformToOrder = (platformId) => {
    setPlatformOrder((currentOrder) => {
      if (currentOrder.includes(platformId)) {
        return currentOrder;
      }

      const nextOrder = [...currentOrder, platformId];
      localStorage.setItem("platform_order", JSON.stringify(nextOrder));

      return nextOrder;
    });
  };

  const getPlatformDetails = (platformId) => {
    if (platformId === "spotify") {
      return {
        error,
        loading,
        playlists,
        logout: logoutSpotify,
        logoutLabel: "Déconnexion Spotify",
        renderPlaylist: (playlist) => (
          <div
            className="playlistCard"
            key={playlist.id}
          >
            <img
              src={
                playlist.images?.[0]?.url ||
                "https://via.placeholder.com/100"
              }
              alt={playlist.name}
            />

            <div>
              <h3>{playlist.name}</h3>

              <p>
                {playlist.tracks.total} morceaux
              </p>

              <a
                href={playlist.external_urls.spotify}
                target="_blank"
                rel="noreferrer"
              >
                Ouvrir sur Spotify
              </a>
            </div>
          </div>
        ),
      };
    }

    return {
      error: youtubeError,
      loading: youtubeLoading,
      playlists: youtubePlaylists,
      logout: logoutYoutube,
      logoutLabel: "Déconnexion YouTube",
      renderPlaylist: (playlist) => (
        <div
          className="playlistCard"
          key={playlist.id}
        >
          <img
            src={
              playlist.snippet.thumbnails?.medium?.url ||
              playlist.snippet.thumbnails?.default?.url ||
              "https://via.placeholder.com/100"
            }
            alt={playlist.snippet.title}
          />

          <div>
            <h3>{playlist.snippet.title}</h3>

            <p>
              {playlist.contentDetails.itemCount} videos
            </p>

            <a
              href={`https://www.youtube.com/playlist?list=${playlist.id}`}
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir sur YouTube
            </a>
          </div>
        </div>
      ),
    };
  };

  useEffect(() => {
    let shouldCleanUrl = false;

    if (initialConnection.spotifyTokenFromUrl) {
      localStorage.setItem(
        "spotify_access_token",
        initialConnection.spotifyTokenFromUrl
      );
      shouldCleanUrl = true;
    }

    if (initialConnection.youtubeTokenFromUrl) {
      localStorage.setItem(
        "youtube_access_token",
        initialConnection.youtubeTokenFromUrl
      );
      shouldCleanUrl = true;
    }

    [
      initialConnection.savedSpotifyToken &&
        !initialConnection.spotifyTokenFromUrl &&
        "spotify",
      initialConnection.savedYoutubeToken &&
        !initialConnection.youtubeTokenFromUrl &&
        "youtube",
      initialConnection.spotifyTokenFromUrl && "spotify",
      initialConnection.youtubeTokenFromUrl && "youtube",
    ]
      .filter(Boolean)
      .forEach(addPlatformToOrder);

    if (shouldCleanUrl) {
      window.history.replaceState({}, document.title, "/");
    }
  }, [initialConnection]);

  useEffect(() => {
    const theme = themes[currentTheme];

    document.documentElement.style.setProperty(
      "--bg-image",
      `url(${theme.background})`
    );

    document.documentElement.style.setProperty(
      "--card-bg",
      theme.cardBg
    );

    document.documentElement.style.setProperty(
      "--border-color",
      theme.border
    );

    document.documentElement.style.setProperty(
      "--accent",
      theme.accent
    );

    document.documentElement.style.setProperty(
      "--accent-soft",
      theme.accentSoft
    );

    document.documentElement.style.setProperty(
      "--text-color",
      theme.text
    );
  }, [currentTheme]);

  const loginSpotify = () => {
    window.location.href = "http://127.0.0.1:8000/auth/spotify";
  };

  const loginYoutube = () => {
    window.location.href = "http://127.0.0.1:8000/auth/google";
  };

  const logoutSpotify = () => {
    localStorage.removeItem("spotify_access_token");
    setAccessToken("");
    setPlaylists([]);
    setPlatformOrder((currentOrder) => {
      const nextOrder = currentOrder.filter((platformId) => platformId !== "spotify");
      localStorage.setItem("platform_order", JSON.stringify(nextOrder));

      return nextOrder;
    });
  };

  const logoutYoutube = () => {
    localStorage.removeItem("youtube_access_token");
    setYoutubeAccessToken("");
    setYoutubePlaylists([]);
    setPlatformOrder((currentOrder) => {
      const nextOrder = currentOrder.filter((platformId) => platformId !== "youtube");
      localStorage.setItem("platform_order", JSON.stringify(nextOrder));

      return nextOrder;
    });
  };

  const getPlaylists = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/spotify/playlists",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setPlaylists(response.data.playlists);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur pendant la récupération des playlists."
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const getYoutubePlaylists = useCallback(async () => {
    setYoutubeError("");
    setYoutubeLoading(true);

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/youtube/playlists",
        {
          headers: {
            Authorization: `Bearer ${youtubeAccessToken}`,
          },
        }
      );

      setYoutubePlaylists(response.data.playlists);
    } catch (err) {
      setYoutubeError(
        err.response?.data?.message ||
          "Erreur pendant la récupération des playlists YouTube."
      );
    } finally {
      setYoutubeLoading(false);
    }
  }, [youtubeAccessToken]);

  useEffect(() => {
    if (accessToken) {
      const timeout = window.setTimeout(getPlaylists, 0);

      return () => window.clearTimeout(timeout);
    }
  }, [accessToken, getPlaylists]);

  useEffect(() => {
    if (youtubeAccessToken) {
      const timeout = window.setTimeout(getYoutubePlaylists, 0);

      return () => window.clearTimeout(timeout);
    }
  }, [youtubeAccessToken, getYoutubePlaylists]);

  return (
    <main className="app">
      <ThemeSelector
        themes={themes}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
      />
      <section className="card">
        <Parental />
        <div className="brand">
          <h1>SoundSync</h1>
        </div>

        <p className="subtitle">
          Transfer playlists between your favorite platforms.
        </p>

        <div className="transferProgress">
          <div className="transferSlot">
            {!sourcePlatform && (
              <span className="slotAlert">?</span>
            )}

            {sourcePlatform && (
              <>
                <span className="connectedBadge">Connecter</span>
                <img
                  src={sourcePlatform.logo}
                  alt={sourcePlatform.name}
                  className={sourcePlatform.logoClassName}
                />
              </>
            )}
          </div>

          <div className="transferArrow">→</div>

          <div className="transferSlot">
            {sourcePlatform && !destinationPlatform && (
              <span className="slotAlert">?</span>
            )}

            {destinationPlatform && (
              <>
                <span className="connectedBadge">Connecter</span>
                <img
                  src={destinationPlatform.logo}
                  alt={destinationPlatform.name}
                  className={destinationPlatform.logoClassName}
                />
              </>
            )}
          </div>
        </div>

        {(!sourcePlatform || !destinationPlatform) && (
          <p className="chooseText">{chooseText}</p>
        )}

        {(!accessToken || !youtubeAccessToken) && (
          <div className="platformLoginRow">
            {!accessToken && (
              <button className="spotifyBtn" onClick={loginSpotify}>
                <img
                  src="/image/logo/Spotify-Black-Logo.png"
                  alt="Spotify"
                  className="spotifyBigLogo"
                />
              </button>
            )}

            {!youtubeAccessToken && (
              <button className="youtubeBtn" onClick={loginYoutube}>
                <img
                  src="/image/logo/YouTube-Logo.png"
                  alt="YouTube"
                  className="youtubeBigLogo"
                />
              </button>
            )}
          </div>
        )}

        {connectedPlatforms.length > 0 && (
          <div className="playlistColumns">
            {connectedPlatforms.map((platform) => {
              const details = getPlatformDetails(platform.id);

              return (
                <section className="playlistColumn" key={platform.id}>
                  <div className="playlistColumnHeader">
                    <h2>{platform.name}</h2>

                    <button
                      className="dangerBtn"
                      onClick={details.logout}
                    >
                      {details.logoutLabel}
                    </button>
                  </div>

                  {details.error && (
                    <p className="error">{details.error}</p>
                  )}

                  {details.loading && (
                    <p>Chargement des playlists {platform.name}...</p>
                  )}

                  <div className="playlistList">
                    {details.playlists.map(details.renderPlaylist)}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
