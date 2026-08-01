import { useEffect, useRef, useState } from "react";
import PlatformChooser from "../../components/TRANSFER/PlatformChooser/PlatformChooser";
import PlaylistChooser from "../../components/TRANSFER/PlaylistChooser/PlaylistChooser";
import StartTransfer from "../../components/TRANSFER/StartTransfer/StartTransfer";
import StatusStepTransfer from "../../components/TRANSFER/StatusStepTransfer/StatusStepTransfer";
import "./Transfer.css";

const transferTouchSound = new URL("../../../ASSETS/SOUND/sfx/touch-P4.wav", import.meta.url).href;
const transferOupsSound = new URL("../../../ASSETS/SOUND/sfx/oups-P4.wav", import.meta.url).href;
const whereMusicFromSound = new URL("../../../ASSETS/SOUND/Miku/WhereMusicFrom-miku.mp3", import.meta.url).href;
const whereToSyncSound = new URL("../../../ASSETS/SOUND/Miku/where2youWant.mp3", import.meta.url).href;
const yukeVoiceSound = new URL("../../../ASSETS/SOUND/sfx/evilLaugh.mp3", import.meta.url).href;

const transferButtonSounds = {
  touchP4: transferTouchSound,
  oupsP4: transferOupsSound,
};

const voicePromptSounds = {
  miku: {
    source: whereMusicFromSound,
    destinationPlatform: whereToSyncSound,
  },
  yuke: {
    source: yukeVoiceSound,
    destinationPlatform: yukeVoiceSound,
  },
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
  retryFailedTransfer,
  restartTransferFlow,
  returnToMenu,
  stopTransfer,
  transferResult,
  reviewBeforeTransfer,
  setReviewBeforeTransfer,
  transferReview,
  confirmReviewedTransfer,
  cancelReviewedTransfer,
  addPlatformToOrder,
  loginSpotify,
  loginYoutube,
  loginAppleMusic,
  resetPlatformChoice,
  startSimulationTransfer,
  transferButtonSound = "touchP4",
  mikuVoiceEnabled = true,
  voiceCharacter = "miku",
}) {
  const platformPromptAudioRef = useRef(null);
  const hasPlayedWhereMusicFromSoundRef = useRef(false);
  const hasPlayedWhereToSyncSoundRef = useRef(false);
  const [tracksStepCompleted, setTracksStepCompleted] = useState(false);
  const shouldChooseSourcePlatform = selectedPlatforms.length === 0;
  const shouldChooseDestinationPlatform =
    Boolean(sourcePlatform && selectedSourcePlaylistId && tracksStepCompleted && !destinationPlatform);
  const shouldShowPlatformChooser = shouldChooseSourcePlatform || shouldChooseDestinationPlatform;
  const shouldShowTransferWorkspace =
    Boolean(sourcePlatform) && !shouldChooseDestinationPlatform;
  const selectedVoiceSounds = voicePromptSounds[voiceCharacter] || voicePromptSounds.miku;

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
    playPlatformPromptAudio(selectedVoiceSounds.source);
  }, [mikuVoiceEnabled, platformOrder.length, selectedVoiceSounds.source]);

  useEffect(() => {
    if (!shouldChooseDestinationPlatform) {
      hasPlayedWhereToSyncSoundRef.current = false;
      return;
    }

    if (!mikuVoiceEnabled) {
      stopPlatformPromptAudio();
      return;
    }

    if (hasPlayedWhereToSyncSoundRef.current) return;

    hasPlayedWhereToSyncSoundRef.current = true;
    playPlatformPromptAudio(selectedVoiceSounds.destinationPlatform);
  }, [mikuVoiceEnabled, selectedVoiceSounds.destinationPlatform, shouldChooseDestinationPlatform]);

  useEffect(() => () => {
    stopPlatformPromptAudio();
  }, []);

  useEffect(() => {
    setTracksStepCompleted(false);
  }, [selectedSourcePlaylistId, sourcePlatform?.id]);

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

  const currentStep = !sourcePlatform
    ? 1
    : !selectedSourcePlaylistId
      ? 2
      : !tracksStepCompleted && !destinationPlatform
        ? 3
        : !destinationPlatform
          ? 4
          : 5;

  return (
    <section className="transferPage" onClickCapture={playTransferTouchSound}>
      {shouldShowPlatformChooser && (
        <div className="transferPlatformStage">
          <StatusStepTransfer
            sourcePlatform={sourcePlatform}
            destinationPlatform={destinationPlatform}
            currentStep={currentStep}
            onReset={resetPlatformChoice}
          />

          <PlatformChooser
            chooseText={chooseText}
            chooseSubText={
              shouldChooseDestinationPlatform
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

      {shouldShowTransferWorkspace && (
        <div className="transferWorkspace">
          <StatusStepTransfer
            sourcePlatform={sourcePlatform}
            destinationPlatform={destinationPlatform}
            currentStep={currentStep}
            onReset={resetPlatformChoice}
          />

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
                setTracksStepCompleted(false);
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
              initialSetupStep={destinationPlatform ? "destination" : "tracks"}
              text={text}
              destinationMode={destinationMode}
              setDestinationMode={setDestinationMode}
              newPlaylistName={newPlaylistName}
              setNewPlaylistName={setNewPlaylistName}
              destinationPlaylistId={destinationPlaylistId}
              setDestinationPlaylistId={setDestinationPlaylistId}
              destinationPlaylists={destinationPlaylists}
              destinationPlatform={destinationPlatform}
              getPlaylistImage={getPlaylistImage}
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
              setSelectedTrackKeys={setSelectedTrackKeys}
              toggleSelectedTrack={toggleSelectedTrack}
              getTrackLabel={getTrackLabel}
              startPlaylistTransfer={startPlaylistTransfer}
              retryFailedTransfer={retryFailedTransfer}
              restartTransferFlow={restartTransferFlow}
              returnToMenu={returnToMenu}
              stopTransfer={stopTransfer}
              transferResult={transferResult}
              reviewBeforeTransfer={reviewBeforeTransfer}
              setReviewBeforeTransfer={setReviewBeforeTransfer}
              transferReview={transferReview}
              confirmReviewedTransfer={confirmReviewedTransfer}
              cancelReviewedTransfer={cancelReviewedTransfer}
              mikuVoiceEnabled={mikuVoiceEnabled}
              voiceCharacter={voiceCharacter}
              onContinueToDestination={
                destinationPlatform ? undefined : () => setTracksStepCompleted(true)
              }
            />
          )}
        </div>
      )}
    </section>
  );
}

export default Transfer;
