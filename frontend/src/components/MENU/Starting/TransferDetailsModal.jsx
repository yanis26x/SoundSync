import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./TransferDetailsModal.css";

const emptyDetailsAvatar = new URL("../../../../ASSETS/IMAGE/utils/vampire.jpeg", import.meta.url).href;
const successDetailsBackground = new URL("../../../../ASSETS/IMAGE/ichigo/blueSkyHappy.jpg", import.meta.url).href;

const resultGroups = [
  { key: "added", label: "Added" },
  { key: "failed", label: "Failed" },
  { key: "already", label: "Already" },
];

function TransferDetailsModal({ isOpen, onClose, transferResult }) {
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef(null);

  useEffect(() => () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
  }, []);

  if (!isOpen) return null;

  const hasResult = Boolean(transferResult);
  const overlayClassName = `transferDetailsOverlay${isClosing ? " isClosing" : ""}`;
  const addedCount = transferResult?.added?.length || 0;
  const failedCount = transferResult?.failed?.length || 0;
  const isPositiveResult = addedCount > failedCount;
  const resultMessage = isPositiveResult ? "succes! it work good !" : "ughhh.....";
  const modalClassName = `transferDetailsModal ${isPositiveResult ? "isPositiveResult" : "isNegativeResult"}`;

  const closeWithAnimation = () => {
    if (isClosing) return;
    setIsClosing(true);

    closeTimeoutRef.current = window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 280);
  };

  if (!hasResult) {
    return createPortal(
      <div className={overlayClassName} role="presentation" onClick={closeWithAnimation}>
        <section
          className="transferDetailsModal transferDetailsEmptyModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="transferDetailsTitle"
          onClick={(event) => event.stopPropagation()}
        >
          <img
            className="transferDetailsEmptyAvatar"
            src={emptyDetailsAvatar}
            alt=""
            aria-hidden="true"
          />
          <div className="transferDetailsEmptyText">
            <h2 id="transferDetailsTitle">Are u stupid?!</h2>
            <p>bc it realy seems like you are, you have to start a transfer first... else there's nothing to see here...</p>
          </div>
          <button
            type="button"
            className="transferDetailsClose"
            onClick={closeWithAnimation}
            aria-label="Close transfer details"
          >
            X
          </button>
        </section>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className={overlayClassName} role="presentation" onClick={closeWithAnimation}>
      <section
        className={modalClassName}
        style={isPositiveResult ? { "--transfer-details-bg": `url(${successDetailsBackground})` } : undefined}
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
            onClick={closeWithAnimation}
            aria-label="Close transfer details"
          >
            X
          </button>
        </header>

        <p className="transferDetailsResultMessage">{resultMessage}</p>

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
    </div>,
    document.body
  );
}

export default TransferDetailsModal;
