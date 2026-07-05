import { useState } from "react";
import InfoCard from "./InfoCard/InfoCard";
import "./HomeStart.css";

function HomeStart({
  text,
  transferStarted,
  transferLoading,
  transferStatus,
  transferResult,
  transferError,
  sourcePlatform,
  destinationPlatform,
  selectedSourcePlaylist,
  selectedSourceTracks,
  selectedSourceTracksLoading,
  selectedSourceTracksError,
  getPlaylistName,
  getTrackLabel,
}) {
  const [isInfoCardVisible, setIsInfoCardVisible] = useState(true);
  const hasActiveTransfer = transferStarted || transferLoading;

  return (
    <section className="homeStartSection">
      <div className="homeStartContent">
        <div className="homeStartCopy">
          {/* <p className="homeStartEyebrow">Ready 2 sync?</p> */}
          <h2>
            Let's start 2 <span>Sync!</span>
          </h2>
<p className="homeStartDescription">
  Start 2 sync your music and playlists by clicking{" "}
  <span className="homeStartHighlight">START</span> in the top.
</p>
        </div>

        {hasActiveTransfer && (
          <div className="homeStartBtnWrap" aria-hidden="false">
            <button
              type="button"
              className="homeStartInfoToggleBtn"
              onClick={() => setIsInfoCardVisible((currentValue) => !currentValue)}
            >
              {isInfoCardVisible ? "Hide Dashboard" : "Show Dashboard"}
            </button>
          </div>
        )}

        {hasActiveTransfer && isInfoCardVisible && (
          <InfoCard
            text={text}
            transferStarted={transferStarted}
            transferLoading={transferLoading}
            transferStatus={transferStatus}
            transferResult={transferResult}
            transferError={transferError}
            sourcePlatform={sourcePlatform}
            destinationPlatform={destinationPlatform}
            selectedSourcePlaylist={selectedSourcePlaylist}
            selectedSourceTracks={selectedSourceTracks}
            selectedSourceTracksLoading={selectedSourceTracksLoading}
            selectedSourceTracksError={selectedSourceTracksError}
            getPlaylistName={getPlaylistName}
            getTrackLabel={getTrackLabel}
          />
        )}

      </div>
    </section>
  );
}

export default HomeStart;
