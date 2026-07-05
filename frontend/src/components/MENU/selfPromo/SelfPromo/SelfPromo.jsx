import { useEffect, useRef, useState } from "react";
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

function SelfPromo({ isHidden }) {
  const audioRef = useRef(null);
  const [activeSongIndex, setActiveSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeSong = songs[activeSongIndex];

  useEffect(() => {
    if (isHidden && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isHidden]);

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
    <section className={`selfPromoSection ${isHidden ? "isHidden" : ""}`}>
    {!isHidden ? (
  <div className="personalMusicPanel">
    <div className="personalMusicGrid">
      <a
        className="personalMiniCard"
        href="https://soundcloud.com/yanis-85868466?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
        target="_blank"
        rel="noreferrer"
      >
        <img className="personalMiniCardBg" src="/ichigo/playingGuitars.jpg" alt="" />
        <div>
          <img
            className="personalSoundcloudLogo"
            src="/logo/Soundcloud_logo.svg"
            alt="SoundCloud"
          />
          <span>Follow me on SoundCloud</span>
        </div>
      </a>

      <article className="personalMiniCard musicCard">
        <img
          className="personalMusicCover"
          src={activeSong.cover}
          alt={activeSong.title}
        />

        <div className="personalMusicOverlay">
          <h2>{activeSong.title}</h2>
          <span>{activeSong.subtitle || "SoundSync radio"}</span>

          <div className="personalMusicControls">
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "⏸" : "▶︎"}
            </button>

            <button type="button" onClick={playNextSong}>
              ⏭
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
        <img className="personalMiniCardBg" src="/ichigo/confetti.jpg" alt="" />
        <div>
          <strong>My Website</strong>
          <span>Want sum more?!</span>
        </div>
      </a>

      {/* <a
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
      </a> */}
    </div>
  </div>
) : (
  <div className="selfPromoHiddenLogo">
    <img
      src="/SoundSync/SoundSyncLogoNoBG2.png"
      alt="SoundSync"
    />
  </div>
)}
    </section>
  );
}

export default SelfPromo;
