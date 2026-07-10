import { useEffect, useRef, useState } from "react";
import "./MusicPlayerMenu.css";

const tracks = [
  {
    title: "Milshake Confetti",
    src: new URL("../../../../SOUND/music/milshake-confetti.mp3", import.meta.url).href,
    image: new URL("../../../../IMAGE/ichigo/confetti.jpg", import.meta.url).href,
  },
  {
    title: "Hehe Swamp",
    src: new URL("../../../../SOUND/music/hehe-swamp.mp3", import.meta.url).href,
    image: new URL("../../../../IMAGE/wallpaper/soraMusic.jpg", import.meta.url).href,
  },
];

function MusicPlayerMenu() {
  const audioRef = useRef(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTrack = tracks[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [trackIndex, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  const playNext = () => {
    setTrackIndex((currentIndex) => (currentIndex + 1) % tracks.length);
    setIsPlaying(true);
  };

  return (
    <section className="musicPlayerMenuSection" aria-label="Music player">
      <h2>Music Player♫</h2>

      <article className="musicPlayerCard">
        <img
          className="musicPlayerCover"
          src={currentTrack.image}
          alt=""
          aria-hidden="true"
        />

        <div className="musicPlayerInfo">
          <span className="musicPlayerEyebrow">Now playing</span>
          <strong>{currentTrack.title}</strong>
        </div>

        <div className="musicPlayerControls">
          <button
            type="button"
            className="musicPlayerBtn"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button
            type="button"
            className="musicPlayerBtn"
            onClick={playNext}
            aria-label="Next song"
          >
            Next
          </button>
        </div>

        <audio ref={audioRef} src={currentTrack.src} onEnded={playNext} />
      </article>
    </section>
  );
}

export default MusicPlayerMenu;
