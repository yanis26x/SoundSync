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

function MyPersonalMusic() {
  const audioRef = useRef(null);
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
      <div className="personalMusicGrid">
        <article className="personalMiniCard musicCard">
          <img
            className="personalMusicCover"
            src={activeSong.cover}
            alt={activeSong.title}
          />

          <div className="personalMusicOverlay">
            <p>Now playing</p>
            <h2>{activeSong.title}</h2>
            <span>{activeSong.subtitle || "SoundSync radio"}</span>

            <div className="personalMusicControls">
              <button
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "▐▐" : "▶"}
              </button>

              <button type="button" onClick={playNextSong} aria-label="Next song">
                ▶▶
              </button>
            </div>
          </div>

          <audio ref={audioRef} src={activeSong.src} onEnded={playNextSong} />
        </article>

        <a
          className="personalMiniCard"
          href="https://open.spotify.com/user/yanisdjenadi?si=47a51b9a70a048b2"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/ichigo/ok.jpg" alt="" />
          <div>
            <strong>Spotify</strong>
            <span>Follow my playlists.</span>
          </div>
        </a>

        <a
          className="personalMiniCard"
          href="https://soundcloud.com/yanis-85868466?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/ichigo/club18.jpg" alt="" />
          <div>
            <strong>SoundCloud</strong>
            <span>Listen to my tracks.</span>
          </div>
        </a>

        <a
          className="personalMiniCard"
          href="https://yanis26x.github.io/yanis26x/"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/ichigo/happy.jpg" alt="" />
          <div>
            <strong>Website</strong>
            <span>Want sum more?!</span>
          </div>
        </a>
      </div>
    </section>
  );
}

export default MyPersonalMusic;