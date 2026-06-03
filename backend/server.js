const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SoundSave26x API is running 🎵" });
});

app.post("/api/analyze", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes("soundcloud.com")) {
    return res.status(400).json({
      success: false,
      message: "URL SoundCloud invalide.",
    });
  }

  // Version test pour commencer
  res.json({
    success: true,
    title: "Exemple de musique",
    artist: "SoundCloud Artist",
    artwork: "https://via.placeholder.com/300",
    downloadable: false,
    message: "Analyse OK. On branchera l’API SoundCloud après.",
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`SoundSave26x backend running on port ${PORT}`);
});