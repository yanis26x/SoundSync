import { useState } from "react";
import InfoCard from "./InfoCard/InfoCard";
import "./HomeStart.css";

function HomeStart({
  onOpenTransfer,
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

  const openTransferPage = () => {
    if (onOpenTransfer) {
      onOpenTransfer();
      return;
    }

    window.location.href = "/transfer";
  };

  return (
    <section className="homeStartSection">
      <div className="homeStartContent">
        <div className="homeStartCopy">
          {/* <p className="homeStartEyebrow">Ready 2 sync?</p> */}
          <h2>
            Let's start 2 <span>Sync!</span>
          </h2>
          <p className="homeStartDescription">
            Choose your platforms, pick your playlist, and keep listening 2 your favorite playlists across all your music platforms.
          </p>
        </div>

        <div className="homeStartBtnWrap" aria-hidden="false">
          <span className="musicNote noteOne">♪</span>
          <span className="musicNote noteTwo">♫</span>
          <span className="musicNote noteThree">♬</span>
          <span className="musicNote noteFour">♩</span>

          <button
            type="button"
            className="homeStartBtn"
            onClick={openTransferPage}
          >
            Start →
          </button>

          <button
            type="button"
            className="homeStartInfoToggleBtn"
            onClick={() => setIsInfoCardVisible((currentValue) => !currentValue)}
          >
            {isInfoCardVisible ? "Hide info" : "Show info"}
          </button>
        </div>

        {isInfoCardVisible && (
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
