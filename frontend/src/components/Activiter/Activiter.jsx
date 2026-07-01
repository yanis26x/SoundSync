import { useState } from "react";
import "./Activiter.css";

function Activiter({
  text,
  transferStarted,
  transferLoading,
  transferStatus,
  transferResult,
  transferError,
  sourcePlatform,
  destinationPlatform,
  selectedSourcePlaylist,
  getPlaylistName,
  onStopTransfer,
}) {
  const [showDetails, setShowDetails] = useState(false);

  const hasResult = Boolean(transferResult);
  const hasActivity = transferStarted || hasResult || transferError;
  const playlistName =
    sourcePlatform && selectedSourcePlaylist
      ? getPlaylistName(sourcePlatform.id, selectedSourcePlaylist)
      : hasResult
        ? "Previous playlist"
        : "No transfer started yet";
  const transferTitle = sourcePlatform && destinationPlatform
    ? ""
    : hasActivity
      ? "Playlist transfer"
      : "Ready when you are";
  const heading = transferLoading
    ? "Transfer running"
    : hasResult || transferError
      ? "Last transfer"
      : "Activity";

  return (
    <section className="activiterPanel">
      <div className="activiterTopbar">
        <div>
          <h2>{heading}</h2>
        </div>
      </div>

      <div className="activiterBody">
          <div className="activiterSummary">
            <div>
              {sourcePlatform && destinationPlatform ? (
                <div className="activiterPlatformLogos" aria-label={`${sourcePlatform.name} to ${destinationPlatform.name}`}>
                  <div className="activiterPlatformLogoWrap">
                    {sourcePlatform.logo ? (
                      <img src={sourcePlatform.logo} alt={sourcePlatform.name} />
                    ) : (
                      <span>{sourcePlatform.name}</span>
                    )}
                  </div>

                  <span className="activiterPlatformArrow" aria-hidden="true">→</span>

                  <div className="activiterPlatformLogoWrap">
                    {destinationPlatform.logo ? (
                      <img src={destinationPlatform.logo} alt={destinationPlatform.name} />
                    ) : (
                      <span>{destinationPlatform.name}</span>
                    )}
                  </div>
                </div>
              ) : (
                <strong>{transferTitle}</strong>
              )}
              <span>{playlistName}</span>
            </div>
          </div>

          {!hasActivity && (
            <div className="activiterEmpty">
              <strong>No transfer running</strong>
              <p>Your current transfer and last result will show up here.</p>
            </div>
          )}

          {transferLoading && (
            <div className="activiterLoading" role="status" aria-live="polite">
              <span className="activiterPulse" aria-hidden="true"></span>
              <p>{transferStatus || text.transferLoading}</p>
              <button type="button" className="activiterStopBtn" onClick={onStopTransfer}>
                {text.stopTransfer}
              </button>
            </div>
          )}

          {hasResult && (
            <div className="activiterStats">
              <div>
                <strong>{transferResult.added.length}</strong>
                <span>{text.addedTracks}</span>
              </div>
              <div>
                <strong>{transferResult.failed.length}</strong>
                <span>{text.failedTracks}</span>
              </div>
              <div>
                <strong>{transferResult.already.length}</strong>
                <span>{text.alreadyTracks}</span>
              </div>
            </div>
          )}

          {(transferError || hasResult) && (
            <button
              type="button"
              className="activiterDetailsBtn"
              onClick={() => setShowDetails((currentValue) => !currentValue)}
            >
              {showDetails ? "Hide details" : "See errors / details"}
            </button>
          )}

          {showDetails && (
            <div className="activiterDetails">
              {transferError && <p className="activiterError">{transferError}</p>}

              {hasResult && (
                <>
                  <section>
                    <h3>Failed</h3>
                    {transferResult.failed.length > 0 ? (
                      <ol>
                        {transferResult.failed.map((track, index) => (
                          <li key={`activity-failed-${track}-${index}`}>{track}</li>
                        ))}
                      </ol>
                    ) : (
                      <p>None</p>
                    )}
                  </section>

                  <section>
                    <h3>Already there</h3>
                    {transferResult.already.length > 0 ? (
                      <ol>
                        {transferResult.already.map((track, index) => (
                          <li key={`activity-already-${track}-${index}`}>{track}</li>
                        ))}
                      </ol>
                    ) : (
                      <p>None</p>
                    )}
                  </section>
                </>
              )}
            </div>
          )}
      </div>
    </section>
  );
}

export default Activiter;
