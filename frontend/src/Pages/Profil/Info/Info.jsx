import "./Info.css";

const infoCards = [
  {
    title: "Built for playlist chaos",
    text: "SoundSync keeps your playlists moving between Spotify, YouTube Music, Apple Music, and more without forcing you to rebuild everything by hand.",
    image: "/SoundSync/SoundSyncLogo.png",
    className: "soundSyncInfoLogo",
  },

  {
    title: "From Spotify2YTB to SoundSync",
    text: "About a year ago, I built a small project called Spotify2YTB. It could transfer playlists from Spotify to YouTube, but the code was messy, slow, and honestly... pretty terrible. I abandoned it for almost a year. Then I came back, deleted everything, started from scratch, redesigned the whole experience, and built what eventually became SoundSync.",
    image: "/SoundSync/SoundSyncLogo.png",
    className: "soundSyncInfoLogo",
  },

  {
    title: "Watch the first prototype",
    text: "Curious about where SoundSync started? Here's a demo of the old Spotify2YTB project before I rebuilt everything from scratch: https://youtu.be/sBKze5G8eKU",
    image: "/SoundSync/SoundSyncLogo.png",
    className: "soundSyncInfoLogo",
  },

  {
    title: "Made by @yanis26x",
    text: "I'm Yanis, a 20-year-old developer from Montreal who loves building weird, fun, and useful apps. SoundSync is one of many personal projects I've made, alongside websites, mobile apps, and other experiments. If you like this project, feel free to check out my other work and say hi on social media.",
    image: "/utils/yanis26xPFP2.jpg",
    className: "creatorInfoImage",
  },

  {
    title: "Do it with Miku",
    text: "Miku guides you through every step of the syncing process. I wrote dozens of different voice lines so she doesn't keep repeating the same thing. The goal was to make it feel like she's actually talking to you instead of sounding like a boring assistant.",
    image: "/utils/miku-onion.webp",
    className: "mikuInfoImage",
  },

  {
    title: "No subscriptions. No premium.",
    text: "SoundSync is designed to stay simple. No subscriptions, no paywalls, and no 'upgrade to continue' messages. Just connect your accounts, choose your playlist, and sync.",
    image: "/SoundSync/SoundSyncLogo.png",
    className: "soundSyncInfoLogo",
  },

  {
    title: "More platforms are coming",
    text: "Spotify, Apple Music, YouTube Music, SoundCloud, Deezer... SoundSync will continue growing over time. Every new platform means more freedom for your playlists.",
    image: "/SoundSync/SoundSyncLogo.png",
    className: "soundSyncInfoLogo",
  },
];

function Info() {
  return (
    <section className="profilInfoSection" aria-labelledby="profilInfoTitle">
      <div className="profilInfoHeader">
        <span>Info</span>
        <h2 id="profilInfoTitle">About SoundSync</h2>
      </div>

      <div className="profilInfoGrid">
        {infoCards.map((card) => (
          <article className="profilInfoCard" key={card.title}>
            <div className="profilInfoImageBox">
              <img src={card.image} alt="" className={card.className} />
            </div>

            <div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Info;
