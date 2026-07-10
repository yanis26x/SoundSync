import CommentLoop from "../CommentLoop/CommentLoop";
import "./Starting.css";

const getCount = (items) => (Array.isArray(items) ? items.length : 0);

const getFallbackTrackLabel = (track) => {
  if (typeof track === "string") return track;
  if (track?.track?.name) return track.track.name;
  if (track?.attributes?.name) return track.attributes.name;
  if (track?.snippet?.title) return track.snippet.title;
  return "Untitled track";
};

function Starting({
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
  onStartTransfer,
  onRetryFailed,
}) {
  const hasResult = Boolean(transferResult);
  const hasActivity = transferStarted || transferLoading || hasResult || transferError;
  const playlistName =
    sourcePlatform && selectedSourcePlaylist && getPlaylistName
      ? getPlaylistName(sourcePlatform.id, selectedSourcePlaylist)
      : hasResult
        ? transferResult.playlistName || "Last playlist"
        : "No transfer yet";
  const sourceName = transferResult?.sourceName || sourcePlatform?.name || "Source";
  const destinationName = transferResult?.destinationName || destinationPlatform?.name || "Destination";
  const playlistImage =
    transferResult?.playlistImage ||
    (sourcePlatform && selectedSourcePlaylist && getPlaylistName ? null : "");
  const transferDate = transferResult?.transferredAt
    ? new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(transferResult.transferredAt))
    : "";
  const addedTracks = transferResult?.added || [];
  const failedTracks = transferResult?.failed || [];
  const alreadyTracks = transferResult?.already || [];
  const queuedTracks = selectedSourceTracks.map((track) =>
    sourcePlatform && getTrackLabel
      ? getTrackLabel(sourcePlatform.id, track)
      : getFallbackTrackLabel(track)
  );
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
    ...(hasResult ? addedTracks : queuedTracks).slice(0, 6),
  ].filter(Boolean);

  return (
    <section className="startingSection">
      <header className="startingHeader">
        <h1>Welcome 2 SoundSync</h1>
        <p>Transfer your playlists, keep your music moving, and pick up from your latest sync.</p>
      </header>

      <div className="startingCards" aria-label="SoundSync start and transfer status">
        <article className="startingCard startingStartCard">
          <img
            className="startingLogoMark"
            src="/SoundSync/SoundSyncLogoNoBG.png"
            alt=""
            aria-hidden="true"
          />

          <div className="startingCommentLoop">
            <CommentLoop />
          </div>

          <button
            type="button"
            className="startingStartBtn"
            onClick={onStartTransfer}
          >
            <span className="startingStartDot" aria-hidden="true"></span>
            <span>Start</span>
          </button>
        </article>

        <article className="startingCard startingActivityCard">
          {playlistImage && (
            <img
              className="startingPlaylistArt"
              src={playlistImage}
              alt=""
              aria-hidden="true"
            />
          )}

          <p className="startingCardKicker">
            {transferLoading ? "Transfer running" : hasResult ? "Last transfer" : "Activity"}
          </p>

          <h2>{playlistName}</h2>
          <span className="startingRoute">{sourceName} → {destinationName}</span>
          {transferDate && <span className="startingTransferDate">{transferDate}</span>}

          <div className="startingTicker" aria-label="Transfer activity preview">
            <ul>
              {tickerItems.map((item, index) => (
                <li key={`starting-activity-${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="startingStats">
            <span>{getCount(addedTracks)} added</span>
            <span>{getCount(failedTracks)} failed</span>
            <span>{getCount(alreadyTracks)} already</span>
          </div>

          {failedTracks.length > 0 && (
            <button
              type="button"
              className="startingRetryBtn"
              onClick={onRetryFailed}
              disabled={transferLoading}
            >
              {text?.retryFailedTracks || "Retry failed tracks"}
            </button>
          )}
        </article>
      </div>
    </section>
  );
}

export default Starting;
