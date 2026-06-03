import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [source, setSource] = useState("spotify");
  const [destination, setDestination] = useState("youtube");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const transferPlaylist = async () => {
    setError("");
    setResult(null);

    if (!playlistUrl.trim()) {
      setError("Colle une URL de playlist.");
      return;
    }

    if (source === destination) {
      setError("La source et la destination doivent être différentes.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/transfer", {
        source,
        destination,
        playlistUrl,
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur pendant le transfert.");
    }
  };

  return (
    <main className="app">
      <section className="card">
        <h1>🎵 SoundSync</h1>
        <p>Transfer playlists between your favorite platforms.</p>

        <div className="selectRow">
          <div>
            <label>Source</label>
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="spotify">Spotify</option>
              <option value="youtube">YouTube Music</option>
              <option value="apple-music">Apple Music</option>
              <option value="soundcloud">SoundCloud</option>
            </select>
          </div>

          <span className="arrow">→</span>

          <div>
            <label>Destination</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="spotify">Spotify</option>
              <option value="youtube">YouTube Music</option>
              <option value="apple-music">Apple Music</option>
              <option value="soundcloud">SoundCloud</option>
            </select>
          </div>
        </div>

        <input
          className="playlistInput"
          type="text"
          placeholder="Colle l’URL de ta playlist ici..."
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
        />

        <button onClick={transferPlaylist}>Transférer la playlist</button>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result">
            <h2>✅ Transfert lancé</h2>
            <p>{result.message}</p>
            <p>
              {result.transfer.source} → {result.transfer.destination}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;