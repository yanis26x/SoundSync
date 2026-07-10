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
      <span aria-hidden="true">→</span>
      {destinationPlatform ? (
        <img src={destinationPlatform.logo} alt={destinationLabel} />
      ) : (
        <span className="platformRoutePlaceholder" aria-label="Destination not selected">?</span>
      )}
    </div>
  );
}

function Step({ currentStep, onReset }) {
  return (
    <div className="statusStep">
      <span className="statusStepText">{currentStep}/5</span>
      <button type="button" className="statusStepResetBtn" onClick={onReset}>
        
      ↩
     
      </button>
    </div>
  );
}

function StatusStepTransfer({
  sourcePlatform,
  destinationPlatform,
  currentStep,
  onReset,
  className = "",
}) {
  return (
    <div className={`statusStepTransfer ${className}`.trim()}>
      <PlatformRouteIndicator
        sourcePlatform={sourcePlatform}
        destinationPlatform={destinationPlatform}
      />
      <Step currentStep={currentStep} onReset={onReset} />
    </div>
  );
}

export default StatusStepTransfer;
