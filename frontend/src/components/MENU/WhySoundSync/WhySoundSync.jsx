import "./WhySoundSync.css";

const features = [
  {
    image: "/ichigo/blueSkyHappy.jpg",
    title: "Simple & Fast",
    description: "Simple, fast and secure 2 use.",
  },
  {
    image: "/ichigo/playingGuitars.jpg",
    title: "Transfer Anywhere",
    description: "Move your playlists across all platforms.",
  },
  {
    image: "/ichigo/happy.jpg",
    title: "100% Free",
    description: "Free forever. Just sync your playlists n' enjoy!",
  },
  {
    image: "/ichigo/hug2.jpg",
    title: "4 Music Lovers",
    description: "Made while listening 2 confetti!!",
  },
];

function WhySoundSync({ text }) {
  return (
    <section className="homeInfoBanner">
      <div className="homeInfoBannerContent">
        <div className="homeInfoHeader">
          <h2>Why SoundSync?!</h2>
          <p>{text}</p>
        </div>

        <div className="homeInfoFeatureGrid">
          {features.map((feature) => (
            <article className="homeInfoFeatureCard" key={feature.title}>
              <img src={feature.image} alt="" />
              <div>
                <strong>{feature.title}</strong>
                <span>{feature.description}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhySoundSync;
