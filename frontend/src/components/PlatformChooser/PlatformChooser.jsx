import "./PlatformChooser.css";

function PlatformChooser({
  chooseText,
  platformOrder,
  accessToken,
  youtubeAccessToken,
  appleMusicUserToken,
  loggedLabel,
  onAddPlatform,
  onLoginSpotify,
  onLoginYoutube,
  onLoginAppleMusic,
  onResetPlatformChoice,
  resetLabel = "Reset",
}) {
  return (
    <section className="choosePanel">
      <button
        type="button"
        className="platformResetBtn"
        onClick={onResetPlatformChoice}
        disabled={platformOrder.length === 0}
      >
        {resetLabel}
      </button>

      <div className="chooseHeader">
        {/* <p className="chooseEyebrow">Platform select</p> */}
        <h2 className="chooseText">{chooseText}</h2>
      </div>

      <div className="platformLoginRow">
        <button
          className={`spotifyBtn platformChoiceBtn${platformOrder.includes("spotify") ? " selectedPlatformBtn" : ""}`}
          onClick={accessToken ? () => onAddPlatform("spotify") : onLoginSpotify}
          disabled={platformOrder.includes("spotify")}
        >
          {accessToken && <span className="loggedBadge">{loggedLabel}</span>}
          <img src="/logo/Spotify-Black-Logo.png" alt="Spotify" className="spotifyBigLogo" />
        </button>

        <button
          className={`youtubeBtn platformChoiceBtn${platformOrder.includes("youtube") ? " selectedPlatformBtn" : ""}`}
          onClick={youtubeAccessToken ? () => onAddPlatform("youtube") : onLoginYoutube}
          disabled={platformOrder.includes("youtube")}
        >
          {youtubeAccessToken && <span className="loggedBadge">{loggedLabel}</span>}
          <img src="/logo/YouTube-Logo.svg" alt="YouTube" className="youtubeBigLogo" />
        </button>

        <button
          className={`appleBtn platformChoiceBtn${platformOrder.includes("apple") ? " selectedPlatformBtn" : ""}`}
          onClick={appleMusicUserToken ? () => onAddPlatform("apple") : onLoginAppleMusic}
          disabled={platformOrder.includes("apple")}
        >
          {appleMusicUserToken && <span className="loggedBadge">{loggedLabel}</span>}
          <img src="/logo/appleMusic.png" alt="Apple Music" className="appleMusicLogo" />
        </button>
      </div>

            <p className="how2Disconnect">
 2 Disconnect or switch your account from a platform, go to Profil!
</p>

      <p className="platformComingSoon">
 More platforms are coming soon — SoundCloud, Deezer, TIDAL and
  more. Be Patient!
</p>


    </section>
  );
}

export default PlatformChooser;
