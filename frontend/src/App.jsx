import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { themes } from "./themes";
import TopRightActionBtn from "./components/TopRightActionBtn";
import TopLeftBtn from "./components/TopLeftBtn";
import Parental from "./components/Parental";
import MusicParticles from "./components/Particles/MusicParticles";
import WhySoundSync from "./components/WhySoundSync";
import "./App.css";

const copy = {
  en: {
    subtitle: "Transfer playlists between your favorite platforms",
    chooseSource: "Choose a platform to start syncing your playlists",
    chooseDestination: "Choose where u want to move ur music",
    connected: "Connected",
    disconnect: "Disconnect",
    tracks: "tracks",
    videos: "videos",
    openSpotify: "Open on Spotify",
    openYoutube: "Open on YouTube",
    unknownArtist: "Unknown artist",
    unknownTitle: "Unknown title",
    showTracks: "Show tracks",
    hideTracks: "Hide tracks",
    loadingTracks: "Loading tracks...",
    loadingPlaylists: "Loading playlists",
    unavailable: "Unavailable",
    playlistError: "Error while loading playlists.",
    youtubePlaylistError: "Error while loading YouTube playlists.",
    trackError: "Unable to load tracks.",
  },
  fr: {
    subtitle: "Transfere tes playlists entre tes plateformes preferees",
    chooseSource: "Choisis une plateforme pour commencer a synchroniser tes playlists",
    chooseDestination: "Choisis ou tu veux deplacer ta musique",
    connected: "Connecte",
    disconnect: "Deconnecter",
    tracks: "morceaux",
    videos: "videos",
    openSpotify: "Ouvrir sur Spotify",
    openYoutube: "Ouvrir sur YouTube",
    unknownArtist: "Artiste inconnu",
    unknownTitle: "Titre inconnu",
    showTracks: "Afficher les musiques",
    hideTracks: "Ranger les musiques",
    loadingTracks: "Chargement des musiques...",
    loadingPlaylists: "Chargement des playlists",
    unavailable: "Indisponible",
    playlistError: "Erreur pendant la recuperation des playlists.",
    youtubePlaylistError: "Erreur pendant la recuperation des playlists YouTube.",
    trackError: "Impossible de recuperer les musiques.",
  },
};

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
  const [expandedPlaylists, setExpandedPlaylists] = useState({});
  const [playlistTracks, setPlaylistTracks] = useState({});
  const [trackLoading, setTrackLoading] = useState({});
  const [trackErrors, setTrackErrors] = useState({});

  const [currentTheme, setCurrentTheme] = useState("tomo");
  const [language, setLanguageState] = useState(
    () => localStorage.getItem("language") || "en"
  );
  const text = copy[language];
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
      logo: "/logo/mini/spotify-mini.png",
      logoClassName: "spotifyStepLogo",
    },
    youtube: youtubeAccessToken && {
      id: "youtube",
      name: "YouTube",
      logo: "/logo/mini/youtube-mini.png",
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
    ? text.chooseDestination
    : text.chooseSource;

  const setLanguage = (nextLanguage) => {
    localStorage.setItem("language", nextLanguage);
    setLanguageState(nextLanguage);
  };

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
        logoutLabel: `${text.disconnect} Spotify`,
        renderPlaylist: (playlist) => (
          <div
            className="playlistCard"
            key={playlist.id}
            style={{
              "--playlist-image": `url(${
                playlist.images?.[0]?.url ||
                "https://via.placeholder.com/100"
              })`,
            }}
          >
            <div className="playlistCardMain">
              <img
                src={
                  playlist.images?.[0]?.url ||
                  "https://via.placeholder.com/100"
                }
                alt={playlist.name}
              />

              <div className="playlistInfo">
                <h3>{playlist.name}</h3>

                <p>
                  {playlist.tracks.total} {text.tracks}
                </p>

                <a
                  href={playlist.external_urls.spotify}
                  target="_blank"
                  rel="noreferrer"
                >
                  {text.openSpotify}
                </a>
              </div>
            </div>

            {renderTrackPanel("spotify", playlist.id)}
          </div>
        ),
      };
    }

    return {
      error: youtubeError,
      loading: youtubeLoading,
        playlists: youtubePlaylists,
        logout: logoutYoutube,
        logoutLabel: `${text.disconnect} YouTube`,
        renderPlaylist: (playlist) => (
          <div
            className="playlistCard"
            key={playlist.id}
            style={{
              "--playlist-image": `url(${
                playlist.snippet.thumbnails?.medium?.url ||
                playlist.snippet.thumbnails?.default?.url ||
                "https://via.placeholder.com/100"
              })`,
            }}
          >
            <div className="playlistCardMain">
              <img
                src={
                  playlist.snippet.thumbnails?.medium?.url ||
                  playlist.snippet.thumbnails?.default?.url ||
                  "https://via.placeholder.com/100"
                }
                alt={playlist.snippet.title}
              />

              <div className="playlistInfo">
                <h3>{playlist.snippet.title}</h3>

                <p>
                  {playlist.contentDetails.itemCount} {text.videos}
                </p>

                <a
                  href={`https://www.youtube.com/playlist?list=${playlist.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {text.openYoutube}
                </a>
              </div>
            </div>

            {renderTrackPanel("youtube", playlist.id)}
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
          text.playlistError
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, text.playlistError]);

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
          text.youtubePlaylistError
      );
    } finally {
      setYoutubeLoading(false);
    }
  }, [youtubeAccessToken, text.youtubePlaylistError]);

  const getPlaylistTracks = useCallback(
    async (platformId, playlistId) => {
      const trackKey = `${platformId}:${playlistId}`;
      const token = platformId === "spotify" ? accessToken : youtubeAccessToken;

      setTrackErrors((currentErrors) => ({
        ...currentErrors,
        [trackKey]: "",
      }));
      setTrackLoading((currentLoading) => ({
        ...currentLoading,
        [trackKey]: true,
      }));

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/${platformId}/playlists/${playlistId}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPlaylistTracks((currentTracks) => ({
          ...currentTracks,
          [trackKey]: response.data.tracks,
        }));
      } catch (err) {
        setTrackErrors((currentErrors) => ({
          ...currentErrors,
          [trackKey]:
            err.response?.data?.message ||
            text.trackError,
        }));
      } finally {
        setTrackLoading((currentLoading) => ({
          ...currentLoading,
          [trackKey]: false,
        }));
      }
    },
    [accessToken, text.trackError, youtubeAccessToken]
  );

  const togglePlaylist = (platformId, playlistId) => {
    const trackKey = `${platformId}:${playlistId}`;

    setExpandedPlaylists((currentExpanded) => ({
      ...currentExpanded,
      [trackKey]: !currentExpanded[trackKey],
    }));

    if (!playlistTracks[trackKey] && !trackLoading[trackKey]) {
      getPlaylistTracks(platformId, playlistId);
    }
  };

  const getTrackLabel = (platformId, item) => {
    if (platformId === "spotify") {
      const track = item.track;
      const artistNames =
        track?.artists?.map((artist) => artist.name).join(", ") ||
        text.unknownArtist;

      return `${track?.name || text.unknownTitle} - ${artistNames}`;
    }

    return item.snippet?.title || text.unknownTitle;
  };

  const renderTrackPanel = (platformId, playlistId) => {
    const trackKey = `${platformId}:${playlistId}`;
    const isExpanded = expandedPlaylists[trackKey];

    return (
      <div className="playlistActions">
        <button
          className="expandBtn"
          onClick={() => togglePlaylist(platformId, playlistId)}
          type="button"
          aria-label={isExpanded ? text.hideTracks : text.showTracks}
        >
          {isExpanded ? "⌃" : "⌄"}
        </button>

        {isExpanded && (
          <div className="trackPanel">
            {trackLoading[trackKey] && (
              <p>{text.loadingTracks}</p>
            )}

            {trackErrors[trackKey] && (
              <p className="error">{trackErrors[trackKey]}</p>
            )}

            {playlistTracks[trackKey]?.length > 0 && (
              <ol className="trackList">
                {playlistTracks[trackKey].map((item, index) => (
                  <li key={item.track?.id || item.id || index}>
                    {getTrackLabel(platformId, item)}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    );
  };

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
      <MusicParticles />
      <TopLeftBtn />
      <TopRightActionBtn
        themes={themes}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        language={language}
        setLanguage={setLanguage}
      />
      <section className="card">
        <Parental />
        <div className="brand">
          <h1>SoundSync</h1>
        </div>

        <p className="subtitle">
          {text.subtitle}
        </p>

        <div className="transferProgress">
          <div className="transferSlot">
            {!sourcePlatform && (
              <span className="slotAlert">?</span>
            )}

            {sourcePlatform && (
              <>
                <span className="connectedBadge">{text.connected}</span>
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
                <span className="connectedBadge">{text.connected}</span>
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
                  src="/logo/Spotify-Black-Logo.png"
                  alt="Spotify"
                  className="spotifyBigLogo"
                />
              </button>
            )}

            {!youtubeAccessToken && (
              <button className="youtubeBtn" onClick={loginYoutube}>
                <img
                  src="/logo/YouTube-Logo.png"
                  alt="YouTube"
                  className="youtubeBigLogo"
                />
              </button>
            )}

            <button className="unavailablePlatformBtn" disabled>
              <img
                src="/logo/appleMusic.png"
                alt="Apple Music"
                className="appleMusicLogo"
              />
              <span>{text.unavailable}</span>
            </button>

            <button className="unavailablePlatformBtn" disabled>
              <img
                src="/logo/soundcloud-logo.png"
                alt="SoundCloud"
                className="soundCloudLogo"
              />
              <span>{text.unavailable}</span>
            </button>

            <button className="unavailablePlatformBtn" disabled>
              <img
                src="/logo/deezerLogo.png"
                alt="Deezer"
                className="deezerLogo"
              />
              <span>{text.unavailable}</span>
            </button>
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
                      aria-label={details.logoutLabel}
                      title={details.logoutLabel}
                    >
                      ⏻
                    </button>
                  </div>

                  {details.error && (
                    <p className="error">{details.error}</p>
                  )}

                  {details.loading && (
                    <p>{text.loadingPlaylists} {platform.name}...</p>
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

      <WhySoundSync />
    </main>
  );
}

export default App;
