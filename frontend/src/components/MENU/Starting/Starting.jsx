import { useRef, useState } from "react";
import "./Starting.css";
import MusicPlayerMenu from "../MusicPlayerMenu/MusicPlayerMenu";
import TransferDetailsModal from "./TransferDetailsModal";

const mikuPerfectSound = new URL("../../../../ASSETS/SOUND/Miku/MikuPerfect.wav", import.meta.url).href;
const mikuFailedSound = new URL("../../../../ASSETS/SOUND/Miku/MikuFailed.wav", import.meta.url).href;
const mikuMmSound = new URL("../../../../ASSETS/SOUND/Miku/MikuMm.wav", import.meta.url).href;
const mikuOpenSound = new URL("../../../../ASSETS/SOUND/Miku/MikuOpen.wav", import.meta.url).href;

const getCount = (items) => (Array.isArray(items) ? items.length : 0);

const getFallbackTrackLabel = (track) => {
  if (typeof track === "string") return track;
  if (track?.track?.name) return track.track.name;
  if (track?.attributes?.name) return track.attributes.name;
  if (track?.snippet?.title) return track.snippet.title;
  return "Untitled track";
};

const platformLogoMap = {
  spotify: "/IMAGE/logo/mini/spotify-mini.png",
  youtube: "/IMAGE/logo/mini/Youtube-mini.svg",
  apple: "/IMAGE/logo/mini/Apple-Music-mini.png",
};

const defaultCoverImage = "/IMAGE/ichigo/blueSkyHappy.jpg";

const getPlatformLogo = (platform, fallbackName) => {
  if (platform?.logo) return platform.logo;
  const normalizedName = fallbackName?.toLowerCase().replace(/\s+/g, "");
  if (normalizedName?.includes("spotify")) return platformLogoMap.spotify;
  if (normalizedName?.includes("youtube")) return platformLogoMap.youtube;
  if (normalizedName?.includes("apple")) return platformLogoMap.apple;
  return "";
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
  onRetryFailedTransfer,
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const detailsAudioRef = useRef(null);
  const hasResult = Boolean(transferResult);
  const hasActivity = transferStarted || transferLoading || hasResult || transferError;
  const noTransfer = !hasActivity;
  const transferStateLabel = transferLoading
    ? "Transfer running"
    : hasResult
      ? "Last transfer"
      : "No transfer";
  const playlistName =
    sourcePlatform && selectedSourcePlaylist && getPlaylistName
      ? getPlaylistName(sourcePlatform.id, selectedSourcePlaylist)
      : hasResult
        ? transferResult.playlistName || "Last playlist"
        : "No transfer";
  const sourceName = transferResult?.sourceName || sourcePlatform?.name || "Source";
  const destinationName = transferResult?.destinationName || destinationPlatform?.name || "Destination";
  const sourceLogo = getPlatformLogo(sourcePlatform, sourceName);
  const destinationLogo = getPlatformLogo(destinationPlatform, destinationName);
  const playlistImage =
    transferResult?.playlistImage ||
    (sourcePlatform && selectedSourcePlaylist && getPlaylistName ? null : "");
  const coverImage = playlistImage || defaultCoverImage;
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
  const hasFailedTracks = failedTracks.length > 0;
  const transferTrackCount = getCount(addedTracks) + getCount(failedTracks) + getCount(alreadyTracks);
  const titleStatus = hasResult
    ? `${transferTrackCount} ${transferTrackCount === 1 ? "Track" : "Tracks"}`
    : "0 Tracks";
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

  const playDetailsSound = () => {
    if (detailsAudioRef.current) {
      detailsAudioRef.current.pause();
      detailsAudioRef.current.currentTime = 0;
    }

    const addedCount = getCount(addedTracks);
    const failedCount = getCount(failedTracks);
    const alreadyCount = getCount(alreadyTracks);
    const sound =
      !hasResult
        ? mikuMmSound
        : addedCount > 0 && failedCount === 0 && alreadyCount === 0
          ? mikuPerfectSound
          : failedCount > 0 && addedCount === 0 && alreadyCount === 0
            ? mikuFailedSound
            : mikuOpenSound;

    const audio = new Audio(sound);
    audio.volume = 0.72;
    detailsAudioRef.current = audio;
    audio.play().catch(() => {});
  };

  const openDetails = () => {
    playDetailsSound();
    setIsDetailsOpen(true);
  };

  return (
    <section className="startingSection">
      <header className="startingHeader">
        <h1>Welcome 2 SoundSync</h1>
        <p>Transfer your playlists, keep your music moving, and pick up from your latest sync.</p>
      </header>

      <div className="startingCards" aria-label="SoundSync start and transfer status">
        <article className="startingCard startingActivityCard">
          <section className="information" aria-label="Transfer information">
            <div className="startingTitleRow">
              <h2>{playlistName}</h2>
            </div>
            {transferDate && <span className="startingTransferDate">{transferDate}</span>}

            <span className="startingRoute" aria-label={`${sourceName} to ${destinationName}`}>
              {sourceLogo ? (
                <img src={sourceLogo} alt={sourceName} />
              ) : (
                <span>{sourceName}</span>
              )}
              <span aria-hidden="true">→</span>
              {destinationLogo ? (
                <img src={destinationLogo} alt={destinationName} />
              ) : (
                <span>{destinationName}</span>
              )}
            </span>

            <dl className={`informationDetails ${hasResult ? "hasTransferResult" : ""}`}>
              <div className="informationDetailAdded">
                <dt>Added</dt>
                <dd>{getCount(addedTracks)}</dd>
              </div>
              <div className="informationDetailFailed">
                <dt>Failed</dt>
                <dd>{getCount(failedTracks)}</dd>
              </div>
              <div className="informationDetailAlready">
                <dt>Already</dt>
                <dd>{getCount(alreadyTracks)}</dd>
              </div>
            </dl>

            <div className="startingActions">
              <button
                type="button"
                className="startingStartBtn"
                onClick={onStartTransfer}
              >
                <span className="startingStartDot" aria-hidden="true"></span>
                <span>START</span>
              </button>
              <button
                type="button"
                className="startingStartBtn startingDetailsBtn"
                onClick={openDetails}
              >
                <span>+ DETAILS</span>
              </button>
              {hasFailedTracks && (
                <button
                  type="button"
                  className="startingStartBtn startingRetryBtn"
                  onClick={onRetryFailedTransfer}
                  disabled={transferLoading}
                >
                  <span>↩ RETRY</span>
                </button>
              )}
            </div>

            <div className="startingTicker" aria-label="Transfer activity preview">
              {noTransfer ? (
                <p className="startingTickerEmpty">No transfer yet. Press START to begin.</p>
              ) : (
                <ul>
                  {tickerItems.map((item, index) => (
                    <li key={`starting-activity-${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <div className={`coverPreview ${noTransfer ? "coverPreviewPlayer" : ""}`} aria-hidden={noTransfer ? undefined : "true"}>
            {noTransfer ? (
              <MusicPlayerMenu compact />
            ) : (
              <img src={coverImage} alt="" />
            )}
          </div>
        </article>
      </div>

      <TransferDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        transferResult={transferResult}
      />
    </section>
  );
}

export default Starting;
