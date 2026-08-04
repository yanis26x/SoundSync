import "./Stats.css";

const statsLogo = new URL("../../../../ASSETS/IMAGE/ichigo/eyesContact.jpg", import.meta.url).href;

function Stats({ hasTransferResult, transferResult }) {
  const image = hasTransferResult ? transferResult?.playlistImage || statsLogo : statsLogo;
  const playlistTitle = transferResult?.playlistName || "Last playlist";
  const transferredCount = transferResult?.added?.length || 0;
  const totalCount =
    transferredCount +
    (transferResult?.failed?.length || 0) +
    (transferResult?.already?.length || 0);
  const title = hasTransferResult ? "Transfer Done!" : "Ready 2 Sync?!";
  const description = hasTransferResult
    ? '4 more info about your transfer, click on "+ DETAILS" in the menu, or start a new one.'
    : "want sum more? @yanis26x ";

  return (
    <section className="statsCard homeInfoFeatureCard homeInfoFeatureCardSwap is-disabledLink" aria-label="Stats">
      <img className="statsLogo" src={image} alt="SoundSync" />
      {hasTransferResult && (
        <>
          <strong className="statsPlaylistTitle">{playlistTitle}</strong>
          <span className="statsPlaylistCount">
            {transferredCount}/{totalCount} songs transferred
          </span>
        </>
      )}
      <div className="statsCardText">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </section>
  );
}

export default Stats;
