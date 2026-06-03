import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const response = await axios.get("http://127.0.0.1:8000/api/spotify/playlists", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setPlaylists(response.data.playlists);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur pendant la récupération des playlists.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <section className="card">
        <h1>🎵 SoundSync</h1>
        <p>Transfer playlists between your favorite platforms.</p>

        {!accessToken ? (
          <button onClick={loginSpotify}>Se connecter avec Spotify</button>
        ) : (
          <>
            <p className="success">✅ Connecté à Spotify</p>

            <div className="buttonRow">
              <button onClick={getPlaylists}>
                {loading ? "Chargement..." : "Afficher mes playlists"}
              </button>

              <button className="secondaryBtn" onClick={logoutSpotify}>
                Déconnexion
              </button>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="playlistList">
              {playlists.map((playlist) => (
                <div className="playlistCard" key={playlist.id}>
                  <img
                    src={playlist.images?.[0]?.url || "https://via.placeholder.com/100"}
                    alt={playlist.name}
                  />

                  <div>
                    <h3>{playlist.name}</h3>
                    <p>{playlist.tracks.total} morceaux</p>
                    <a href={playlist.external_urls.spotify} target="_blank" rel="noreferrer">
                      Ouvrir sur Spotify
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default App;