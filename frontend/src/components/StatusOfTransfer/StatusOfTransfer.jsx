import "./StatusOfTransfer.css";

function PlatformLogo({ platform }) {
  return (
    <img
      className="transferStatusLogo"
      src={platform.logo}
      alt={platform.name}
      title={platform.name}
    />
  );
}

function ResetButton({ onReset, resetLabel }) {
  if (!onReset) return null;

  return (
    <button className="transferStatusReset" type="button" onClick={onReset}>
      {resetLabel}
    </button>
  );
}

function StatusOfTransfer({
  sourcePlatform,
  destinationPlatform,
  onReset,
  resetLabel = "Reset",
}) {
  if (!sourcePlatform) {
    return <div className="transferStatus transferStatusPrompt">Do Step 1</div>;
  }

  if (!destinationPlatform) {
    return (
      <div className="transferStatus transferStatusPending">
        <span className="transferStatusItem">
          <span>Source:</span>
          <PlatformLogo platform={sourcePlatform} />
        </span>
        <span className="transferStatusDivider" aria-hidden="true" />
        <span className="transferStatusDestination">Destination: Do Step 2</span>
        <ResetButton onReset={onReset} resetLabel={resetLabel} />
      </div>
    );
  }

  return (
    <div
      className="transferStatus transferStatusComplete"
      aria-label={`Transfer from ${sourcePlatform.name} to ${destinationPlatform.name}`}
    >
      <PlatformLogo platform={sourcePlatform} />
      <span className="transferStatusArrow" aria-hidden="true">→</span>
      <PlatformLogo platform={destinationPlatform} />
      <ResetButton onReset={onReset} resetLabel={resetLabel} />
    </div>
  );
}

export default StatusOfTransfer;
