const express = require("express");
const cors = require("cors");
const axios = require("axios");
const querystring = require("querystring");
const generateAppleDeveloperToken = require("./appleToken");
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
  res.json({ message: "SoundSync API is running 🎵" });
});

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    app: "SoundSync",
    platforms: ["Spotify", "YouTube Music", "Apple Music", "SoundCloud"],
    version: "1.0.0",
  });
});

/* =========================
   APPLE MUSIC
========================= */

app.get("/api/apple/token", (req, res) => {
  try {
    const token = generateAppleDeveloperToken();

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Erreur Apple Music :", error);

    res.status(500).json({
      success: false,
      message: "Impossible de générer le token Apple Music.",
    });
  }
});

app.get("/api/apple/playlists", async (req, res) => {
  const musicUserToken = req.headers.authorization?.replace("Bearer ", "");

  if (!musicUserToken) {
    return res.status(401).json({
      success: false,
      message: "Token Apple Music manquant.",
    });
  }

  try {
    const developerToken = generateAppleDeveloperToken();

    const response = await axios.get(
      "https://api.music.apple.com/v1/me/library/playlists",
      {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          "Music-User-Token": musicUserToken,
        },
        params: {
          limit: 25,
        },
      }
    );

    res.json({
      success: true,
      playlists: response.data.data,
    });
  } catch (error) {
    console.error("Erreur playlists Apple Music :", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.errors?.[0]?.detail ||
        error.response?.data?.errors?.[0]?.title ||
        "Impossible de récupérer les playlists Apple Music.",
    });
  }
});

app.get("/api/apple/playlists/:playlistId/tracks", async (req, res) => {
  const musicUserToken = req.headers.authorization?.replace("Bearer ", "");
  const { playlistId } = req.params;

  if (!musicUserToken) {
    return res.status(401).json({
      success: false,
      message: "Token Apple Music manquant.",
    });
  }

  try {
    const developerToken = generateAppleDeveloperToken();

    const response = await axios.get(
      `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          "Music-User-Token": musicUserToken,
        },
        params: {
          limit: 50,
        },
      }
    );

    res.json({
      success: true,
      tracks: response.data.data,
    });
  } catch (error) {
    console.error("Erreur musiques Apple Music :", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les musiques Apple Music.",
    });
  }
});

/* =========================
   SPOTIFY AUTH
========================= */

app.get("/auth/spotify", (req, res) => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    return res.status(500).send("Erreur configuration Spotify.");
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

  if (error) return res.send(`<h1>Erreur Spotify</h1><p>${error}</p>`);
  if (!code) return res.send("Aucun code reçu de Spotify.");

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
    res.send("Erreur pendant la connexion Spotify.");
  }
});

/* =========================
   GOOGLE / YOUTUBE AUTH
========================= */

app.get("/auth/google", (req, res) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    return res.status(500).send("Erreur configuration Google.");
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

  res.redirect(authUrl);
});

app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;

  if (error) return res.send(`<h1>Erreur Google</h1><p>${error}</p>`);
  if (!code) return res.send("Aucun code reçu de Google.");

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
    res.send("Erreur pendant la connexion Google / YouTube.");
  }
});

/* =========================
   YOUTUBE API
========================= */

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

app.post("/api/youtube/playlists", async (req, res) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");
  const { title, description, privacyStatus } = req.body;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Token YouTube manquant.",
    });
  }

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Titre de playlist requis.",
    });
  }

  try {
    const response = await axios.post(
      "https://www.googleapis.com/youtube/v3/playlists",
      {
        snippet: {
          title,
          description: description || "Playlist créée avec SoundSync.",
        },
        status: {
          privacyStatus: privacyStatus || "private",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          part: "snippet,status",
        },
      }
    );

    res.json({
      success: true,
      message: "Playlist YouTube créée avec succès.",
      playlist: response.data,
    });
  } catch (error) {
    console.error("Erreur création playlist YouTube :", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        "Impossible de créer la playlist YouTube.",
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

app.post("/api/youtube/playlists/:playlistId/tracks", async (req, res) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");
  const { playlistId } = req.params;
  const { videoId } = req.body;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Token YouTube manquant.",
    });
  }

  if (!videoId) {
    return res.status(400).json({
      success: false,
      message: "Video YouTube requise.",
    });
  }

  try {
    const response = await axios.post(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        snippet: {
          playlistId,
          resourceId: {
            kind: "youtube#video",
            videoId,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          part: "snippet",
        },
      }
    );

    res.json({
      success: true,
      item: response.data,
    });
  } catch (error) {
    console.error("Erreur ajout YouTube :", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        "Impossible d'ajouter la video YouTube.",
    });
  }
});

app.get("/api/youtube/search", async (req, res) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");
  const { q } = req.query;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Token YouTube manquant.",
    });
  }

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Recherche YouTube requise.",
    });
  }

  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        part: "snippet",
        q,
        type: "video",
        maxResults: 1,
      },
    });

    res.json({
      success: true,
      item: response.data.items?.[0] || null,
    });
  } catch (error) {
    console.error("Erreur recherche YouTube :", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        "Impossible de rechercher sur YouTube.",
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

app.post("/api/spotify/playlists", async (req, res) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");
  const { name, description, public: isPublic } = req.body;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Token Spotify manquant.",
    });
  }

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Nom de playlist requis.",
    });
  }

  try {
    const meResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const response = await axios.post(
      `https://api.spotify.com/v1/users/${meResponse.data.id}/playlists`,
      {
        name,
        description: description || "Playlist creee avec SoundSync.",
        public: Boolean(isPublic),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      playlist: response.data,
    });
  } catch (error) {
    console.error("Erreur création Spotify :", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        "Impossible de créer la playlist Spotify.",
    });
  }
});

app.post("/api/spotify/playlists/:playlistId/tracks", async (req, res) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");
  const { playlistId } = req.params;
  const { uris } = req.body;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Token Spotify manquant.",
    });
  }

  if (!Array.isArray(uris) || uris.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Musiques Spotify requises.",
    });
  }

  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: uris.slice(0, 100),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      snapshotId: response.data.snapshot_id,
    });
  } catch (error) {
    console.error("Erreur ajout Spotify :", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        "Impossible d'ajouter les musiques Spotify.",
    });
  }
});

app.get("/api/spotify/search", async (req, res) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");
  const { q } = req.query;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Token Spotify manquant.",
    });
  }

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Recherche Spotify requise.",
    });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q,
        type: "track",
        limit: 1,
      },
    });

    res.json({
      success: true,
      track: response.data.tracks?.items?.[0] || null,
    });
  } catch (error) {
    console.error("Erreur recherche Spotify :", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        "Impossible de rechercher sur Spotify.",
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
  console.log(`Apple token: http://127.0.0.1:${PORT}/api/apple/token`);
});
