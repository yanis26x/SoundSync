import "./PlatformChooser.css";

function PlatformChooser({
  chooseText,
  platformOrder,
  accessToken,
  youtubeAccessToken,
  appleMusicUserToken,
  onAddPlatform,
  onLoginSpotify,
  onLoginYoutube,
  onLoginAppleMusic,
}) {
  return (
    <section className="choosePanel">
      <div className="chooseHeader">
        {/* <p className="chooseEyebrow">Source platform</p> */}

        <h2 className="chooseText">{chooseText}</h2>

        <p className="chooseSubText">
          Choose your main music platform to get started.
        </p>
      </div>

      <div className="platformLoginRow">
        <button
          className={`spotifyBtn platformChoiceBtn${platformOrder.includes("spotify") ? " selectedPlatformBtn" : ""}`}
          onClick={accessToken ? () => onAddPlatform("spotify") : onLoginSpotify}
          disabled={platformOrder.includes("spotify")}
        >
          <img src="/logo/Spotify-Black-Logo.png" alt="Spotify" className="spotifyBigLogo" />
        </button>

        <button
          className={`youtubeBtn platformChoiceBtn${platformOrder.includes("youtube") ? " selectedPlatformBtn" : ""}`}
          onClick={youtubeAccessToken ? () => onAddPlatform("youtube") : onLoginYoutube}
          disabled={platformOrder.includes("youtube")}
        >
          <img src="/logo/ytb-mini.png" alt="YouTube" className="youtubeBigLogo" />
        </button>

        <button
          className={`appleBtn platformChoiceBtn${platformOrder.includes("apple") ? " selectedPlatformBtn" : ""}`}
          onClick={appleMusicUserToken ? () => onAddPlatform("apple") : onLoginAppleMusic}
          disabled={platformOrder.includes("apple")}
        >
          <img src="/logo/appleMusic.png" alt="Apple Music" className="appleMusicLogo" />
        </button>
      </div>

      <p className="how2Disconnect">
       2 Disconnect or switch your account from a platform, go to Profil !
      </p>
      <p className="platformComingSoon">
        More platforms are coming soon — SoundCloud, Deezer, TIDAL and more.
      </p>
    </section>
  );
}

export default PlatformChooser;
