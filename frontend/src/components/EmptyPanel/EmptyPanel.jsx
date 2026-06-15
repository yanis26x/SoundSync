import { useEffect, useState } from "react";
import "./EmptyPanel.css";

const wavePhrases = [
  "Money—money, I gotta have it, its so intriguing",
  "Guap gives me satisfaction, it just completes me",
  "Money—money, I keep it 'round me, I'm very clingy",
  "Mantr—mantras, I'm chanting mantras, praying to watch me",
  "@yanis26x",
];

function EmptyPanel({
  selectedPlatformsCount,
  resetLabel,
  disconnectHint,
  onReset,
}) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setPhraseIndex((currentIndex) => (currentIndex + 1) % wavePhrases.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="emptyPanel">
      <h2 className="emptyPanelTitle">huh..?</h2>

      <div className="wavePhrase" key={phraseIndex}>
        {wavePhrases[phraseIndex]}
      </div>

      <div className="emptyPanelWave" aria-hidden="true">
        {Array.from({ length: 42 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="emptyPanelFooter">
        <p>{disconnectHint}</p>

        {selectedPlatformsCount > 0 && (
          <button className="changePlatformBtn secondaryBtn" onClick={onReset}>
            {resetLabel}
          </button>
        )}
      </div>
    </section>
  );
}

export default EmptyPanel;