import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { themes } from "./themes";
import TopRightActionBtn from "./components/TopRight/TopRightActionBtn";
import TopLeftBtn from "./components/TopLeft/TopLeftBtn";
import MusicParticles from "./components/Particles/MusicParticles";
import Footer from "./components/Footer/Footer";
import "./App.css";


const copy = {
  en: {
    subtitle: "Transfer playlists between your favorite platforms.",
    chooseSource: "Select a platform source 𖤐 ",
    chooseDestination: "Select Destination 𖤐",
    connected: "Connected",
    disconnect: "Disconnect",
    tracks: "tracks",
    videos: "videos",
    openSpotify: "Open on Spotify",
    openYoutube: "Open on YouTube",
    openApple: "Open in Apple Music",
    unknownArtist: "Unknown artist",
    unknownTitle: "Unknown title",
    showTracks: "Show tracks",
    hideTracks: "Hide tracks",
    loadingTracks: "Loading tracks...",
    loadingPlaylists: "Loading playlists",
    unavailable: "Unavailable",
    playlistError: "Error while loading playlists.",
    youtubePlaylistError: "Error while loading YouTube playlists.",
    applePlaylistError: "Error while loading Apple Music playlists.",
    appleLoginError: "Unable to connect to Apple Music.",
    trackError: "Unable to load tracks.",
    profile: "Profile",
    home: "Home",
    profileTitle: "Profile",
    online: "Connected",
    offline: "Offline",
    connect: "Connect",
    switchAccount: "Switch account",
    removeChoice: "Remove platform choice",
    changePlatform: "Return",
    disconnectHint: "2 disconnect an account, go to Profile.",
    logged: "Logged",
    pickPlaylist: "Select a playlist to sync",
    transferToNew: "Transfer into a new playlist",
    transferToExisting: "Add to an existing playlist",
    playlistName: "Playlist name",
    destinationPlaylist: "Destination playlist",
    startTransfer: "Start transfer",
    transferLoading: "Transfer in progress...",
    transferDone: "Transfer done",
    addedTracks: "tracks added",
    failedTracks: "tracks not found or failed",
    alreadyTracks: "tracks already in playlist",
    unsupportedTransfer: "Transfer is available for Spotify and YouTube for now.",
    transferLimit: "Current limit: 25 tracks per transfer.",
    homeBannerTitle: "Run Me Yo Blood",
    homeBannerText: "it keep my eyes low, I'm looking chinky -- Do—dope sick, I'm having withdrawals, I feel uneasy -- Skittles got me feeling tranquil, they're so relieving",
  },
  fr: {
    subtitle: "Transfere tes playlists entre tes plateformes preferees",
    chooseSource: "Choisis une plateforme 𖤐",
    chooseDestination: "Ou veux tu transferer tes playlistes 𖤐",
    connected: "Connecte",
    disconnect: "Deconnecter",
    tracks: "morceaux",
    videos: "videos",
    openSpotify: "Ouvrir sur Spotify",
    openYoutube: "Ouvrir sur YouTube",
    openApple: "Ouvrir dans Apple Music",
    unknownArtist: "Artiste inconnu",
    unknownTitle: "Titre inconnu",
    showTracks: "Afficher les musiques",
    hideTracks: "Ranger les musiques",
    loadingTracks: "Chargement des musiques...",
    loadingPlaylists: "Chargement des playlists",
    unavailable: "Indisponible",
    playlistError: "Erreur pendant la recuperation des playlists.",
    youtubePlaylistError: "Erreur pendant la recuperation des playlists YouTube.",
    applePlaylistError: "Erreur pendant la recuperation des playlists Apple Music.",
    appleLoginError: "Impossible de se connecter a Apple Music.",
    trackError: "Impossible de recuperer les musiques.",
    profile: "Profil",
    home: "Accueil",
    profileTitle: "Profil",
    online: "Connecte",
    offline: "Offline",
    connect: "Se connecter",
    switchAccount: "Changer de compte",
    removeChoice: "Retirer le choix de plateforme",
    changePlatform: "Retour",
    disconnectHint: "Pour se deconnecter d'un compte, allez dans Profil.",
    logged: "Logged",
    pickPlaylist: "Choisissez une liste de lecture à synchroniser",
    transferToNew: "Transferer dans une nouvelle playlist",
    transferToExisting: "Ajouter a une playlist existante",
    playlistName: "Nom de la playlist",
    destinationPlaylist: "Playlist destination",
    startTransfer: "Demarrer le transfert",
    transferLoading: "Transfert en cours...",
    transferDone: "Transfert termine",
    addedTracks: "musiques ajoutees",
    failedTracks: "musiques introuvables ou en erreur",
    alreadyTracks: "musiques deja presentes",
    unsupportedTransfer: "Le transfert est dispo pour Spotify et YouTube pour le moment.",
    transferLimit: "Limite actuelle : 25 musiques par transfert.",
    homeBannerTitle: "Run Me Yo Blood",
    homeBannerText: "it keep my eyes low, I'm looking chinky -- Do—dope sick, I'm having withdrawals, I feel uneasy -- Skittles got me feeling tranquil, they're so relieving",
  },
};

function App() {
  const [initialConnection] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const spotifyTokenFromUrl = params.get("spotify_access_token");
    const spotifyRefreshTokenFromUrl = params.get("spotify_refresh_token");
    const youtubeTokenFromUrl = params.get("youtube_access_token");
    const youtubeRefreshTokenFromUrl = params.get("youtube_refresh_token");
    const savedSpotifyToken = localStorage.getItem("spotify_access_token");
    const savedYoutubeToken = localStorage.getItem("youtube_access_token");
    const savedAppleMusicUserToken = localStorage.getItem("apple_music_user_token");

    return {
      spotifyToken: spotifyTokenFromUrl || savedSpotifyToken || "",
      youtubeToken: youtubeTokenFromUrl || savedYoutubeToken || "",
      appleMusicUserToken: savedAppleMusicUserToken || "",
      spotifyTokenFromUrl,
      spotifyRefreshTokenFromUrl,
      youtubeTokenFromUrl,
      youtubeRefreshTokenFromUrl,
      savedSpotifyToken,
      savedYoutubeToken,
      savedAppleMusicUserToken,
    };
  });
  const [accessToken, setAccessToken] = useState(initialConnection.spotifyToken);
  const [youtubeAccessToken, setYoutubeAccessToken] = useState(
    initialConnection.youtubeToken
  );
  const [appleMusicUserToken, setAppleMusicUserToken] = useState(
    initialConnection.appleMusicUserToken
  );
  const [playlists, setPlaylists] = useState([]);
  const [youtubePlaylists, setYoutubePlaylists] = useState([]);
  const [applePlaylists, setApplePlaylists] = useState([]);
  const [error, setError] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const [appleError, setAppleError] = useState("");
  const [loading, setLoading] = useState(false);
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [expandedPlaylists, setExpandedPlaylists] = useState({});
  const [playlistTracks, setPlaylistTracks] = useState({});
  const [trackLoading, setTrackLoading] = useState({});
  const [trackErrors, setTrackErrors] = useState({});
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedSourcePlaylistId, setSelectedSourcePlaylistId] = useState("");
  const [destinationMode, setDestinationMode] = useState("new");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [destinationPlaylistId, setDestinationPlaylistId] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferResult, setTransferResult] = useState(null);
  const [transferError, setTransferError] = useState("");
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
    },
    youtube: youtubeAccessToken && {
      id: "youtube",
      name: "YouTube",
      logo: "/logo/YouTube-Logo.png",
    },
    apple: appleMusicUserToken && {
      id: "apple",
      name: "Apple Music",
      logo: "/logo/appleMusic.png",
    },
  };
  const selectedPlatforms = platformOrder
    .map((platformId) => platformData[platformId])
    .filter(Boolean);
  const sourcePlatform = selectedPlatforms[0];
  const destinationPlatform = selectedPlatforms[1];
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

  const goBackPlatformChoice = () => {
    setPlatformOrder((currentOrder) => {
      const nextOrder = currentOrder.slice(0, -1);
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

    if (platformId === "youtube") {
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
    }

    return {
      error: appleError,
      loading: appleLoading,
      playlists: applePlaylists,
      logout: logoutAppleMusic,
      logoutLabel: `${text.disconnect} Apple Music`,
      renderPlaylist: (playlist) => {
        const artworkUrl = getAppleArtworkUrl(playlist.attributes?.artwork);
        const appleTrackCount =
          playlist.attributes?.trackCount ??
          playlist.relationships?.tracks?.data?.length ??
          0;

        return (
          <div
            className="playlistCard"
            key={playlist.id}
            style={{
              "--playlist-image": `url(${artworkUrl})`,
            }}
          >
            <div className="playlistCardMain">
              <img
                src={artworkUrl}
                alt={playlist.attributes?.name || "Apple Music playlist"}
              />

              <div className="playlistInfo">
                <h3>{playlist.attributes?.name || text.unknownTitle}</h3>

                <p>
                  {appleTrackCount} {text.tracks}
                </p>

                {playlist.attributes?.playParams?.catalogId && (
                  <a
                    href={`https://music.apple.com/playlist/${playlist.attributes.playParams.catalogId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {text.openApple}
                  </a>
                )}
              </div>
            </div>

            {renderTrackPanel("apple", playlist.id)}
          </div>
        );
      },
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

    if (initialConnection.spotifyRefreshTokenFromUrl) {
      localStorage.setItem(
        "spotify_refresh_token",
        initialConnection.spotifyRefreshTokenFromUrl
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

    if (initialConnection.youtubeRefreshTokenFromUrl) {
      localStorage.setItem(
        "youtube_refresh_token",
        initialConnection.youtubeRefreshTokenFromUrl
      );
      shouldCleanUrl = true;
    }

    [
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
      addPlatformToOrder("apple");
    } catch (err) {
      setAppleError(err.response?.data?.message || text.appleLoginError);
    }
  };

  const logoutSpotify = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
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
    localStorage.removeItem("youtube_refresh_token");
    setYoutubeAccessToken("");
    setYoutubePlaylists([]);
    setPlatformOrder((currentOrder) => {
      const nextOrder = currentOrder.filter((platformId) => platformId !== "youtube");
      localStorage.setItem("platform_order", JSON.stringify(nextOrder));

      return nextOrder;
    });
  };

  const logoutAppleMusic = async () => {
    localStorage.removeItem("apple_music_user_token");
    setAppleMusicUserToken("");
    setApplePlaylists([]);
    setPlaylistTracks((currentTracks) =>
      Object.fromEntries(
        Object.entries(currentTracks).filter(([trackKey]) => !trackKey.startsWith("apple:"))
      )
    );
    setExpandedPlaylists((currentExpanded) =>
      Object.fromEntries(
        Object.entries(currentExpanded).filter(([trackKey]) => !trackKey.startsWith("apple:"))
      )
    );
    setPlatformOrder((currentOrder) => {
      const nextOrder = currentOrder.filter((platformId) => platformId !== "apple");
      localStorage.setItem("platform_order", JSON.stringify(nextOrder));

      return nextOrder;
    });

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
      logo: "/logo/YouTube-Logo.png",
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

  const getPlaylists = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const response = await authorizedRequest("spotify", {
        method: "get",
        url: "http://127.0.0.1:8000/api/spotify/playlists",
      });

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
      const response = await authorizedRequest("youtube", {
        method: "get",
        url: "http://127.0.0.1:8000/api/youtube/playlists",
      });

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

  const getApplePlaylists = useCallback(async () => {
    setAppleError("");
    setAppleLoading(true);

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/apple/playlists",
        {
          headers: {
            Authorization: `Bearer ${appleMusicUserToken}`,
          },
        }
      );

      setApplePlaylists(response.data.playlists);
    } catch (err) {
      setAppleError(
        err.response?.data?.message ||
          text.applePlaylistError
      );
    } finally {
      setAppleLoading(false);
    }
  }, [appleMusicUserToken, text.applePlaylistError]);

  const getPlaylistTracks = useCallback(
    async (platformId, playlistId) => {
      const trackKey = `${platformId}:${playlistId}`;
      setTrackErrors((currentErrors) => ({
        ...currentErrors,
        [trackKey]: "",
      }));
      setTrackLoading((currentLoading) => ({
        ...currentLoading,
        [trackKey]: true,
      }));

      try {
        const response = await authorizedRequest(platformId, {
          method: "get",
          url: `http://127.0.0.1:8000/api/${platformId}/playlists/${playlistId}/tracks`,
        });

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
    [accessToken, appleMusicUserToken, text.trackError, youtubeAccessToken]
  );

  const getAppleArtworkUrl = (artwork) => {
    if (!artwork?.url) {
      return "https://via.placeholder.com/100";
    }

    return artwork.url.replace("{w}", "300").replace("{h}", "300");
  };

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

    if (platformId === "apple") {
      const artistName = item.attributes?.artistName;
      const trackName = item.attributes?.name || text.unknownTitle;

      return artistName ? `${trackName} - ${artistName}` : trackName;
    }

    return item.snippet?.title || text.unknownTitle;
  };

  const normalizeTrackText = (value) =>
    (value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\([^)]*(official|video|audio|lyrics?|visualizer|clip)[^)]*\)/gi, " ")
      .replace(/\[[^\]]*(official|video|audio|lyrics?|visualizer|clip)[^\]]*\]/gi, " ")
      .replace(/\b(official|music|video|audio|lyrics?|visualizer|clip|hd|hq|4k)\b/gi, " ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const parseTrackLabel = (label) => {
    const cleanedLabel = label
      .replace(/\([^)]*(official|video|audio|lyrics?|visualizer|clip)[^)]*\)/gi, " ")
      .replace(/\[[^\]]*(official|video|audio|lyrics?|visualizer|clip)[^\]]*\]/gi, " ")
      .trim();
    const parts = cleanedLabel.split(/\s+-\s+|\s+–\s+|\s+—\s+/);

    if (parts.length >= 2) {
      return {
        artist: parts[0].trim(),
        title: parts.slice(1).join(" ").trim(),
      };
    }

    return {
      artist: "",
      title: cleanedLabel,
    };
  };

  const getAppleSongMatch = (label, songs) => {
    const parsed = parseTrackLabel(label);
    const wantedTitle = normalizeTrackText(parsed.title);
    const wantedArtist = normalizeTrackText(parsed.artist);

    if (!wantedTitle) return null;

    const scoredSongs = songs.map((song) => {
      const songTitle = normalizeTrackText(song.attributes?.name);
      const songArtist = normalizeTrackText(song.attributes?.artistName);
      let score = 0;

      if (songTitle === wantedTitle) score += 6;
      if (songTitle.includes(wantedTitle) || wantedTitle.includes(songTitle)) score += 3;
      if (wantedArtist && songArtist.includes(wantedArtist)) score += 4;

      return { song, score };
    });

    const bestMatch = scoredSongs.sort((a, b) => b.score - a.score)[0];

    return bestMatch?.score >= (wantedArtist ? 7 : 6) ? bestMatch.song : null;
  };

  const getPlatformToken = (platformId) => {
    if (platformId === "spotify") return accessToken;
    if (platformId === "youtube") return youtubeAccessToken;
    return appleMusicUserToken;
  };

  const setPlatformToken = useCallback((platformId, nextToken) => {
    if (platformId === "spotify") {
      localStorage.setItem("spotify_access_token", nextToken);
      setAccessToken(nextToken);
      return;
    }

    if (platformId === "youtube") {
      localStorage.setItem("youtube_access_token", nextToken);
      setYoutubeAccessToken(nextToken);
    }
  }, []);

  const refreshPlatformToken = useCallback(async (platformId) => {
    if (!["spotify", "youtube"].includes(platformId)) {
      throw new Error("Refresh non disponible pour cette plateforme.");
    }

    const refreshTokenKey =
      platformId === "spotify" ? "spotify_refresh_token" : "youtube_refresh_token";
    const refreshToken = localStorage.getItem(refreshTokenKey);

    if (!refreshToken) {
      throw new Error("Refresh token manquant. Reconnecte le compte.");
    }

    const refreshUrl =
      platformId === "spotify"
        ? "http://127.0.0.1:8000/auth/spotify/refresh"
        : "http://127.0.0.1:8000/auth/google/refresh";

    const response = await axios.post(refreshUrl, { refreshToken });
    const nextToken = response.data.access_token;

    if (!nextToken) {
      throw new Error("Nouveau token manquant.");
    }

    setPlatformToken(platformId, nextToken);

    if (response.data.refresh_token) {
      localStorage.setItem(refreshTokenKey, response.data.refresh_token);
    }

    return nextToken;
  }, [setPlatformToken]);

  const authorizedRequest = useCallback(
    async (platformId, config) => {
      const runRequest = (token) =>
        axios({
          ...config,
          headers: {
            ...(config.headers || {}),
            Authorization: `Bearer ${token}`,
          },
        });

      try {
        return await runRequest(getPlatformToken(platformId));
      } catch (err) {
        if (err.response?.status !== 401 || !["spotify", "youtube"].includes(platformId)) {
          throw err;
        }

        const nextToken = await refreshPlatformToken(platformId);
        return runRequest(nextToken);
      }
    },
    [accessToken, appleMusicUserToken, refreshPlatformToken, youtubeAccessToken]
  );

  const getPlatformPlaylists = (platformId) => {
    if (platformId === "spotify") return playlists;
    if (platformId === "youtube") return youtubePlaylists;
    if (platformId === "apple") return applePlaylists;
    return [];
  };

  const getPlaylistName = (platformId, playlist) => {
    if (platformId === "spotify") return playlist.name;
    if (platformId === "youtube") return playlist.snippet?.title || text.unknownTitle;
    return playlist.attributes?.name || text.unknownTitle;
  };

  const getPlaylistImage = (platformId, playlist) => {
    if (platformId === "spotify") {
      return playlist.images?.[0]?.url || "https://via.placeholder.com/100";
    }

    if (platformId === "youtube") {
      return (
        playlist.snippet?.thumbnails?.medium?.url ||
        playlist.snippet?.thumbnails?.default?.url ||
        "https://via.placeholder.com/100"
      );
    }

    return getAppleArtworkUrl(playlist.attributes?.artwork);
  };

  const getPlaylistCount = (platformId, playlist) => {
    if (platformId === "spotify") return playlist.tracks?.total || 0;
    if (platformId === "youtube") return playlist.contentDetails?.itemCount || 0;

    return (
      playlist.attributes?.trackCount ??
      playlist.relationships?.tracks?.data?.length ??
      0
    );
  };

  const selectedSourcePlaylist = sourcePlatform
    ? getPlatformPlaylists(sourcePlatform.id).find(
      (playlist) => playlist.id === selectedSourcePlaylistId
    )
    : null;
  const destinationPlaylists = destinationPlatform
    ? getPlatformPlaylists(destinationPlatform.id)
    : [];

  const startPlaylistTransfer = async () => {
    if (!sourcePlatform || !destinationPlatform || !selectedSourcePlaylist) return;

if (
  !["spotify", "youtube", "apple"].includes(destinationPlatform.id)
) {
  setTransferError(text.unsupportedTransfer);
  return;
}

    setTransferLoading(true);
    setTransferError("");
    setTransferResult(null);

    const sourceTrackKey = `${sourcePlatform.id}:${selectedSourcePlaylist.id}`;

    try {
      let tracks = playlistTracks[sourceTrackKey];

      if (!tracks) {
        const tracksResponse = await authorizedRequest(sourcePlatform.id, {
          method: "get",
          url: `http://127.0.0.1:8000/api/${sourcePlatform.id}/playlists/${selectedSourcePlaylist.id}/tracks`,
        });

        tracks = tracksResponse.data.tracks;
        setPlaylistTracks((currentTracks) => ({
          ...currentTracks,
          [sourceTrackKey]: tracks,
        }));
      }

      const trackLabels = tracks
        .slice(0, 25)
        .map((track) => getTrackLabel(sourcePlatform.id, track))
        .filter(Boolean);

      let targetPlaylistId = destinationPlaylistId;

      if (destinationMode === "new") {
        const createUrl = `http://127.0.0.1:8000/api/${destinationPlatform.id}/playlists`;
        const playlistTitle =
          newPlaylistName.trim() ||
          getPlaylistName(sourcePlatform.id, selectedSourcePlaylist);
        const createResponse = await authorizedRequest(destinationPlatform.id, {
          method: "post",
          url: createUrl,
          data:
            destinationPlatform.id === "youtube"
              ? {
                title: playlistTitle,
              }
              : {
                name: playlistTitle,
              },
        });

        targetPlaylistId = createResponse.data.playlist.id;
      }

      if (!targetPlaylistId) {
        throw new Error(text.destinationPlaylist);
      }

      let existingDestinationTrackIds = new Set();

      if (destinationMode === "existing") {
        const destinationTrackResponse = await authorizedRequest(destinationPlatform.id, {
          method: "get",
          url: `http://127.0.0.1:8000/api/${destinationPlatform.id}/playlists/${targetPlaylistId}/tracks`,
        });

        existingDestinationTrackIds = new Set(
          destinationTrackResponse.data.tracks
            .map((item) => {
              if (destinationPlatform.id === "spotify") {
                return item.track?.uri || item.track?.id;
              }

              if (destinationPlatform.id === "youtube") {
                return item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
              }

              return item.id;
            })
            .filter(Boolean)
        );
      }

      const added = [];
      const failed = [];
      const already = [];
      const pushTransferResult = (label, status) => {
        if (status === "added") {
          added.push(label);
        } else if (status === "already") {
          already.push(label);
        } else {
          failed.push(label);
        }
      };

      if (destinationPlatform.id === "spotify") {
        const uris = [];

        for (const label of trackLabels) {
          try {
            const searchResponse = await authorizedRequest("spotify", {
              method: "get",
              url: "http://127.0.0.1:8000/api/spotify/search",
              params: {
                q: label,
              },
            });

            if (searchResponse.data.track?.uri) {
              if (existingDestinationTrackIds.has(searchResponse.data.track.uri)) {
                pushTransferResult(label, "already");
              } else {
                uris.push(searchResponse.data.track.uri);
                existingDestinationTrackIds.add(searchResponse.data.track.uri);
                pushTransferResult(label, "added");
              }
            } else {
              pushTransferResult(label, "failed");
            }
          } catch {
            pushTransferResult(label, "failed");
          }
        }

        if (uris.length > 0) {
          await authorizedRequest("spotify", {
            method: "post",
            url: `http://127.0.0.1:8000/api/spotify/playlists/${targetPlaylistId}/tracks`,
            data: {
              uris,
            },
          });
        }
      }

      if (destinationPlatform.id === "youtube") {
        for (const label of trackLabels) {
          try {
            const searchResponse = await authorizedRequest("youtube", {
              method: "get",
              url: "http://127.0.0.1:8000/api/youtube/search",
              params: {
                q: label,
              },
            });
            const videoId = searchResponse.data.item?.id?.videoId;

            if (!videoId) {
              pushTransferResult(label, "failed");
              continue;
            }

            if (existingDestinationTrackIds.has(videoId)) {
              pushTransferResult(label, "already");
              continue;
            }

            await authorizedRequest("youtube", {
              method: "post",
              url: `http://127.0.0.1:8000/api/youtube/playlists/${targetPlaylistId}/tracks`,
              data: {
                videoId,
              },
            });
            existingDestinationTrackIds.add(videoId);
            pushTransferResult(label, "added");
          } catch {
            pushTransferResult(label, "failed");
          }
        }
      }

      if (destinationPlatform.id === "apple") {
        const songs = [];

        for (const label of trackLabels) {
          try {
            const searchResponse = await authorizedRequest("apple", {
              method: "get",
              url: "http://127.0.0.1:8000/api/apple/search",
              params: {
                q: label,
              },
            });
            const appleSong = getAppleSongMatch(label, searchResponse.data.songs || []);
            const songId = appleSong?.id;

            if (!songId) {
              pushTransferResult(label, "failed");
              continue;
            }

            if (existingDestinationTrackIds.has(songId)) {
              pushTransferResult(label, "already");
              continue;
            }

            songs.push(songId);
            existingDestinationTrackIds.add(songId);
            pushTransferResult(label, "added");
          } catch {
            pushTransferResult(label, "failed");
          }
        }

        if (songs.length > 0) {
          await authorizedRequest("apple", {
            method: "post",
            url: `http://127.0.0.1:8000/api/apple/playlists/${targetPlaylistId}/tracks`,
            data: {
              songs,
            },
          });
        }
      }

      setTransferResult({
        added,
        failed,
        already,
      });
    } catch (err) {
      setTransferError(err.response?.data?.message || err.message || text.trackError);
    } finally {
      setTransferLoading(false);
    }
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

  useEffect(() => {
    if (appleMusicUserToken) {
      const timeout = window.setTimeout(getApplePlaylists, 0);

      return () => window.clearTimeout(timeout);
    }
  }, [appleMusicUserToken, getApplePlaylists]);

  useEffect(() => {
    setSelectedSourcePlaylistId("");
    setDestinationMode("new");
    setNewPlaylistName("");
    setDestinationPlaylistId("");
    setTransferResult(null);
    setTransferError("");
  }, [sourcePlatform?.id, destinationPlatform?.id]);

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
        onOpenProfile={() => {
          window.location.href = "/Profil";
        }}
        profileLabel={text.profile}
        onOpenInfo={() => {
          window.location.href = "/info";
        }}
        onReturn={goBackPlatformChoice}
        returnLabel={text.changePlatform}
        showReturn={selectedPlatforms.length > 0}
      />
      <section className="card">
        {/* <Parental /> */}
        <section className="mainHero">
          <img
            src="/SoundSync/SoundSyncLogoNoBG.png"
            alt="SoundSync"
            className="mainHeroLogo"
          />

          <div className="mainHeroText">
            <h1>SoundSync</h1>
            <p>{text.subtitle}</p>
          </div>
        </section>

        {currentPage === "profile" && (
          <div className="profilePage">
            <h2>{text.profileTitle}</h2>

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
          </div>
        )}

        {currentPage === "home" && (
          <>
            {selectedPlatforms.length < 2 && (
              <div className="homeSetupGrid">
                <section className="choosePanel">
                  <p className="chooseText">{chooseText}</p>

                  <div className="platformLoginRow">
                    <button
                      className={`spotifyBtn platformChoiceBtn${platformOrder.includes("spotify") ? " selectedPlatformBtn" : ""}`}
                      onClick={accessToken ? () => addPlatformToOrder("spotify") : loginSpotify}
                      disabled={platformOrder.includes("spotify")}
                    >
                      {accessToken && <span className="loggedBadge">{text.logged}</span>}
                      <img
                        src="/logo/Spotify-Black-Logo.png"
                        alt="Spotify"
                        className="spotifyBigLogo"
                      />
                    </button>

                    <button
                      className={`youtubeBtn platformChoiceBtn${platformOrder.includes("youtube") ? " selectedPlatformBtn" : ""}`}
                      onClick={youtubeAccessToken ? () => addPlatformToOrder("youtube") : loginYoutube}
                      disabled={platformOrder.includes("youtube")}
                    >
                      {youtubeAccessToken && <span className="loggedBadge">{text.logged}</span>}
                      <img
                        src="/logo/YouTube-Logo.png"
                        alt="YouTube"
                        className="youtubeBigLogo"
                      />
                    </button>

                    <button
                      className={`appleBtn platformChoiceBtn${platformOrder.includes("apple") ? " selectedPlatformBtn" : ""}`}
                      onClick={appleMusicUserToken ? () => addPlatformToOrder("apple") : loginAppleMusic}
                      disabled={platformOrder.includes("apple")}
                    >
                      {appleMusicUserToken && <span className="loggedBadge">{text.logged}</span>}
                      <img
                        src="/logo/appleMusic.png"
                        alt="Apple Music"
                        className="appleMusicLogo"
                      />
                    </button>
                  </div>
                </section>

                <section className="emptyPanel" aria-hidden="true"></section>
              </div>
            )}

            {selectedPlatforms.length === 2 && sourcePlatform && destinationPlatform && (
              <div className="transferWorkspace">
                <section className="emptyPanel" aria-hidden="true"></section>

                <section className="playlistPickPanel">
                  <h2>{text.pickPlaylist}</h2>

                  {getPlatformDetails(sourcePlatform.id).error && (
                    <p className="error">{getPlatformDetails(sourcePlatform.id).error}</p>
                  )}

                  {getPlatformDetails(sourcePlatform.id).loading && (
                    <p>{text.loadingPlaylists} {sourcePlatform.name}...</p>
                  )}

                  <div className="sourcePlaylistGrid">
                    {getPlatformPlaylists(sourcePlatform.id).map((playlist) => {
                      const isSelected = selectedSourcePlaylistId === playlist.id;

                      return (
                        <button
                          className={`sourcePlaylistChoice${isSelected ? " selected" : ""}`}
                          key={playlist.id}
                          onClick={() => {
                            setSelectedSourcePlaylistId(playlist.id);
                            setTransferResult(null);
                            setTransferError("");
                            if (!newPlaylistName) {
                              setNewPlaylistName(getPlaylistName(sourcePlatform.id, playlist));
                            }
                          }}
                          style={{
                            "--playlist-image": `url(${getPlaylistImage(sourcePlatform.id, playlist)})`,
                          }}
                        >
                          <img
                            src={getPlaylistImage(sourcePlatform.id, playlist)}
                            alt={getPlaylistName(sourcePlatform.id, playlist)}
                          />
                          <span>{getPlaylistName(sourcePlatform.id, playlist)}</span>
                          <small>{getPlaylistCount(sourcePlatform.id, playlist)} {text.tracks}</small>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="destinationSetup">
                  <div className="transferModeRow">
                    <button
                      className={destinationMode === "new" ? "selectedMode" : "secondaryBtn"}
                      onClick={() => setDestinationMode("new")}
                    >
                      {text.transferToNew}
                    </button>

                    <button
                      className={destinationMode === "existing" ? "selectedMode" : "secondaryBtn"}
                      onClick={() => setDestinationMode("existing")}
                    >
                      {text.transferToExisting}
                    </button>
                  </div>

                  {destinationMode === "new" ? (
                    <input
                      className="playlistNameInput"
                      value={newPlaylistName}
                      onChange={(event) => setNewPlaylistName(event.target.value)}
                      placeholder={text.playlistName}
                    />
                  ) : (
                    <select
                      className="playlistNameInput"
                      value={destinationPlaylistId}
                      onChange={(event) => setDestinationPlaylistId(event.target.value)}
                    >
                      <option value="">{text.destinationPlaylist}</option>
                      {destinationPlaylists.map((playlist) => (
                        <option value={playlist.id} key={playlist.id}>
                          {getPlaylistName(destinationPlatform.id, playlist)}
                        </option>
                      ))}
                    </select>
                  )}

                  {transferError && (
                    <p className="error transferError">{transferError}</p>
                  )}

                  <p className="transferLimit">{text.transferLimit}</p>

                  <button
                    className="startTransferBtn"
                    onClick={startPlaylistTransfer}
                    disabled={
                      !selectedSourcePlaylist ||
                      transferLoading ||
                      (destinationMode === "existing" && !destinationPlaylistId)
                    }
                  >
                    {transferLoading ? text.transferLoading : text.startTransfer}
                  </button>

                  {transferResult && (
                    <div className="transferResult">
                      <div className="transferResultHeader">
                        <h3>{text.transferDone}</h3>
                      </div>

                      <div className="transferResultSummary">
                        <div className="resultStat addedStat">
                          <strong>{transferResult.added.length}</strong>
                          <span>{text.addedTracks}</span>
                        </div>

                        <div className="resultStat failedStat">
                          <strong>{transferResult.failed.length}</strong>
                          <span>{text.failedTracks}</span>
                        </div>

                        <div className="resultStat alreadyStat">
                          <strong>{transferResult.already.length}</strong>
                          <span>{text.alreadyTracks}</span>
                        </div>
                      </div>

                      <div className="transferResultLists">
                        <section className="resultListGroup addedGroup">
                          <h4>Added</h4>
                          {transferResult.added.length > 0 ? (
                            <ol>
                              {transferResult.added.map((track, index) => (
                                <li key={`added-${track}-${index}`}>{track}</li>
                              ))}
                            </ol>
                          ) : (
                            <p>None</p>
                          )}
                        </section>

                        <section className="resultListGroup failedGroup">
                          <h4>Failed</h4>
                          {transferResult.failed.length > 0 ? (
                            <ol>
                              {transferResult.failed.map((track, index) => (
                                <li key={`failed-${track}-${index}`}>{track}</li>
                              ))}
                            </ol>
                          ) : (
                            <p>None</p>
                          )}
                        </section>

                        <section className="resultListGroup alreadyGroup">
                          <h4>Already There</h4>
                          {transferResult.already.length > 0 ? (
                            <ol>
                              {transferResult.already.map((track, index) => (
                                <li key={`already-${track}-${index}`}>{track}</li>
                              ))}
                            </ol>
                          ) : (
                            <p>None</p>
                          )}
                        </section>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}

            <section className="homeInfoBanner">
              <div>
                <h2>{text.homeBannerTitle}</h2>
                <p>{text.homeBannerText}</p>
              </div>
              <div className="homeInfoBannerImages">
                <img src="/sleep.jpg" alt="" />
                <img src="/confetti.jpg" alt="" />
              </div>
            </section>
          </>
        )}


      </section>
      <Footer />
    </main>
  );
}

export default App;
