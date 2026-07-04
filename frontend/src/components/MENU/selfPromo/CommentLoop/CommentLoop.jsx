import { useEffect, useState } from "react";
import "./CommentLoop.css";

const messages = [
    {
    image: "/SoundSync/SoundSyncLogoNoBG.png",
    title: "SoundSync",
    type: "logo",
  },
  {
    href: "https://www.instagram.com/yanis26x",
    image: "/utils/yanis26xPFP.jpg",
    title: "@yanis26x",
    subtitle: "",
  },
  {
    href: "https://yanis26x.github.io/yanis26x/",
    image: "/utils/yanis26xPFP2.jpg",
    title: "Want sum more?!",
    subtitle: "visit my website",
  },

];

function CommentLoop() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const activeMessage = messages[activeIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIsLeaving(true);

      window.setTimeout(() => {
        setActiveIndex((currentIndex) => (currentIndex + 1) % messages.length);
        setIsLeaving(false);
      }, 450);
    }, 8000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      className={`commentLoopPanel ${
        activeMessage.type === "logo" ? "logoMode" : ""
      } ${isLeaving ? "leaving" : "entering"}`}
      aria-label="Profile links"
    >
      {activeMessage.type === "logo" ? (
        <div
          className={`commentProfileCard commentLogoCard ${
            isLeaving ? "leaving" : "entering"
          }`}
          key={activeMessage.title}
        >
          <img
            src={activeMessage.image}
            alt={activeMessage.title}
            className="commentLogoImg"
          />
        </div>
      ) : (
        <a
          className={`commentProfileCard ${isLeaving ? "leaving" : "entering"}`}
          href={activeMessage.href}
          target="_blank"
          rel="noreferrer"
          key={activeMessage.title}
        >
          <div className="commentProfileWrapper">
            <img
              src={activeMessage.image}
              alt={activeMessage.title}
              className="commentProfileImg"
            />

            <span className="commentOnlineIndicator"></span>
          </div>

          <div className="commentProfileText">
            <strong>{activeMessage.title}</strong>
            <span>{activeMessage.subtitle}</span>
          </div>
        </a>
      )}
    </section>
  );
}

export default CommentLoop;
