import "./Loading.css";

const parseTransferStatus = (status) => {
  const match = status?.match(/(?:^| )(\d+)\/(\d+):\s*(.+)$/);

  if (!match) {
    return {
      current: 0,
      total: 0,
      track: "",
    };
  }

  return {
    current: Number(match[1]),
    total: Number(match[2]),
    track: match[3],
  };
};

function Loading({
  isVisible,
  status,
  sourceName,
  destinationName,
  playlistName,
  totalTracks = 0,
}) {
  if (!isVisible) return null;

  const progress = parseTransferStatus(status);
  const total = progress.total || totalTracks || 0;
  const current = progress.current || 0;
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <aside className="loadingTransferPanel" role="status" aria-live="polite">
      <div className="loadingTransferTop">
        <span className="loadingTransferSpinner" aria-hidden="true"></span>
        <div className="loadingTransferTitle">
          <strong>Transfer en cours</strong>
          <span>{sourceName || "Source"} → {destinationName || "Destination"}</span>
        </div>
      </div>

      <div className="loadingTransferMeta">
        <span>{playlistName || "Playlist"}</span>
        <span>{total ? `${current || 1}/${total}` : "Préparation"}</span>
      </div>

      <div className="loadingTransferBar" aria-hidden="true">
        <span style={{ width: `${percent}%` }}></span>
      </div>

      <div className="loadingTransferTrack">
        <span>Now processing</span>
        <strong>{progress.track || status || "Chargement des musiques..."}</strong>
      </div>
    </aside>
  );
}

export default Loading;
