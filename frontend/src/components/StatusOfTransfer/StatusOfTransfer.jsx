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

function StatusOfTransfer({ sourcePlatform, destinationPlatform }) {
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
    </div>
  );
}

export default StatusOfTransfer;
