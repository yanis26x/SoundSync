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
  transferLoading,
  transferStatus,
  selectedSourcePlaylist,
  startPlaylistTransfer,
  transferResult,
  addPlatformToOrder,
  loginSpotify,
  loginYoutube,
  loginAppleMusic,
  resetPlatformChoice,
}) {
  return (
    <section className="transferPage">
      {selectedPlatforms.length < 2 && (
        <div className="transferPlatformStage">
          <PlatformChooser
            chooseText={chooseText}
            platformOrder={platformOrder}
            accessToken={accessToken}
            youtubeAccessToken={youtubeAccessToken}
            appleMusicUserToken={appleMusicUserToken}
            loggedLabel={text.logged}
            onAddPlatform={addPlatformToOrder}
            onLoginSpotify={loginSpotify}
            onLoginYoutube={loginYoutube}
            onLoginAppleMusic={loginAppleMusic}
            onResetPlatformChoice={resetPlatformChoice}
            resetLabel={text.changePlatform}
          />
        </div>
      )}

      {selectedPlatforms.length === 2 && sourcePlatform && destinationPlatform && (
        <div className="transferWorkspace">
          <button
            type="button"
            className="transferResetChoiceBtn"
            onClick={resetPlatformChoice}
          >
            {text.changePlatform}
          </button>

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
              transferLoading={transferLoading}
              transferStatus={transferStatus}
              transferLimit={text.transferLimit}
              selectedSourcePlaylist={selectedSourcePlaylist}
              startPlaylistTransfer={startPlaylistTransfer}
              transferResult={transferResult}
            />
          )}
        </div>
      )}
    </section>
  );
}

export default Transfer;
