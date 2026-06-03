import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [track, setTrack] = useState(null);
  const [error, setError] = useState("");

  const analyzeTrack = async () => {
    setError("");
    setTrack(null);

    if (!url.trim()) {
      setError("Colle une URL SoundCloud.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/analyze", {
        url,
      });

      setTrack(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur pendant l’analyse.");
    }
  };

  return (
    <main className="app">
      <section className="card">
        <h1>🎵 SoundSave26x</h1>
        <p>Download SoundCloud tracks legally.</p>

        <div className="inputGroup">
          <input
            type="text"
            placeholder="Colle ton lien SoundCloud ici..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={analyzeTrack}>Analyser</button>
        </div>

        {error && <p className="error">{error}</p>}

        {track && (
          <div className="trackCard">
            <img src={track.artwork} alt="cover" />
            <h2>{track.title}</h2>
            <p>{track.artist}</p>

            {track.downloadable ? (
              <a className="downloadBtn" href={track.downloadUrl}>
                Télécharger
              </a>
            ) : (
              <p className="notAvailable">
                Ce son n’est pas disponible au téléchargement.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;