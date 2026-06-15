import { useRef, useState } from "react";
import "./MyPersonalMusic.css";

const songs = [
    {
    title: "Strawberry Milkshake",
    subtitle: "canonconfetti",
    src: new URL("../../../music/banana.mp3", import.meta.url).href,
    cover: new URL("../../../music/when-they-cryCOVER.jpg", import.meta.url).href,
  },
      {
    title: "laugh",
    subtitle: "",
    src: new URL("../../../music/swamp.mp3", import.meta.url).href,
    cover: new URL("../../../music/vampire.jpeg", import.meta.url).href,
  },
];

const tabs = ["music", "playlists", "miku"];

function MyPersonalMusic() {
  const audioRef = useRef(null);
  const [activeTab, setActiveTab] = useState("music");
  const [activeSongIndex, setActiveSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeSong = songs[activeSongIndex];

  const togglePlayback = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    await audioRef.current.play();
    setIsPlaying(true);
  };

  const playNextSong = () => {
    setActiveSongIndex((currentIndex) => (currentIndex + 1) % songs.length);
    setIsPlaying(false);
  };

  return (
    <section className="personalMusicPanel">
      <div className="personalMusicBody">
        {activeTab === "music" && (
          <div className="personalMusicPlayer">
            <img
              className="personalMusicCover"
              src={activeSong.cover}
              alt={activeSong.title}
            />

            <div className="personalMusicTrackInfo">
              <div>
                <h2>{activeSong.title}</h2>
                <p>{activeSong.subtitle}</p>

                <div className="personalMusicControls">
                  <button
                    type="button"
                    onClick={togglePlayback}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? "▐▐" : "▶︎"}
                  </button>

                  <button
                    type="button"
                    onClick={playNextSong}
                    aria-label="Next song"
                  >
                    ▶▶
                  </button>
                </div>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={activeSong.src}
              onEnded={playNextSong}
            />
          </div>
        )}

        {activeTab === "playlists" && (
          <div className="personalMusicLinks">
            <h2>Follow my music</h2>
            <a
              href="https://open.spotify.com/user/yanisdjenadi?si=47a51b9a70a048b2"
              target="_blank"
              rel="noreferrer"
            >
              Spotify
            </a>
            <a
              href="https://soundcloud.com/yanis-85868466?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
              target="_blank"
              rel="noreferrer"
            >
              SoundCloud
            </a>
          </div>
        )}

        {activeTab === "miku" && (
          <div className="personalMusicMiku">
            <img src="/wallpaper/soraMusic.jpg" alt="Sora music" />
            <p>Miku corner. More soon.</p>
          </div>
        )}
      </div>

      <div className="personalMusicTabs" aria-label="Personal music sections">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={activeTab === tab ? "activePersonalTab" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </section>
  );
}

export default MyPersonalMusic;
