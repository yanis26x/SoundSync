const express = require("express");
const cors = require("cors");
const axios = require("axios");
const querystring = require("querystring");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

app.get("/", (req, res) => {
  res.json({
    message: "SoundSync API is running 🎵",
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    app: "SoundSync",
    description: "Transfer playlists between music platforms.",
    platforms: ["Spotify", "YouTube Music", "Apple Music", "SoundCloud"],
    version: "1.0.0",
  });
});

app.get("/auth/spotify", (req, res) => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    return res.status(500).send(`
      <h1>Erreur configuration Spotify</h1>
      <p>Vérifie ton fichier .env.</p>
      <p>Il faut :</p>
      <ul>
        <li>SPOTIFY_CLIENT_ID</li>
        <li>SPOTIFY_CLIENT_SECRET</li>
        <li>SPOTIFY_REDIRECT_URI</li>
      </ul>
    `);
  }

  console.log("Redirect URI utilisé :", SPOTIFY_REDIRECT_URI);

  const scope = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
  ].join(" ");

  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      show_dialog: true,
    });

  console.log("URL Spotify :", authUrl);

  res.redirect(authUrl);
});

app.get("/auth/spotify/callback", async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;

  console.log("Callback reçu :", req.query);

  if (error) {
    return res.send(`
      <h1>Erreur Spotify</h1>
      <p>${error}</p>
    `);
  }

  if (!code) {
    return res.send(`
      <h1>Erreur</h1>
      <p>Aucun code reçu de Spotify.</p>
      <p>Retourne sur <a href="/auth/spotify">/auth/spotify</a> pour réessayer.</p>
    `);
  }

  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    res.redirect(
      `http://localhost:5173/?spotify_access_token=${access_token}&spotify_refresh_token=${refresh_token}&expires_in=${expires_in}`
    );
  } catch (error) {
    console.error("Erreur token Spotify :", error.response?.data || error.message);

    res.send(`
      <h1>Erreur pendant la connexion Spotify</h1>
      <p>Regarde le terminal backend pour voir le détail.</p>
    `);
  }
});

app.get("/api/spotify/me", async (req, res) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Token Spotify manquant.",
    });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json({
      success: true,
      user: response.data,
    });
  } catch (error) {
    console.error("Erreur profil Spotify :", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer le profil Spotify.",
    });
  }
});

app.get("/api/spotify/playlists", async (req, res) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Token Spotify manquant.",
    });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 20,
      },
    });

    res.json({
      success: true,
      playlists: response.data.items,
    });
  } catch (error) {
    console.error("Erreur playlists Spotify :", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les playlists Spotify.",
    });
  }
});

app.post("/api/transfer", (req, res) => {
  const { source, destination, playlistUrl } = req.body;

  if (!source || !destination || !playlistUrl) {
    return res.status(400).json({
      success: false,
      message: "Source, destination et URL de playlist requis.",
    });
  }

  if (source === destination) {
    return res.status(400).json({
      success: false,
      message: "La source et la destination doivent être différentes.",
    });
  }

  res.json({
    success: true,
    message: "Simulation du transfert réussie.",
    transfer: {
      source,
      destination,
      playlistUrl,
      status: "demo",
    },
  });
});

app.listen(PORT, () => {
  console.log(`🎵 SoundSync backend running on port ${PORT}`);
  console.log(`Spotify login: http://localhost:${PORT}/auth/spotify`);
  console.log(`Redirect URI utilisé: ${SPOTIFY_REDIRECT_URI}`);
});