import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { themes } from "./themes";
import MusicParticles from "./components/Particles/MusicParticles";
import Footer from "./components/Footer/Footer";
import CommentLoop from "./components/CommentLoop/CommentLoop";
import HomeStart from "./components/HomeStart/HomeStart";
import Activiter from "./components/Activiter/Activiter";
import MyPersonalMusic from "./components/MyPersonalMusic/MyPersonalMusic";
import WhySoundSync from "./components/WhySoundSync/WhySoundSync";
import DialoguePersona from "./components/dialoguePersona/DialoguePersona";
import Navbar from "./components/Navbar/Navbar";
import TransferDoneToast from "./components/TransferDoneToast/TransferDoneToast";
import Transfer from "./Pages/Transfer/Transfer";
import "./App.css";

const transferDoneSound = new URL("../music/psp.mp3", import.meta.url).href;
const transferToastCloseSound = new URL("../music/oupsP4.wav", import.meta.url).href;

const text = {
    subtitle: "Transfer Anywhere, Sync Everthing",
    chooseSource: "Select the source platform",
    chooseDestination: "Select the destination",
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
    changePlatform: "Reset",
    disconnectHint: "",
    logged: "✓",
    pickPlaylist: "Select a playlist 2 start syncing ur music",
    transferToNew: "Transfer into a new playlist",
    transferToExisting: "Add to an existing playlist",
    playlistName: "Playlist name",
    destinationPlaylist: "Destination playlist",
    startTransfer: "Start transfer",
    transferAllTracks: "All tracks",
    transferSpecificTracks: "Choose tracks",
    transferTrackChoice: "Tracks 2 sync",
    noSelectedTracks: "Choose at least one track to transfer.",
    transferBlockedTitle: "Transfer already running",
    transferBlockedText: "You can't start a new transfer until the current one is finished.",
    stopTransfer: "Stop transfer",
    transferStopped: "Transfer stopped.",
    transferLoading: "Transfer in progress...",
    transferPreparing: "Loading source tracks...",
    transferCreatingPlaylist: "Creating destination playlist...",
    transferCheckingDestination: "Checking destination playlist...",
    transferSearchingTrack: "Searching",
    transferAddingTracks: "Adding tracks...",
    transferFinalizing: "Finalizing transfer...",
    transferDone: "Transfer done",
    transferDoneNotification: "Transfer finished",
    transferDoneNotificationText: "Your playlist transfer is ready to review.",
    restartTransfer: "return 2 the menu",
    addedTracks: "tracks added",
    failedTracks: "tracks not found or failed",
    alreadyTracks: "tracks already in playlist",
    unsupportedTransfer: "Transfer is available for Spotify and YouTube for now.",
    transferLimit: "Transfers are sent in batches of 50 tracks.",
    homeBannerTitle: "Why SoundSync?!",
    homeBannerText: "My Apple Music subscription was about 2 expire... so I built SoundSync 2 keep all my playlists that i spent hours making!!",
};

const TRANSFER_BATCH_SIZE = 50;

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
  const [currentPage, setCurrentPage] = useState(() => {
    const pathName = window.location.pathname.toLowerCase();

    if (pathName === "/transfer") return "transfer";
    if (pathName === "/profil") return "profile";

    return "home";
  });
  const [selectedSourcePlaylistId, setSelectedSourcePlaylistId] = useState("");
  const [trackSelectionMode, setTrackSelectionMode] = useState("all");
  const [selectedTrackKeys, setSelectedTrackKeys] = useState([]);
  const [destinationMode, setDestinationMode] = useState("new");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [destinationPlaylistId, setDestinationPlaylistId] = useState("");
  const [transferStarted, setTransferStarted] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferStatus, setTransferStatus] = useState("");
  const [transferResult, setTransferResult] = useState(null);
  const [transferError, setTransferError] = useState("");
  const [transferDoneToast, setTransferDoneToast] = useState(null);
  const [simulationTransferMeta, setSimulationTransferMeta] = useState(null);
  const [isTransferBlockedModalOpen, setIsTransferBlockedModalOpen] = useState(false);
  const [isActivityVisible, setIsActivityVisible] = useState(true);
  const [currentTheme, setCurrentTheme] = useState("miku");
  const transferAbortControllerRef = useRef(null);
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
      logo: "/logo/spotify-mini.png",
    },
    youtube: youtubeAccessToken && {
      id: "youtube",
      name: "YouTube",
      logo: "/logo/ytb-mini.png",
    },
    apple: appleMusicUserToken && {
      id: "apple",
      name: "Apple Music",
      logo: "/logo/Apple-Music-mini.png",
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
  const platformDisplayLogos = {
    spotify: "/logo/spotify-mini.png",
    youtube: "/logo/YouTube-Logo.svg",
    apple: "/logo/appleMusic.png",
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

  const resetPlatformChoice = () => {
    localStorage.setItem("platform_order", JSON.stringify([]));
    setPlatformOrder([]);
    setSelectedSourcePlaylistId("");
    setTrackSelectionMode("all");
    setSelectedTrackKeys([]);
    setTransferStarted(false);
  };

  const navigateToPage = (page, path) => {
    window.history.pushState({}, "", path);
    setCurrentPage(page);
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
        const appleTrackCount = getApplePlaylistTrackCount(playlist);

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
      setCurrentPage("home");
    }
  }, [initialConnection]);

  useEffect(() => {
    const syncCurrentPageWithPath = () => {
      const pathName = window.location.pathname.toLowerCase();

      if (pathName === "/transfer") {
        setCurrentPage("transfer");
      } else if (pathName === "/profil") {
        setCurrentPage("profile");
      } else {
        setCurrentPage("home");
      }
    };

    window.addEventListener("popstate", syncCurrentPageWithPath);

    return () => window.removeEventListener("popstate", syncCurrentPageWithPath);
  }, []);

  useEffect(() => {
    if (!transferResult) return;

    setTransferDoneToast({
      id: Date.now(),
      added: transferResult.added.length,
      failed: transferResult.failed.length,
      isClosing: false,
    });

    const notificationAudio = new Audio(transferDoneSound);
    notificationAudio.volume = 0.45;
    notificationAudio.play().catch(() => {});
    const closeAudio = new Audio(transferToastCloseSound);
    closeAudio.volume = 0.5;

    const audioTimeout = window.setTimeout(() => {
      notificationAudio.pause();
      notificationAudio.currentTime = 0;
    }, 5200);

    const closeTimeout = window.setTimeout(() => {
      closeAudio.currentTime = 0;
      closeAudio.play().catch(() => {});
      setTransferDoneToast((currentToast) =>
        currentToast ? { ...currentToast, isClosing: true } : currentToast
      );
    }, 8400);

    const removeTimeout = window.setTimeout(() => {
      setTransferDoneToast(null);
    }, 9000);

    return () => {
      window.clearTimeout(audioTimeout);
      window.clearTimeout(closeTimeout);
      window.clearTimeout(removeTimeout);
      notificationAudio.pause();
      closeAudio.pause();
    };
  }, [transferResult]);

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
      logo: "/logo/ytb-mini.png",
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
      logo: "/logo/Apple-Music-mini.png",
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

  const getApplePlaylistTrackCount = (playlist) => {
    return (
      playlist.attributes?.trackCount ??
      playlist.attributes?.trackCountString ??
      playlist.relationships?.tracks?.meta?.total ??
      playlist.relationships?.tracks?.data?.length ??
      playlist.tracks?.total ??
      playlist.trackCount ??
      0
    );
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

    return getApplePlaylistTrackCount(playlist);
  };

  const selectedSourcePlaylist = sourcePlatform
    ? getPlatformPlaylists(sourcePlatform.id).find(
      (playlist) => playlist.id === selectedSourcePlaylistId
    )
    : null;
  const destinationPlaylists = destinationPlatform
    ? getPlatformPlaylists(destinationPlatform.id)
    : [];
  const selectedSourceTrackKey =
    sourcePlatform && selectedSourcePlaylist
      ? `${sourcePlatform.id}:${selectedSourcePlaylist.id}`
      : "";
  const selectedSourceTracks = selectedSourceTrackKey
    ? playlistTracks[selectedSourceTrackKey] || []
    : [];
  const selectedSourceTracksLoading = selectedSourceTrackKey
    ? Boolean(trackLoading[selectedSourceTrackKey])
    : false;
  const selectedSourceTracksError = selectedSourceTrackKey
    ? trackErrors[selectedSourceTrackKey] || ""
    : "";

  useEffect(() => {
    if (
      !sourcePlatform ||
      !selectedSourcePlaylist ||
      !selectedSourceTrackKey ||
      playlistTracks[selectedSourceTrackKey] ||
      trackLoading[selectedSourceTrackKey]
    ) {
      return;
    }

    getPlaylistTracks(sourcePlatform.id, selectedSourcePlaylist.id);
  }, [
    getPlaylistTracks,
    playlistTracks,
    selectedSourcePlaylist,
    selectedSourceTrackKey,
    sourcePlatform,
    trackLoading,
  ]);

  const toggleSelectedTrack = (trackKey) => {
    setSelectedTrackKeys((currentKeys) => {
      if (currentKeys.includes(trackKey)) {
        return currentKeys.filter((currentKey) => currentKey !== trackKey);
      }

      return [...currentKeys, trackKey];
    });
  };

  const restartTransferFlow = () => {
    setSelectedSourcePlaylistId("");
    setDestinationPlaylistId("");
    setDestinationMode("new");
    setNewPlaylistName("");
    setTrackSelectionMode("all");
    setSelectedTrackKeys([]);
    setTransferStarted(false);
    setTransferLoading(false);
    setTransferStatus("");
    setTransferResult(null);
    setTransferError("");
    setSimulationTransferMeta(null);
  };

  const runSimulationTransfer = async () => {
    if (transferLoading) {
      setIsTransferBlockedModalOpen(true);
      return;
    }

    const simulationSourcePlatform = {
      id: "spotify",
      name: "Spotify",
      logo: "/logo/spotify-mini.png",
    };
    const simulationDestinationPlatform = {
      id: "youtube",
      name: "YouTube",
      logo: "/logo/ytb-mini.png",
    };
    const simulationPlaylist = {
      id: "simulation-playlist",
      name: "Simulation playlist",
    };
    const simulationTracks = [
      "Synthetic Love - SoundSync",
      "No Credit Needed - Demo Mode",
      "Midnight Cache - Local Test",
      "API-Free Anthem - SoundSync",
      "Transfer Dreams - Demo Artist",
      "Almost There - Fake Playlist",
      "Offline Hearts - SoundSync",
      "Test Run Forever - Demo Mode",
    ];
    const failedTracks = ["Missing Simulation Track - Demo Artist"];

    restartTransferFlow();
    setSimulationTransferMeta({
      sourcePlatform: simulationSourcePlatform,
      destinationPlatform: simulationDestinationPlatform,
      playlist: simulationPlaylist,
    });
    setTransferStarted(true);
    setTransferLoading(true);
    setTransferError("");
    setTransferResult(null);
    navigateToPage("home", "/");

    const simulationAbortController = new AbortController();
    transferAbortControllerRef.current = simulationAbortController;
    const wait = (duration) =>
      new Promise((resolve, reject) => {
        const timeout = window.setTimeout(resolve, duration);

        simulationAbortController.signal.addEventListener(
          "abort",
          () => {
            window.clearTimeout(timeout);
            reject(new axios.CanceledError(text.transferStopped));
          },
          { once: true }
        );
      });

    try {
      setTransferStatus("Simulation: loading source tracks...");
      await wait(650);

      for (const [index, track] of simulationTracks.entries()) {
        setTransferStatus(`Simulation: matching ${index + 1}/${simulationTracks.length}: ${track}`);
        await wait(260);
      }

      setTransferStatus("Simulation: adding tracks 1/1");
      await wait(700);

      setTransferStatus(text.transferFinalizing);
      await wait(380);

      setTransferResult({
        added: simulationTracks,
        failed: failedTracks,
        already: ["Already Synced - Demo Mode"],
      });
    } catch (err) {
      if (axios.isCancel(err)) {
        setTransferError(text.transferStopped);
      } else {
        setTransferError(text.trackError);
      }
    } finally {
      if (transferAbortControllerRef.current === simulationAbortController) {
        transferAbortControllerRef.current = null;
        setTransferLoading(false);
        setTransferStatus("");
      }
    }
  };

  const startNewTransferFlow = () => {
    if (transferLoading) {
      setIsTransferBlockedModalOpen(true);
      return;
    }

    restartTransferFlow();
    navigateToPage("transfer", "/transfer");
  };

  const stopTransfer = () => {
    if (!transferLoading) return;

    transferAbortControllerRef.current?.abort();
    setTransferStatus(text.transferStopped);
  };

  const startPlaylistTransfer = async () => {
    if (!sourcePlatform || !destinationPlatform || !selectedSourcePlaylist) return;

if (
  !["spotify", "youtube", "apple"].includes(destinationPlatform.id)
) {
  setTransferError(text.unsupportedTransfer);
  return;
}

    setTransferStarted(true);
    setTransferLoading(true);
    setTransferStatus(text.transferPreparing);
    setTransferError("");
    setTransferResult(null);
    setSimulationTransferMeta(null);
    const transferAbortController = new AbortController();
    transferAbortControllerRef.current = transferAbortController;
    const throwIfTransferStopped = () => {
      if (transferAbortController.signal.aborted) {
        throw new axios.CanceledError(text.transferStopped);
      }
    };

    const sourceTrackKey = `${sourcePlatform.id}:${selectedSourcePlaylist.id}`;

    try {
      let tracks = playlistTracks[sourceTrackKey];

      if (!tracks) {
        setTransferStatus(text.transferPreparing);
        const tracksResponse = await authorizedRequest(sourcePlatform.id, {
          method: "get",
          url: `http://127.0.0.1:8000/api/${sourcePlatform.id}/playlists/${selectedSourcePlaylist.id}/tracks`,
          signal: transferAbortController.signal,
        });

        tracks = tracksResponse.data.tracks;
        setPlaylistTracks((currentTracks) => ({
          ...currentTracks,
          [sourceTrackKey]: tracks,
        }));
      }
      throwIfTransferStopped();

      const tracksToTransfer =
        trackSelectionMode === "specific"
          ? tracks.filter((track, index) =>
            selectedTrackKeys.includes(`${sourceTrackKey}:${index}`)
          )
          : tracks;

      if (trackSelectionMode === "specific" && tracksToTransfer.length === 0) {
        throw new Error(text.noSelectedTracks);
      }

      const trackLabels = tracksToTransfer
        .map((track) => getTrackLabel(sourcePlatform.id, track))
        .filter(Boolean);

      let targetPlaylistId = destinationPlaylistId;

      if (destinationMode === "new") {
        setTransferStatus(text.transferCreatingPlaylist);
        const createUrl = `http://127.0.0.1:8000/api/${destinationPlatform.id}/playlists`;
        const playlistTitle =
          newPlaylistName.trim() ||
          getPlaylistName(sourcePlatform.id, selectedSourcePlaylist);
        const createResponse = await authorizedRequest(destinationPlatform.id, {
          method: "post",
          url: createUrl,
          signal: transferAbortController.signal,
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
        setTransferStatus(text.transferCheckingDestination);
        const destinationTrackResponse = await authorizedRequest(destinationPlatform.id, {
          method: "get",
          url: `http://127.0.0.1:8000/api/${destinationPlatform.id}/playlists/${targetPlaylistId}/tracks`,
          signal: transferAbortController.signal,
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
      const chunkItems = (items, size) => {
        const chunks = [];

        for (let index = 0; index < items.length; index += size) {
          chunks.push(items.slice(index, index + size));
        }

        return chunks;
      };
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

        for (const [index, label] of trackLabels.entries()) {
          throwIfTransferStopped();
          setTransferStatus(`${text.transferSearchingTrack} ${index + 1}/${trackLabels.length}: ${label}`);
          try {
            const searchResponse = await authorizedRequest("spotify", {
              method: "get",
              url: "http://127.0.0.1:8000/api/spotify/search",
              signal: transferAbortController.signal,
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
          } catch (err) {
            if (axios.isCancel(err)) throw err;
            pushTransferResult(label, "failed");
          }
        }

        for (const [chunkIndex, uriChunk] of chunkItems(uris, TRANSFER_BATCH_SIZE).entries()) {
          setTransferStatus(
            `${text.transferAddingTracks} ${chunkIndex + 1}/${Math.ceil(uris.length / TRANSFER_BATCH_SIZE)}`
          );
          throwIfTransferStopped();
          await authorizedRequest("spotify", {
            method: "post",
            url: `http://127.0.0.1:8000/api/spotify/playlists/${targetPlaylistId}/tracks`,
            signal: transferAbortController.signal,
            data: {
              uris: uriChunk,
            },
          });
        }
      }

      if (destinationPlatform.id === "youtube") {
        const youtubeVideos = [];

        for (const [index, label] of trackLabels.entries()) {
          throwIfTransferStopped();
          setTransferStatus(`${text.transferSearchingTrack} ${index + 1}/${trackLabels.length}: ${label}`);
          try {
            const searchResponse = await authorizedRequest("youtube", {
              method: "get",
              url: "http://127.0.0.1:8000/api/youtube/search",
              signal: transferAbortController.signal,
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

            existingDestinationTrackIds.add(videoId);
            youtubeVideos.push({ label, videoId });
          } catch (err) {
            if (axios.isCancel(err)) throw err;
            pushTransferResult(label, "failed");
          }
        }

        for (const [chunkIndex, videoChunk] of chunkItems(youtubeVideos, TRANSFER_BATCH_SIZE).entries()) {
          setTransferStatus(
            `${text.transferAddingTracks} ${chunkIndex + 1}/${Math.ceil(youtubeVideos.length / TRANSFER_BATCH_SIZE)}`
          );
          throwIfTransferStopped();

          try {
            await authorizedRequest("youtube", {
              method: "post",
              url: `http://127.0.0.1:8000/api/youtube/playlists/${targetPlaylistId}/tracks`,
              signal: transferAbortController.signal,
              data: {
                videoIds: videoChunk.map((video) => video.videoId),
              },
            });

            videoChunk.forEach((video) => pushTransferResult(video.label, "added"));
          } catch (err) {
            if (axios.isCancel(err)) throw err;
            videoChunk.forEach((video) => pushTransferResult(video.label, "failed"));
          }
        }
      }

      if (destinationPlatform.id === "apple") {
        const songs = [];

        for (const [index, label] of trackLabels.entries()) {
          throwIfTransferStopped();
          setTransferStatus(`${text.transferSearchingTrack} ${index + 1}/${trackLabels.length}: ${label}`);
          try {
            const searchResponse = await authorizedRequest("apple", {
              method: "get",
              url: "http://127.0.0.1:8000/api/apple/search",
              signal: transferAbortController.signal,
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
          } catch (err) {
            if (axios.isCancel(err)) throw err;
            pushTransferResult(label, "failed");
          }
        }

        for (const [chunkIndex, songChunk] of chunkItems(songs, TRANSFER_BATCH_SIZE).entries()) {
          setTransferStatus(
            `${text.transferAddingTracks} ${chunkIndex + 1}/${Math.ceil(songs.length / TRANSFER_BATCH_SIZE)}`
          );
          throwIfTransferStopped();
          await authorizedRequest("apple", {
            method: "post",
            url: `http://127.0.0.1:8000/api/apple/playlists/${targetPlaylistId}/tracks`,
            signal: transferAbortController.signal,
            data: {
              songs: songChunk,
            },
          });
        }
      }

      setTransferStatus(text.transferFinalizing);
      setTransferResult({
        added,
        failed,
        already,
      });
    } catch (err) {
      if (axios.isCancel(err)) {
        setTransferError(text.transferStopped);
      } else {
        setTransferError(err.response?.data?.message || err.message || text.trackError);
      }
    } finally {
      if (transferAbortControllerRef.current === transferAbortController) {
        transferAbortControllerRef.current = null;
        setTransferLoading(false);
        setTransferStatus("");
      }
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

      {transferDoneToast && (
        <TransferDoneToast
          className={transferDoneToast.isClosing ? "closing" : ""}
          title={text.transferDoneNotification}
          message={text.transferDoneNotificationText}
          added={transferDoneToast.added}
          failed={transferDoneToast.failed}
        />
      )}

      <Navbar
        themes={themes}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        onOpenProfile={() => navigateToPage("profile", "/profil")}
        onOpenTransfer={() => navigateToPage("home", "/")}
        profileLabel={text.profile}
        transferLabel={text.home}
        showTransferButton={currentPage === "transfer"}
        showProfileButton={true}
        showThemeButton={currentPage !== "transfer"}
      />

      {currentPage === "transfer" &&
        selectedPlatforms.length === 2 &&
        sourcePlatform &&
        destinationPlatform &&
        !selectedSourcePlaylistId && (
          <DialoguePersona texte={text.pickPlaylist} />
        )}

      {isTransferBlockedModalOpen && (
        <div
          className="transferBlockedOverlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="transferBlockedTitle"
          onClick={() => setIsTransferBlockedModalOpen(false)}
        >
          <div className="transferBlockedModal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="transferBlockedClose"
              onClick={() => setIsTransferBlockedModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>

            <img src="/ichigo/hug.jpg" alt="" />

            <div>
              <h2 id="transferBlockedTitle">{text.transferBlockedTitle}</h2>
              <p>{text.transferBlockedText}</p>
            </div>
          </div>
        </div>
      )}

      <section className="card">
        {/* <Parental /> */}
        {/* <section className="mainHero">
          <img
            src="/SoundSync/SoundSyncLogoNoBG.png"
            alt="SoundSync"
            className="mainHeroLogo"
          />
        </section> */}

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

        {currentPage === "transfer" && (
          <Transfer
            text={text}
            chooseText={chooseText}
            platformOrder={platformOrder}
            accessToken={accessToken}
            youtubeAccessToken={youtubeAccessToken}
            appleMusicUserToken={appleMusicUserToken}
            selectedPlatforms={selectedPlatforms}
            sourcePlatform={sourcePlatform}
            destinationPlatform={destinationPlatform}
            platformDisplayLogos={platformDisplayLogos}
            getPlatformDetails={getPlatformDetails}
            getPlatformPlaylists={getPlatformPlaylists}
            selectedSourcePlaylistId={selectedSourcePlaylistId}
            setSelectedSourcePlaylistId={setSelectedSourcePlaylistId}
            setTransferResult={setTransferResult}
            setTransferError={setTransferError}
            newPlaylistName={newPlaylistName}
            setNewPlaylistName={setNewPlaylistName}
            getPlaylistImage={getPlaylistImage}
            getPlaylistName={getPlaylistName}
            getPlaylistCount={getPlaylistCount}
            destinationMode={destinationMode}
            setDestinationMode={setDestinationMode}
            destinationPlaylistId={destinationPlaylistId}
            setDestinationPlaylistId={setDestinationPlaylistId}
            destinationPlaylists={destinationPlaylists}
            transferError={transferError}
            transferStarted={transferStarted}
            transferLoading={transferLoading}
            transferStatus={transferStatus}
            selectedSourcePlaylist={selectedSourcePlaylist}
            selectedSourceTracks={selectedSourceTracks}
            selectedSourceTracksLoading={selectedSourceTracksLoading}
            selectedSourceTracksError={selectedSourceTracksError}
            trackSelectionMode={trackSelectionMode}
            setTrackSelectionMode={setTrackSelectionMode}
            selectedTrackKeys={selectedTrackKeys}
            setSelectedTrackKeys={setSelectedTrackKeys}
            toggleSelectedTrack={toggleSelectedTrack}
            getTrackLabel={getTrackLabel}
            startPlaylistTransfer={startPlaylistTransfer}
            restartTransferFlow={restartTransferFlow}
            returnToMenu={() => navigateToPage("home", "/")}
            stopTransfer={stopTransfer}
            transferResult={transferResult}
            addPlatformToOrder={addPlatformToOrder}
            loginSpotify={loginSpotify}
            loginYoutube={loginYoutube}
            loginAppleMusic={loginAppleMusic}
            resetPlatformChoice={resetPlatformChoice}
            startSimulationTransfer={runSimulationTransfer}
          />
        )}

        {currentPage === "home" && (
          <>
            <HomeStart
              onOpenTransfer={startNewTransferFlow}
              isActivityVisible={isActivityVisible}
              onToggleActivity={() => setIsActivityVisible((currentValue) => !currentValue)}
            />

            {isActivityVisible && (
              <Activiter
                text={text}
                transferStarted={transferStarted}
                transferLoading={transferLoading}
                transferStatus={transferStatus}
                transferResult={transferResult}
                transferError={transferError}
                sourcePlatform={simulationTransferMeta?.sourcePlatform || sourcePlatform}
                destinationPlatform={simulationTransferMeta?.destinationPlatform || destinationPlatform}
                selectedSourcePlaylist={simulationTransferMeta?.playlist || selectedSourcePlaylist}
                getPlaylistName={getPlaylistName}
                onStopTransfer={stopTransfer}
              />
            )}

            <WhySoundSync text={text.homeBannerText} />

            <div className="homePersonalGrid">
              <CommentLoop />
              <MyPersonalMusic />
            </div>
          </>
        )}


      </section>
      <Footer />
    </main>
  );
}

export default App;
