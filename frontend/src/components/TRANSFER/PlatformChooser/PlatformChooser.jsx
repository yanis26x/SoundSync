import "./PlatformChooser.css";

const platforms = [
  {
    id: "spotify",
    name: "Spotify",
    logo: "/IMAGE/logo/Spotify-Black-Logo.png",
    logoClassName: "spotifyBigLogo",
    isAvailable: true,
  },
  {
    id: "youtube",
    name: "YouTube",
    logo: "/IMAGE/logo/YouTube-Logo.svg",
    logoClassName: "youtubeBigLogo",
    isAvailable: true,
  },
  {
    id: "apple",
    name: "Apple Music",
    logo: "/IMAGE/logo/appleMusic.png",
    logoClassName: "appleMusicLogo",
    isAvailable: true,
  },
  {
    id: "soundcloud",
    name: "SoundCloud",
    logo: "/IMAGE/logo/Soundcloud_logo.svg",
    logoClassName: "soundCloudLogo",
    isAvailable: false,
  },
  {
    id: "simulation",
    name: "SpotiTube",
    logo: "/IMAGE/logo/mini/SpotiTube.webp",
    logoClassName: "simulationLogo",
    isAvailable: true,
    isSimulation: true,
  },
  {
    id: "fake",
    name: "Fake 1",
    logo: "/IMAGE/logo/mini/Fake.png",
    logoClassName: "fakeTrackLogo",
    isAvailable: true,
    isSimulation: true,
  },
  {
    id: "fake2",
    name: "Fake 2",
    logo: "/IMAGE/logo/mini/Fake2.png",
    logoClassName: "fakeTrackLogo",
    isAvailable: true,
    isSimulation: true,
  },
];

function PlatformChooser({
  chooseText,
  chooseSubText,
  platformOrder,
  accessToken,
  youtubeAccessToken,
  appleMusicUserToken,
  onAddPlatform,
  onLoginSpotify,
  onLoginYoutube,
  onLoginAppleMusic,
  onStartSimulation,
}) {
  const platformActions = {
    spotify: accessToken ? () => onAddPlatform("spotify") : onLoginSpotify,
    youtube: youtubeAccessToken ? () => onAddPlatform("youtube") : onLoginYoutube,
    apple: appleMusicUserToken ? () => onAddPlatform("apple") : onLoginAppleMusic,
    fake: () => onAddPlatform("fake"),
    fake2: () => onAddPlatform("fake2"),
    simulation: onStartSimulation,
  };

  return (
    <section className="choosePanel">
      <div className="chooseHeader">
        {/* <p className="chooseEyebrow">Source platform</p> */}

        <h2 className="chooseText" key={`choose-title-${chooseText}`}>{chooseText}</h2>

        <p className="chooseSubText" key={`choose-subtitle-${chooseSubText}`}>{chooseSubText}</p>
      </div>

      <div className="platformLoginRow">
        {platforms.map((platform) => {
          const isSelected = platformOrder.includes(platform.id);
          const isDisabled = isSelected || !platform.isAvailable;
          const statusText = platform.isSimulation
            ? "Demo mode"
            : !platform.isAvailable
              ? "Coming soon"
              : isSelected
                ? "Selected"
                : "Available";

          return (
            <button
              type="button"
              className={`platformChoiceBtn ${platform.id}Btn${isSelected ? " selectedPlatformBtn" : ""}${!platform.isAvailable ? " unavailablePlatformBtn" : ""}`}
              onClick={platformActions[platform.id]}
              disabled={isDisabled}
              key={platform.id}
            >
              <span className="platformChoiceGlow" aria-hidden="true" />
              <img src={platform.logo} alt={platform.name} className={platform.logoClassName} />
              <span className="platformChoiceMeta">
                <strong>{platform.name}</strong>
                <span>{statusText}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="how2Disconnect">
       2 Disconnect or switch your account from a platform, go 2 Profil.
      </p>


      <div className="platformDemoHelp">
        <p>Having trouble?! Check out the Demo video of SoundSync</p>
        <a className="platformDemoBtn"
          href="https://bakerskateboards.com/collections/all-boards/products/brand-logo-black-white-deck"
          target="_blank"
          rel="noreferrer">
            Watch demo video</a>
      </div>      
    </section>
  );
}

export default PlatformChooser;
