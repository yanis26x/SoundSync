import { useEffect, useState } from "react";
import "./WhySoundSync.css";

const features = [
  {
    image: "/ichigo/blueSkyHappy.jpg",
    title: "Simple & Fast",
    description: "Simple, fast and secure 2 use.",
    link: "",
        alternate: {
      image: "/wallpaper/soraMusic.jpg",
      title: "Want sum more?!",
      description: "Visit my Bl00dy website 4 more!",
      link: "https://yanis26x.github.io/yanis26x/",
    },
  },
  {
    image: "/ichigo/playingGuitars.jpg",
    title: "Transfer Anywhere",
    description: "Move your playlists across all platforms.",
    link: "",
    alternate: {
      image: "/wallpaper/eyesContact.jpg",
      title: "Let's be friends!!",
      description: "If you want 2 contact me, add me on ig @yanis26x.",
      link: "https://www.instagram.com/yanis26x/",
    },
  },
  {
    image: "/ichigo/happy.jpg",
    title: "100% Free",
    description: "Free forever. Just sync your playlists n' enjoy!",
    link: "",
        alternate: {
      image: "/ichigo/bigSmiles.jpeg",
      title: "Having withdrawal",
      description: "Pick, sync, and keep the music moving. ",
      link: "",
    },
  },
  {
    image: "/ichigo/hug2.jpg",
    title: "4 Music Lovers",
    description: "Made while listening 2 confetti!!",
    link: "",
        alternate: {
      image: "/ichigo/inClassHappy.jpg",
      title: "4 Everyone",
      description: "meant 2 be used by everyone easly.",
      link: "",
    },
  },
];

function WhySoundSync({ text }) {
  const [showAlternateFeatures, setShowAlternateFeatures] = useState(false);
  const [areFeaturesChanging, setAreFeaturesChanging] = useState(false);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  useEffect(() => {
    let contentTimer;
    let entryTimer;

    const swapInterval = window.setInterval(() => {
      setAreFeaturesChanging(true);

      contentTimer = window.setTimeout(() => {
        setShowAlternateFeatures((currentValue) => !currentValue);
        setAreFeaturesChanging(false);
        setHasAnimatedIn(true);

        entryTimer = window.setTimeout(() => {
          setHasAnimatedIn(false);
        }, 560);
      }, 340);
    }, 10000);

    return () => {
      window.clearInterval(swapInterval);
      window.clearTimeout(contentTimer);
      window.clearTimeout(entryTimer);
    };
  }, []);

  const visibleFeatures = features.map((feature) => {
    if (showAlternateFeatures) {
      return {
        ...feature.alternate,
        isAlternate: true,
        originalTitle: feature.title,
      };
    }

    return {
      ...feature,
      isAlternate: false,
      originalTitle: feature.title,
    };
  });

  return (
    <section className="homeInfoBanner">
      <div className="homeInfoBannerContent">
        <div className="homeInfoHeader">
          <h2>Why SoundSync?!</h2>
          <p>{text}</p>

        </div>

        <div className="homeInfoFeatureGrid">
          {visibleFeatures.map((feature) => (
            <a
              className={`homeInfoFeatureCard homeInfoFeatureCardSwap${areFeaturesChanging ? " is-changing" : ""}${hasAnimatedIn ? " is-entering" : ""}${feature.isAlternate ? " is-alternate" : ""}${feature.link ? "" : " is-disabledLink"}`}
              href={feature.link || undefined}
              target={feature.link ? "_blank" : undefined}
              rel={feature.link ? "noreferrer" : undefined}
              aria-label={feature.link ? `Open ${feature.title}` : undefined}
              key={feature.originalTitle}
            >
              <img src={feature.image} alt="" />
              <div>
                <strong>{feature.title}</strong>
                <span>{feature.description}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhySoundSync;
