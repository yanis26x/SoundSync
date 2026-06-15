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
      <h2 className="emptyPanelTitle">Keep your playlists alive</h2>

      <div className="emptyPanelWave" aria-hidden="true">
        {Array.from({ length: 33 }).map((_, index) => (
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