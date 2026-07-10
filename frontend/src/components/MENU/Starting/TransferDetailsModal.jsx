import "./TransferDetailsModal.css";

const resultGroups = [
  { key: "added", label: "Added" },
  { key: "failed", label: "Failed" },
  { key: "already", label: "Already" },
];

function TransferDetailsModal({ isOpen, onClose, transferResult }) {
  if (!isOpen) return null;

  const hasResult = Boolean(transferResult);

  return (
    <div className="transferDetailsOverlay" role="presentation" onClick={onClose}>
      <section
        className="transferDetailsModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transferDetailsTitle"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="transferDetailsHeader">
          <div>
            <h2 id="transferDetailsTitle">Transfer details</h2>
            <p>{transferResult?.playlistName || "Ready?!"}</p>
          </div>
          <button
            type="button"
            className="transferDetailsClose"
            onClick={onClose}
            aria-label="Close transfer details"
          >
            X
          </button>
        </header>

        <div className="transferDetailsMeta">
          <span>{transferResult?.sourceName || "Source"}</span>
          <span aria-hidden="true">→</span>
          <span>{transferResult?.destinationName || "Destination"}</span>
        </div>

        <div className="transferDetailsGrid">
          {resultGroups.map(({ key, label }) => {
            const tracks = transferResult?.[key] || [];

            return (
              <section className={`transferDetailsGroup ${key}`} key={key}>
                <h3>
                  <span>{label}</span>
                  <strong>{tracks.length}</strong>
                </h3>
                {tracks.length > 0 ? (
                  <ol>
                    {tracks.map((track, index) => (
                      <li key={`${key}-${track}-${index}`}>{track}</li>
                    ))}
                  </ol>
                ) : (
                  <p>{hasResult ? "No tracks" : "No transfer yet"}</p>
                )}
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default TransferDetailsModal;
