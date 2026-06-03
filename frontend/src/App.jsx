import { useEffect, useState } from "react";
import axios from "axios";
import { themes } from "./themes";
import ThemeSelector from "./components/ThemeSelector";
import "./App.css";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentTheme, setCurrentTheme] = useState("tomo");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("spotify_access_token");

    if (tokenFromUrl) {
      localStorage.setItem("spotify_access_token", tokenFromUrl);
      setAccessToken(tokenFromUrl);

      window.history.replaceState({}, document.title, "/");
    } else {
      const savedToken = localStorage.getItem("spotify_access_token");

      if (savedToken) {
        setAccessToken(savedToken);
      }
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

  const logoutSpotify = () => {
    localStorage.removeItem("spotify_access_token");
    setAccessToken("");
    setPlaylists([]);
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

  return (
    <main className="app">
      <section className="card">
        <div className="brand">
          <span className="star">𖤐</span>
          <h1>SoundSync</h1>
        </div>

        <p>Transfer playlists between your favorite platforms.</p>

        <ThemeSelector
          themes={themes}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
        />

        <p className="chooseText">
          Choose a platform to start syncing your playlists
        </p>

        {!accessToken ? (
          <button className="spotifyBtn" onClick={loginSpotify}>
            <img
              src="/image/logo/Spotify-Black-Logo.png"
              alt="Spotify"
              className="spotifyBigLogo"
            />
          </button>
        ) : (
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

        <div className="comingSoon">
          <h2>Future Platforms</h2>

          <div className="platforms">
            <div className="platformCard">
              <img
                src="/image/logo/appleMusic.png"
                alt="Apple Music"
              />
              <span>Apple Music</span>
            </div>

            <div className="platformCard">
              <img
                src="/image/logo/YouTube-Logo.png"
                alt="YouTube Music"
              />
              <span>YouTube Music</span>
            </div>

            <div className="platformCard">
              <img
                src="/image/logo/soundcloud-logo.png"
                alt="SoundCloud"
              />
              <span>SoundCloud</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;