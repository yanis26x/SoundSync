import { useState } from "react";
import { createPortal } from "react-dom";
import "./InfoCard.css";

const staticInfoCards = [
  {
    // image: "/SoundSync/SoundSyncLogoNoBG.png",
    // image: "/utils/yanis26xPFP2.jpg",
    image: "/SoundSync/SoundSyncLogo.png",
    title: "MORE SOON",
    description: "okay?!",
  },
];

const getCount = (items) => (Array.isArray(items) ? items.length : 0);

const getFallbackTrackLabel = (track) => {
  if (typeof track === "string") return track;
  if (track?.track?.name) return track.track.name;
  if (track?.attributes?.name) return track.attributes.name;
  if (track?.snippet?.title) return track.snippet.title;
  return "Untitled track";
};

function InfoCard({
  text,
  transferStarted,
  transferLoading,
  transferStatus,
  transferResult,
  transferError,
  sourcePlatform,
  destinationPlatform,
  selectedSourcePlaylist,
  selectedSourceTracks = [],
  selectedSourceTracksLoading,
  selectedSourceTracksError,
  getPlaylistName,
  getTrackLabel,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasResult = Boolean(transferResult);
  const hasActiveTransfer = transferStarted || transferLoading;

  if (!hasActiveTransfer) {
    return null;
  }

  const hasActivity = hasActiveTransfer || hasResult || transferError;
  const playlistName =
    sourcePlatform && selectedSourcePlaylist && getPlaylistName
      ? getPlaylistName(sourcePlatform.id, selectedSourcePlaylist)
      : hasResult
        ? "Last playlist"
        : "No transfer yet";
  const sourceName = sourcePlatform?.name || "Source";
  const destinationName = destinationPlatform?.name || "Destination";
  const addedTracks = transferResult?.added || [];
  const failedTracks = transferResult?.failed || [];
  const alreadyTracks = transferResult?.already || [];
  const queuedTracks = selectedSourceTracks.map((track) =>
    sourcePlatform && getTrackLabel
      ? getTrackLabel(sourcePlatform.id, track)
      : getFallbackTrackLabel(track)
  );
  const liveTracks = hasResult
    ? addedTracks
    : queuedTracks;
  const tickerItems = [
    transferLoading
      ? transferStatus || text?.transferLoading || "Transfer in progress..."
      : hasResult
        ? `${getCount(addedTracks)} added · ${getCount(failedTracks)} failed · ${getCount(alreadyTracks)} already`
        : hasActivity
          ? "Transfer activity ready."
          : "Start a transfer to see activity here.",
    selectedSourceTracksLoading ? "Loading playlist tracks..." : "",
    selectedSourceTracksError ? `Track error: ${selectedSourceTracksError}` : "",
    transferError ? `Error: ${transferError}` : "",
    ...liveTracks.slice(0, 8),
  ].filter(Boolean);
  const modal = (
    <div className="infoCardModalBackdrop" role="presentation">
      <section
        className="infoCardModal"
        role="dialog"
        aria-modal="true"
        aria-label="Transfer details"
      >
        <button
          type="button"
          className="infoCardModalClose"
          onClick={() => setIsModalOpen(false)}
          aria-label="Close transfer details"
        >
          ×
        </button>

        <header className="infoCardModalHeader">
          <p>{transferLoading ? "Transfer running" : hasResult ? "Last transfer" : "Activity details"}</p>
          <h2>{playlistName}</h2>
          <span>{sourceName} → {destinationName}</span>
        </header>

        <div className="infoCardModalStats">
          <span>{getCount(addedTracks)} added</span>
          <span>{getCount(failedTracks)} failed</span>
          <span>{getCount(alreadyTracks)} already there</span>
        </div>

        {(transferStatus || transferError || selectedSourceTracksError) && (
          <div className="infoCardModalNotice">
            {transferStatus && <p>{transferStatus}</p>}
            {transferError && <p>{transferError}</p>}
            {selectedSourceTracksError && <p>{selectedSourceTracksError}</p>}
          </div>
        )}

        <div className="infoCardModalLists">
          <section>
            <h3>{hasResult ? "Added tracks" : "Tracks in playlist"}</h3>
            <ol>
              {(hasResult ? addedTracks : queuedTracks).map((track, index) => (
                <li key={`info-modal-added-${track}-${index}`}>{track}</li>
              ))}
              {!hasResult && queuedTracks.length === 0 && <li>No tracks loaded yet.</li>}
              {hasResult && addedTracks.length === 0 && <li>No added tracks.</li>}
            </ol>
          </section>

          <section>
            <h3>Failed</h3>
            <ol>
              {failedTracks.map((track, index) => (
                <li key={`info-modal-failed-${track}-${index}`}>{track}</li>
              ))}
              {failedTracks.length === 0 && <li>No failed tracks.</li>}
            </ol>
          </section>

          <section>
            <h3>Already there</h3>
            <ol>
              {alreadyTracks.map((track, index) => (
                <li key={`info-modal-already-${track}-${index}`}>{track}</li>
              ))}
              {alreadyTracks.length === 0 && <li>No duplicate tracks.</li>}
            </ol>
          </section>
        </div>
      </section>
    </div>
  );

  return (
    <>
      <div className="infoCardGrid" aria-label="SoundSync highlights">
      {staticInfoCards.map((card) => (
        <article
          className="infoCard"
          key={card.title}
        >
          <img src={card.image} alt="" />
          <div className="infoCardBody">
            <strong>{card.title}</strong>
            <span>{card.description}</span>
          </div>
        </article>
      ))}

        <article className="infoCard infoCardProcessed">
          {/* <img src="/ichigo/confetti.jpg" alt="" /> */}
          <img src="/utils/vampire.jpeg" alt="" />
          {/* <img src="/utils/yanis26xPFP.jpg" alt="" /> */}
          <img src="/SoundSync/SoundSyncLogoNoBG.png" alt="" />
        </article>

        <button
          type="button"
          className="infoCard infoCardFeatured infoCardActivity"
          onClick={() => setIsModalOpen(true)}
        >
          <img src="/ichigo/hug.jpg" alt="" />
          <div className="infoCardBody">
            <p>{transferLoading ? "Transfer running" : hasResult ? "Last transfer" : "Activity"}</p>
            <strong>{playlistName}</strong>
            <span>{sourceName} → {destinationName}</span>

            <div className="infoCardTicker" aria-label="Transfer activity preview">
              <ul>
                {tickerItems.map((item, index) => (
                  <li key={`activity-ticker-${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="infoCardStats">
              <span>{getCount(addedTracks)} added</span>
              <span>{getCount(failedTracks)} failed</span>
              <span>{getCount(alreadyTracks)} already</span>
            </div>
          </div>
        </button>
      </div>

      {isModalOpen && createPortal(modal, document.body)}
    </>
  );
}

export default InfoCard;
