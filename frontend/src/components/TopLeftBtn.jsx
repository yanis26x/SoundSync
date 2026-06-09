import { useEffect, useState } from "react";
import "./TopLeftBtn.css";

const items = [
  {
    type: "profile",
    href: "https://www.instagram.com/yanis26x",
  },
  {
    type: "logo",
    href: "https://github.com/yanis26x",
  },
  {
    type: "text",
    href: "https://yanis26x.github.io/yanis26x/",
  },
];

function TopLeftBtn() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % items.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <a
      className="topLeftBtn"
      href={activeItem.href}
      target="_blank"
      rel="noreferrer"
    >
      {activeItem.type === "profile" && (
        <>
          <img
            src="/yanis26xPFP.jpg"
            alt="Yanis"
            className="topLeftProfileImg"
          />

          <div className="topLeftProfileText">
            <strong>@yanis26x</strong>
            <span>always open to make new friends!</span>
          </div>
        </>
      )}

      {activeItem.type === "logo" && (
        <span className="topLeftStatement">SoundSync</span>
      )}

      {activeItem.type === "text" && (
        <span className="topLeftStatement">
          yanis26x will rule the world
        </span>
      )}
    </a>
  );
}

export default TopLeftBtn;
