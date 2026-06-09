import { useEffect, useState } from "react";
import axios from "axios";
import { themes } from "./themes";
import ThemeSelector from "./components/ThemeSelector";
import Parental from "./components/Parental";
import "./App.css";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [youtubeAccessToken, setYoutubeAccessToken] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [youtubePlaylists, setYoutubePlaylists] = useState([]);
  const [error, setError] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [youtubeLoading, setYoutubeLoading] = useState(false);

  const [currentTheme, setCurrentTheme] = useState("tomo");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spotifyTokenFromUrl = params.get("spotify_access_token");
    const youtubeTokenFromUrl = params.get("youtube_access_token");
    const savedSpotifyToken = localStorage.getItem("spotify_access_token");
    const savedYoutubeToken = localStorage.getItem("youtube_access_token");
    let shouldCleanUrl = false;

    if (spotifyTokenFromUrl) {
      localStorage.setItem("spotify_access_token", spotifyTokenFromUrl);
      setAccessToken(spotifyTokenFromUrl);
      shouldCleanUrl = true;
    } else if (savedSpotifyToken) {
      setAccessToken(savedSpotifyToken);
    }

    if (youtubeTokenFromUrl) {
      localStorage.setItem("youtube_access_token", youtubeTokenFromUrl);
      setYoutubeAccessToken(youtubeTokenFromUrl);
      shouldCleanUrl = true;
    } else if (savedYoutubeToken) {
      setYoutubeAccessToken(savedYoutubeToken);
    }

    if (shouldCleanUrl) {
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

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
  };

  const logoutYoutube = () => {
    localStorage.removeItem("youtube_access_token");
    setYoutubeAccessToken("");
    setYoutubePlaylists([]);
  };

  const getPlaylists = async () => {
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
  };

  const getYoutubePlaylists = async () => {
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
  };

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

        {!accessToken && !youtubeAccessToken && (
          <p className="chooseText">
            Choose a platform to start syncing your playlists
          </p>
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

        {accessToken && (
          <>
            <p className="success">✅ Connecté à Spotify</p>

            <div className="buttonRow">
              <button onClick={getPlaylists}>
                {loading
                  ? "Chargement..."
                  : "Afficher mes playlists"}
              </button>

              <button
                className="secondaryBtn"
                onClick={logoutSpotify}
              >
                Déconnexion
              </button>
            </div>

            {error && (
              <p className="error">{error}</p>
            )}

            <div className="playlistList">
              {playlists.map((playlist) => (
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
                      href={
                        playlist.external_urls.spotify
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ouvrir sur Spotify
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {youtubeAccessToken && (
          <div className="youtubeConnected">
            <p className="success">✅ Connecté à YouTube</p>

            <div className="buttonRow">
              <button onClick={getYoutubePlaylists}>
                {youtubeLoading
                  ? "Chargement..."
                  : "Afficher mes playlists YouTube"}
              </button>

              <button
                className="secondaryBtn"
                onClick={logoutYoutube}
              >
                Déconnexion YouTube
              </button>
            </div>

            {youtubeError && (
              <p className="error">{youtubeError}</p>
            )}

            <div className="playlistList">
              {youtubePlaylists.map((playlist) => (
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
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
