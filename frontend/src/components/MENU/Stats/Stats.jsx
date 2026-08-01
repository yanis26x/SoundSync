import "./Stats.css";

const statsLogo = new URL("../../../../ASSETS/IMAGE/SoundSync/logo-SS.png", import.meta.url).href;

function Stats() {
  return (
    <section className="statsCard" aria-label="Stats">
      <img className="statsLogo" src={statsLogo} alt="SoundSync" />
    </section>
  );
}

export default Stats;
