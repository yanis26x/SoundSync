const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

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

app.get("/api/platforms", (req, res) => {
  res.json({
    success: true,
    platforms: [
      {
        id: "spotify",
        name: "Spotify",
        available: true,
      },
      {
        id: "youtube",
        name: "YouTube Music",
        available: true,
      },
      {
        id: "apple-music",
        name: "Apple Music",
        available: false,
      },
      {
        id: "soundcloud",
        name: "SoundCloud",
        available: false,
      },
    ],
  });
});

app.post("/api/transfer", (req, res) => {
  const { source, destination, playlistUrl } = req.body;

  if (!source || !destination || !playlistUrl) {
    return res.status(400).json({
      success: false,
      message: "Source, destination et URL de playlist requis.",
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

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🎵 SoundSync backend running on port ${PORT}`);
});