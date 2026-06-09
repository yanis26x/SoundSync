const express = require("express");
const cors = require("cors");
const axios = require("axios");
const querystring = require("querystring");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

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

/* =========================
   SPOTIFY AUTH
========================= */

app.get("/auth/spotify", (req, res) => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    return res.status(500).send(`
      <h1>Erreur configuration Spotify</h1>
      <p>Vérifie ton fichier .env.</p>
    `);
  }

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

  res.redirect(authUrl);
});

app.get("/auth/spotify/callback", async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;

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
            Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
              "base64"
            ),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    res.redirect(
      `${FRONTEND_URL}/?spotify_access_token=${access_token}&spotify_refresh_token=${refresh_token}&spotify_expires_in=${expires_in}`
    );
  } catch (error) {
    console.error("Erreur token Spotify :", error.response?.data || error.message);

    res.send(`
      <h1>Erreur pendant la connexion Spotify</h1>
      <p>Regarde le terminal backend pour voir le détail.</p>
    `);
  }
});

/* =========================
   GOOGLE / YOUTUBE AUTH
========================= */

app.get("/auth/google", (req, res) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    return res.status(500).send(`
      <h1>Erreur configuration Google</h1>
      <p>Vérifie ton fichier .env.</p>
      <p>Il faut :</p>
      <ul>
        <li>GOOGLE_CLIENT_ID</li>
        <li>GOOGLE_CLIENT_SECRET</li>
        <li>GOOGLE_REDIRECT_URI</li>
      </ul>
    `);
  }

  const scope = [
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.readonly",
  ].join(" ");

  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    querystring.stringify({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope,
      access_type: "offline",
      prompt: "consent",
    });

  console.log("Google Redirect URI utilisé :", GOOGLE_REDIRECT_URI);
  console.log("URL Google :", authUrl);

  res.redirect(authUrl);
});

app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;

  console.log("Google callback reçu :", req.query);

  if (error) {
    return res.send(`
      <h1>Erreur Google</h1>
      <p>${error}</p>
    `);
  }

  if (!code) {
    return res.send(`
      <h1>Erreur</h1>
      <p>Aucun code reçu de Google.</p>
      <p>Retourne sur <a href="/auth/google">/auth/google</a> pour réessayer.</p>
    `);
  }

  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      querystring.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    res.redirect(
      `${FRONTEND_URL}/?youtube_access_token=${access_token}&youtube_refresh_token=${refresh_token || ""}&youtube_expires_in=${expires_in}`
    );
  } catch (error) {
    console.error("Erreur token Google :", error.response?.data || error.message);

    res.send(`
      <h1>Erreur pendant la connexion Google / YouTube</h1>
      <p>Regarde le terminal backend pour voir le détail.</p>
    `);
  }
});

app.get("/api/youtube/me", async (req, res) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Token YouTube manquant.",
    });
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          part: "snippet,contentDetails,statistics",
          mine: true,
        },
      }
    );

    res.json({
      success: true,
      channel: response.data.items?.[0] || null,
    });
  } catch (error) {
    console.error("Erreur profil YouTube :", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer le profil YouTube.",
    });
  }
});

app.get("/api/youtube/playlists", async (req, res) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Token YouTube manquant.",
    });
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlists",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          part: "snippet,contentDetails",
          mine: true,
          maxResults: 25,
        },
      }
    );

    res.json({
      success: true,
      playlists: response.data.items,
    });
  } catch (error) {
    console.error("Erreur playlists YouTube :", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les playlists YouTube.",
    });
  }
});

app.get("/api/youtube/playlists/:playlistId/tracks", async (req, res) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");
  const { playlistId } = req.params;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Token YouTube manquant.",
    });
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          part: "snippet,contentDetails",
          playlistId,
          maxResults: 50,
        },
      }
    );

    res.json({
      success: true,
      tracks: response.data.items,
    });
  } catch (error) {
    console.error("Erreur musiques YouTube :", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les musiques YouTube.",
    });
  }
});

/* =========================
   SPOTIFY API
========================= */

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

app.get("/api/spotify/playlists/:playlistId/tracks", async (req, res) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");
  const { playlistId } = req.params;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Token Spotify manquant.",
    });
  }

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit: 50,
        },
      }
    );

    res.json({
      success: true,
      tracks: response.data.items,
    });
  } catch (error) {
    console.error("Erreur musiques Spotify :", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les musiques Spotify.",
    });
  }
});

/* =========================
   TRANSFER DEMO
========================= */

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
  console.log(`Spotify login: http://127.0.0.1:${PORT}/auth/spotify`);
  console.log(`YouTube login: http://127.0.0.1:${PORT}/auth/google`);
  console.log(`Spotify Redirect URI: ${SPOTIFY_REDIRECT_URI}`);
  console.log(`Google Redirect URI: ${GOOGLE_REDIRECT_URI}`);
});
