import { useRef, useState } from "react";
import "./SelfPromo.css";

const songs = [
  {
    title: "Strawberry Milkshake",
    subtitle: "canonconfetti",
    src: new URL("../../../../../SOUND/music/milshake-confetti.mp3", import.meta.url).href,
    cover: "/ichigo/2girlsStudy.jpg",
  },
  {
    title: "laugh",
    subtitle: "",
    src: new URL("../../../../../SOUND/music/hehe-swamp.mp3", import.meta.url).href,
    cover: "/utils/vampire.jpeg",
  },
];

function SelfPromo() {
  const audioRef = useRef(null);
  const [activeSongIndex, setActiveSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
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

  const toggleSection = () => {
    if (!isHidden && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setIsHidden((currentValue) => !currentValue);
  };

  return (
    <section className={`selfPromoSection ${isHidden ? "isHidden" : ""}`}>
      <div className="selfPromoHeader">
        {/* <h2>My selfPromo</h2> */}
        <button type="button" onClick={toggleSection}>
          {isHidden ? "Show Selfpromo" : "Hide Selfpromo"}
        </button>
      </div>

      {!isHidden && (
        <div className="personalMusicPanel">
          <div className="personalMusicGrid">
            <a
              className="personalMiniCard"
              href="https://soundcloud.com/yanis-85868466?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/ichigo/playingGuitars.jpg" alt="" />
              <div>
                <strong>SoundCloud</strong>
                <span>Listen to my tracks.</span>
              </div>
            </a>

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
                    {isPlaying ? "||" : ">"}
                  </button>

                  <button type="button" onClick={playNextSong} aria-label="Next song">
                    {">>"}
                  </button>
                </div>
              </div>

              <audio ref={audioRef} src={activeSong.src} onEnded={playNextSong} />
            </article>

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

            <a
              className="personalMiniCard"
              href="https://open.spotify.com/user/yanisdjenadi?si=47a51b9a70a048b2"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/ichigo/confetti.jpg" alt="" />
              <div>
                <strong>Spotify</strong>
                <span>Follow my playlists.</span>
              </div>
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

export default SelfPromo;
