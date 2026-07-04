import { useEffect, useRef } from "react";
import PlatformChooser from "../../components/TRANSFER/PlatformChooser/PlatformChooser";
import PlaylistChooser from "../../components/TRANSFER/PlaylistChooser/PlaylistChooser";
import StartTransfer from "../../components/TRANSFER/StartTransfer/StartTransfer";
import "./Transfer.css";

const transferTouchSound = new URL("../../../SOUND/sfx/touch-P4.wav", import.meta.url).href;
const transferOupsSound = new URL("../../../SOUND/sfx/oups-P4.wav", import.meta.url).href;
const whereMusicFromSound = new URL("../../../SOUND/Miku/WhereMusicFrom-miku.mp3", import.meta.url).href;
const whereToSyncSound = new URL("../../../SOUND/Miku/where2youWant.mp3", import.meta.url).href;

const transferButtonSounds = {
  touchP4: transferTouchSound,
  oupsP4: transferOupsSound,
};

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
  transferButtonSound = "touchP4",
  mikuVoiceEnabled = true,
}) {
  const platformPromptAudioRef = useRef(null);
  const hasPlayedWhereMusicFromSoundRef = useRef(false);
  const hasPlayedWhereToSyncSoundRef = useRef(false);

  const stopPlatformPromptAudio = () => {
    if (!platformPromptAudioRef.current) return;

    platformPromptAudioRef.current.pause();
    platformPromptAudioRef.current.currentTime = 0;
    platformPromptAudioRef.current = null;
  };

  const playPlatformPromptAudio = (sound) => {
    if (!mikuVoiceEnabled) return;

    stopPlatformPromptAudio();

    const audio = new Audio(sound);
    audio.volume = 0.82;
    platformPromptAudioRef.current = audio;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    if (platformOrder.length !== 0) {
      hasPlayedWhereMusicFromSoundRef.current = false;
      return;
    }

    if (!mikuVoiceEnabled) {
      stopPlatformPromptAudio();
      return;
    }

    if (sessionStorage.getItem("sound_sync_source_prompt_played") === "true") {
      sessionStorage.removeItem("sound_sync_source_prompt_played");
      hasPlayedWhereMusicFromSoundRef.current = true;
      return;
    }

    if (hasPlayedWhereMusicFromSoundRef.current) return;

    hasPlayedWhereMusicFromSoundRef.current = true;
    playPlatformPromptAudio(whereMusicFromSound);
  }, [mikuVoiceEnabled, platformOrder.length]);

  useEffect(() => {
    if (platformOrder.length !== 1) {
      hasPlayedWhereToSyncSoundRef.current = false;
      return;
    }

    if (!mikuVoiceEnabled) {
      stopPlatformPromptAudio();
      return;
    }

    if (hasPlayedWhereToSyncSoundRef.current) return;

    hasPlayedWhereToSyncSoundRef.current = true;
    playPlatformPromptAudio(whereToSyncSound);
  }, [mikuVoiceEnabled, platformOrder.length]);

  useEffect(() => () => {
    stopPlatformPromptAudio();
  }, []);

  const handleAddPlatform = (platformId) => {
    stopPlatformPromptAudio();
    addPlatformToOrder(platformId);
  };

  const playTransferTouchSound = (event) => {
    const clickedButton = event.target.closest("button");

    if (!clickedButton || clickedButton.disabled) return;

    const sound = transferButtonSounds[transferButtonSound];
    if (!sound) return;

    const audio = new Audio(sound);
    audio.volume = 0.45;
    audio.play().catch(() => {});
  };

  return (
    <section className="transferPage" onClickCapture={playTransferTouchSound}>
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
                ? "Where 2 U want 2 sync ur music?!"
                : "where are the musics you want 2 transfer from?!"
            }
            platformOrder={platformOrder}
            accessToken={accessToken}
            youtubeAccessToken={youtubeAccessToken}
            appleMusicUserToken={appleMusicUserToken}
            onAddPlatform={handleAddPlatform}
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
              mikuVoiceEnabled={mikuVoiceEnabled}
            />
          )}
        </div>
      )}
    </section>
  );
}

export default Transfer;
