import { useEffect, useState } from "react";
import "./TopLeftBtn.css";

const messages = [
  {
    href: "https://www.instagram.com/yanis26x",
    image: "/yanis26xPFP.jpg",
    title: "@yanis26x",
    subtitle: "",
  },
  {
    href: "https://yanis26x.github.io/yanis26x/",
    image: "/img/yanis26xPFP2.jpg",
    title: "Want sum more?!",
    subtitle: "visit my website",
  },
];

function TopLeftBtn() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  const activeMessage = messages[activeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIsLeaving(true);

      setTimeout(() => {
        setActiveIndex((currentIndex) => (currentIndex + 1) % messages.length);
        setIsLeaving(false);
      }, 450);
    }, 8000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <a
      className={`topLeftBtn ${isLeaving ? "leaving" : "entering"}`}
      href={activeMessage.href}
      target="_blank"
      rel="noreferrer"
    >
      <div className="profileWrapper">
        <img
          src={activeMessage.image}
          alt={activeMessage.title}
          className="topLeftProfileImg"
        />

        <span className="onlineIndicator"></span>
      </div>

      <div className="topLeftProfileText">
        <strong>{activeMessage.title}</strong>
        <span>{activeMessage.subtitle}</span>
      </div>
    </a>
  );
}

export default TopLeftBtn;