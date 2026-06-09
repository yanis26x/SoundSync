import { useEffect, useState } from "react";
import "./WhySoundSync.css";

const slides = ["text", "logo", "text", "logoNoBg"];

function WhySoundSync() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="whySoundSync">
      {activeSlide === "text" && (
        <div className="whySoundSyncText">
          <h2>Why SoundSync ?</h2>
          <p>
            SoundSync exists because music should not feel locked to one
            platform. I'm having withdrawals, I feel uneasy 𖤐 Skittles got me feeling tranquil, they're so relieving
          </p>
        </div>
      )}

      {activeSlide === "logo" && (
        <img
          className="whySoundSyncLogo"
          src="/SoundSyncLogo.png"
          alt="SoundSync"
        />
      )}

      {activeSlide === "logoNoBg" && (
        <img
          className="whySoundSyncLogo noBg"
          src="/SoundSyncLogoNoBG.png"
          alt="SoundSync"
        />
      )}
    </section>
  );
}

export default WhySoundSync;
