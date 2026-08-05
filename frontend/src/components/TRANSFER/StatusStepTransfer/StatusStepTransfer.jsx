import "./StatusStepTransfer.css";

function PlatformRouteIndicator({ sourcePlatform, destinationPlatform }) {
  const sourceLabel = sourcePlatform?.name || "Source";
  const destinationLabel = destinationPlatform?.name || "Destination";

  return (
    <div
      className="platformRouteIndicator"
      aria-label={`Transfer from ${sourceLabel} to ${destinationLabel}`}
    >
      {sourcePlatform ? (
        <img src={sourcePlatform.logo} alt={sourceLabel} />
      ) : (
        <span className="platformRoutePlaceholder" aria-label="Source not selected">?</span>
      )}
      <span className="platformRouteArrow" aria-hidden="true">→</span>
      {destinationPlatform ? (
        <img src={destinationPlatform.logo} alt={destinationLabel} />
      ) : (
        <span className="platformRoutePlaceholder" aria-label="Destination not selected">?</span>
      )}
    </div>
  );
}

function Step({ onReset }) {
  return (
    <div className="statusStep">
      <button
        type="button"
        className="statusStepResetBtn"
        onClick={onReset}
        aria-label="Reset platform choice"
      >
        ↩
      </button>
    </div>
  );
}

function StatusStepTransfer({
  sourcePlatform,
  destinationPlatform,
  onReset,
  className = "",
}) {
  return (
    <div className={`statusStepTransfer ${className}`.trim()}>
      <PlatformRouteIndicator
        sourcePlatform={sourcePlatform}
        destinationPlatform={destinationPlatform}
      />
      <Step onReset={onReset} />
    </div>
  );
}

export default StatusStepTransfer;
