import "./EmptyPanel.css";

function EmptyPanel({
  sourcePlatform,
  destinationPlatform,
  selectedPlatformsCount,
  resetLabel,
  disconnectHint,
  onReset,
}) {
  return (
    <section className="emptyPanel">
      <div className="emptyDivaButtons" aria-hidden="true">
        <span>X</span>
        <span>O</span>
        <span>×</span>
        <span>□</span>
      </div>

      <h2 className="emptyPanelTitle">Keep your playlists alive</h2>

      <div className="emptyPanelWave" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, index) => (
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