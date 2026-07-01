import PlatformChooser from "../../components/PlatformChooser/PlatformChooser";
import PlaylistChooser from "../../components/PlaylistChooser/PlaylistChooser";
import StartTransfer from "../../components/StartTransfer/StartTransfer";
import "./Transfer.css";

function Transfer({
  text,
  chooseText,
  platformOrder,
  accessToken,
  youtubeAccessToken,
  appleMusicUserToken,
  selectedPlatforms,
  sourcePlatform,
  destinationPlatform,
  platformDisplayLogos,
  getPlatformDetails,
  getPlatformPlaylists,
  selectedSourcePlaylistId,
  setSelectedSourcePlaylistId,
  setTransferResult,
  setTransferError,
  newPlaylistName,
  setNewPlaylistName,
  getPlaylistImage,
  getPlaylistName,
  getPlaylistCount,
  destinationMode,
  setDestinationMode,
  destinationPlaylistId,
  setDestinationPlaylistId,
  destinationPlaylists,
  transferError,
  transferStarted,
  transferLoading,
  transferStatus,
  selectedSourcePlaylist,
  selectedSourceTracks,
  selectedSourceTracksLoading,
  selectedSourceTracksError,
  trackSelectionMode,
  setTrackSelectionMode,
  selectedTrackKeys,
  setSelectedTrackKeys,
  toggleSelectedTrack,
  getTrackLabel,
  startPlaylistTransfer,
  restartTransferFlow,
  returnToMenu,
  stopTransfer,
  transferResult,
  addPlatformToOrder,
  loginSpotify,
  loginYoutube,
  loginAppleMusic,
  resetPlatformChoice,
  startSimulationTransfer,
}) {
  return (
    <section className="transferPage">
      {selectedPlatforms.length < 2 && (
        <div className="transferPlatformStage">
          <button
            type="button"
            className="platformResetBtn"
            onClick={resetPlatformChoice}
            disabled={platformOrder.length === 0}
          >
            ↻ {text.changePlatform}
          </button>

          <PlatformChooser
            chooseText={chooseText}
            chooseSubText={
              platformOrder.length === 1
                ? "where do you want to tranfer them !?"
                : "Where are the musics you want to transfer from?!"
            }
            platformOrder={platformOrder}
            accessToken={accessToken}
            youtubeAccessToken={youtubeAccessToken}
            appleMusicUserToken={appleMusicUserToken}
            onAddPlatform={addPlatformToOrder}
            onLoginSpotify={loginSpotify}
            onLoginYoutube={loginYoutube}
            onLoginAppleMusic={loginAppleMusic}
            onStartSimulation={startSimulationTransfer}
          />
        </div>
      )}

      {selectedPlatforms.length === 2 && sourcePlatform && destinationPlatform && (
        <div className="transferWorkspace">
          {!transferStarted && (
            <button
              type="button"
              className="platformResetBtn transferResetChoiceBtn"
              onClick={resetPlatformChoice}
            >
              ↻ {text.changePlatform}
            </button>
          )}

          {!selectedSourcePlaylistId ? (
            <PlaylistChooser
              text={text}
              sourcePlatform={sourcePlatform}
              sourcePlatformLogo={platformDisplayLogos[sourcePlatform.id]}
              platformDetails={getPlatformDetails(sourcePlatform.id)}
              playlists={getPlatformPlaylists(sourcePlatform.id)}
              selectedPlaylistId={selectedSourcePlaylistId}
              getPlaylistImage={getPlaylistImage}
              getPlaylistName={getPlaylistName}
              getPlaylistCount={getPlaylistCount}
              onSelectPlaylist={(playlist) => {
                setSelectedSourcePlaylistId(playlist.id);
                setTransferResult(null);
                setTransferError("");
                setTrackSelectionMode("all");
                setSelectedTrackKeys([]);
                if (!newPlaylistName) {
                  setNewPlaylistName(getPlaylistName(sourcePlatform.id, playlist));
                }
              }}
            />
          ) : (
            <StartTransfer
              text={text}
              destinationMode={destinationMode}
              setDestinationMode={setDestinationMode}
              newPlaylistName={newPlaylistName}
              setNewPlaylistName={setNewPlaylistName}
              destinationPlaylistId={destinationPlaylistId}
              setDestinationPlaylistId={setDestinationPlaylistId}
              destinationPlaylists={destinationPlaylists}
              destinationPlatform={destinationPlatform}
              getPlaylistName={getPlaylistName}
              transferError={transferError}
              transferStarted={transferStarted}
              transferLoading={transferLoading}
              transferStatus={transferStatus}
              transferLimit={text.transferLimit}
              selectedSourcePlaylist={selectedSourcePlaylist}
              sourcePlatform={sourcePlatform}
              sourceTracks={selectedSourceTracks}
              sourceTracksLoading={selectedSourceTracksLoading}
              sourceTracksError={selectedSourceTracksError}
              trackSelectionMode={trackSelectionMode}
              setTrackSelectionMode={setTrackSelectionMode}
              selectedTrackKeys={selectedTrackKeys}
              toggleSelectedTrack={toggleSelectedTrack}
              getTrackLabel={getTrackLabel}
              startPlaylistTransfer={startPlaylistTransfer}
              restartTransferFlow={restartTransferFlow}
              returnToMenu={returnToMenu}
              stopTransfer={stopTransfer}
              transferResult={transferResult}
            />
          )}
        </div>
      )}
    </section>
  );
}

export default Transfer;
