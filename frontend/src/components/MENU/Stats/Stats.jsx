import "./Stats.css";

const statsLogo = new URL("../../../../ASSETS/IMAGE/ichigo/eyesContact.jpg", import.meta.url).href;
const transferDoneImage = new URL("../../../../ASSETS/IMAGE/ichigo/blueSkyHappy.jpg", import.meta.url).href;

function Stats({ hasTransferResult }) {
  const image = hasTransferResult ? transferDoneImage : statsLogo;
  const title = hasTransferResult ? "Transfer Done!" : "Ready 2 Sync?!";
  const description = hasTransferResult
    ? '4 more info about your transfer, click on "+ DETAILS" in the menu, or start a new one.'
    : "want sum more? @yanis26x ";

  return (
    <section className="statsCard homeInfoFeatureCard homeInfoFeatureCardSwap is-disabledLink" aria-label="Stats">
      <img className="statsLogo" src={image} alt="SoundSync" />
      <div className="statsCardText">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </section>
  );
}

export default Stats;
