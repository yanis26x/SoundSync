import { useEffect, useMemo, useRef, useState } from "react";
import "./StartTransfer.css";

const whatMusicSound = new URL("../../../../ASSETS/SOUND/Miku/whatMusic.mp3", import.meta.url).href;
const orWhatSound = new URL("../../../../ASSETS/SOUND/Miku/Orwhat.mp3", import.meta.url).href;
const yukeVoiceSound = new URL("../../../../ASSETS/SOUND/sfx/evilLaugh.mp3", import.meta.url).href;
const defaultPlaylistCover = "/IMAGE/ichigo/blueSkyHappy.jpg";

const voicePromptSounds = {
  miku: {
    destination: orWhatSound,
    tracks: whatMusicSound,
  },
  yuke: {
    destination: yukeVoiceSound,
    tracks: yukeVoiceSound,
  },
};

function StartTransfer({
  initialSetupStep = "destination",
  text,
  destinationMode,
  setDestinationMode,
  newPlaylistName,
  setNewPlaylistName,
  destinationPlaylistId,
  setDestinationPlaylistId,
  destinationPlaylists,
  destinationPlatform,
  getPlaylistImage,
  getPlaylistName,
  transferError,
  transferStarted,
  transferLoading,
  transferStatus,
  transferLimit,
  selectedSourcePlaylist,
  sourcePlatform,
  sourceTracks,
  sourceTracksLoading,
  sourceTracksError,
  selectedTrackKeys,
  setSelectedTrackKeys,
  toggleSelectedTrack,
  getTrackLabel,
  startPlaylistTransfer,
  restartTransferFlow,
  returnToMenu,
  stopTransfer,
  transferResult,
  reviewBeforeTransfer,
  setReviewBeforeTransfer,
  transferReview,
  confirmReviewedTransfer,
  cancelReviewedTransfer,
  retryFailedTransfer,
  onContinueToDestination,
  mikuVoiceEnabled = true,
  voiceCharacter = "miku",
}) {
  const [setupStep, setSetupStep] = useState(initialSetupStep);
  const [customCoverPreview, setCustomCoverPreview] = useState("");
  const [reviewMatches, setReviewMatches] = useState([]);
  const hasPlayedOrWhatSoundRef = useRef(false);
  const hasPlayedWhatMusicSoundRef = useRef(false);
  const initializedTrackSelectionRef = useRef("");
  const sourceTrackKey =
    sourcePlatform && selectedSourcePlaylist
      ? `${sourcePlatform.id}:${selectedSourcePlaylist.id}`
      : "";
  const visibleSourceTracks = sourceTracks;
  const visibleTrackKeys = useMemo(
    () => visibleSourceTracks.map((track, index) => `${sourceTrackKey}:${index}`),
    [sourceTrackKey, visibleSourceTracks]
  );
  const selectedTrackCount = selectedTrackKeys.filter((trackKey) =>
    trackKey.startsWith(`${sourceTrackKey}:`)
  ).length;
  const areAllTracksSelected =
    visibleTrackKeys.length > 0 &&
    visibleTrackKeys.every((trackKey) => selectedTrackKeys.includes(trackKey));
  const showTransferSetup = !transferStarted;
  const canContinueToTracks =
    destinationMode === "new" || Boolean(destinationPlaylistId);
  const canStartTransfer =
    selectedSourcePlaylist &&
    !transferLoading &&
    selectedTrackCount > 0 &&
    canContinueToTracks;
  const canRetryFailed =
    Boolean(transferResult?.failed?.length) && !transferLoading;
  const selectedDestinationPlaylist = destinationPlaylists.find(
    (playlist) => playlist.id === destinationPlaylistId
  );
  const existingPlaylistCover =
    destinationMode === "existing" && selectedDestinationPlaylist && destinationPlatform
      ? getPlaylistImage(destinationPlatform.id, selectedDestinationPlaylist)
      : "";
  const playlistCoverPreview = existingPlaylistCover || customCoverPreview || defaultPlaylistCover;
  const sourcePlaylistCover =
    sourcePlatform && selectedSourcePlaylist
      ? getPlaylistImage(sourcePlatform.id, selectedSourcePlaylist)
      : defaultPlaylistCover;
  const selectedTransferTracks = visibleSourceTracks.filter((track, index) =>
    selectedTrackKeys.includes(`${sourceTrackKey}:${index}`)
  );
  const shouldDimCover = destinationMode === "existing" && !selectedDestinationPlaylist;
  const selectedVoiceSounds = voicePromptSounds[voiceCharacter] || voicePromptSounds.miku;

  useEffect(() => {
    setReviewMatches(
      transferReview?.matches?.map((match) => ({
        ...match,
        approved: match.approved !== false,
      })) || []
    );
  }, [transferReview]);

  const toggleReviewMatch = (matchIndex) => {
    setReviewMatches((currentMatches) =>
      currentMatches.map((match, index) =>
        index === matchIndex ? { ...match, approved: !match.approved } : match
      )
    );
  };

  useEffect(() => () => {
    if (customCoverPreview) URL.revokeObjectURL(customCoverPreview);
  }, [customCoverPreview]);

  useEffect(() => {
    setSetupStep(initialSetupStep);
  }, [initialSetupStep]);

  useEffect(() => {
    initializedTrackSelectionRef.current = "";
  }, [sourceTrackKey]);

  useEffect(() => {
    if (!sourceTrackKey || sourceTracksLoading || sourceTracksError || visibleTrackKeys.length === 0) return;
    if (initializedTrackSelectionRef.current === sourceTrackKey) return;

    setSelectedTrackKeys((currentKeys) => {
      const currentSourceKeys = currentKeys.filter((trackKey) =>
        trackKey.startsWith(`${sourceTrackKey}:`)
      );

      initializedTrackSelectionRef.current = sourceTrackKey;

      if (currentSourceKeys.length > 0) return currentKeys;

      return [
        ...currentKeys.filter((trackKey) => !trackKey.startsWith(`${sourceTrackKey}:`)),
        ...visibleTrackKeys,
      ];
    });
  }, [
    setSelectedTrackKeys,
    sourceTrackKey,
    sourceTracksError,
    sourceTracksLoading,
    visibleTrackKeys,
  ]);

  const toggleAllTracks = () => {
    setSelectedTrackKeys((currentKeys) => {
      const otherTrackKeys = currentKeys.filter((trackKey) =>
        !trackKey.startsWith(`${sourceTrackKey}:`)
      );

      return areAllTracksSelected ? otherTrackKeys : [...otherTrackKeys, ...visibleTrackKeys];
    });
  };

  const choosePlaylistCover = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCustomCoverPreview((currentPreview) => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      return URL.createObjectURL(file);
    });
  };

  useEffect(() => {
    if (!showTransferSetup || setupStep !== "tracks") {
      hasPlayedWhatMusicSoundRef.current = false;
      return;
    }

    if (!mikuVoiceEnabled || hasPlayedWhatMusicSoundRef.current) return;

    hasPlayedWhatMusicSoundRef.current = true;

    const audio = new Audio(selectedVoiceSounds.tracks);
    audio.volume = 0.55;
    audio.play().catch(() => {});
  }, [mikuVoiceEnabled, selectedVoiceSounds.tracks, setupStep, showTransferSetup]);

  useEffect(() => {
    if (!showTransferSetup || setupStep !== "destination") {
      hasPlayedOrWhatSoundRef.current = false;
      return;
    }

    if (!mikuVoiceEnabled || hasPlayedOrWhatSoundRef.current) return;

    hasPlayedOrWhatSoundRef.current = true;

    const audio = new Audio(selectedVoiceSounds.destination);
    audio.volume = 0.55;
    audio.play().catch(() => {});
  }, [mikuVoiceEnabled, selectedVoiceSounds.destination, setupStep, showTransferSetup]);

  return (
    <section className="destinationSetup transferFocusPanel">
      <div className="destinationHeader">
        <h2>
          {showTransferSetup && setupStep === "destination"
            ? "How 2 U want 2 sync it?!"
            : "Witch music 2 U want 2 sync?!"}
        </h2>
      </div>

      {showTransferSetup && (
        <>
          {setupStep === "destination" ? (
            <div className="transferSetupStep destinationStepPanel" key="destination-step">
              <div className="destinationStepContent">
                <div className="destinationStepControls">
                  <div className="transferModeRow">
                    <button
                      className={destinationMode === "new" ? "selectedMode" : "secondaryBtn"}
                      onClick={() => setDestinationMode("new")}
                    >
                      {text.transferToNew}
                    </button>

                    <button
                      className={destinationMode === "existing" ? "selectedMode" : "secondaryBtn"}
                      onClick={() => setDestinationMode("existing")}
                    >
                      {text.transferToExisting}
                    </button>
                  </div>
                </div>

                <div className="destinationMain">
                <div className="playlistCoverPicker">
                  <div className={`playlistCoverFrame${shouldDimCover ? " isDimmed" : ""}`}>
                    <img src={playlistCoverPreview} alt="" />

                    {destinationMode === "new" && (
                      <label className="coverOverlayBtn" aria-label="Change cover">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={choosePlaylistCover}
                        />
                        <img src="/IMAGE/logo/icon/upload.png" alt="" aria-hidden="true" />
                      </label>
                    )}
                  </div>

                  <div className={`playlistCoverDetails${shouldDimCover ? " isWaitingForPlaylist" : ""}`}>
                    <div className="destinationInputGroup">
                      {destinationMode === "new" ? (
                        <div
                          className="playlistNameField"
                          style={{ "--playlist-name-length": `${newPlaylistName.length || text.playlistName.length}ch` }}
                        >
                          <input
                            className="playlistNameInput"
                            value={newPlaylistName}
                            onChange={(event) => setNewPlaylistName(event.target.value)}
                            placeholder={text.playlistName}
                          />
                        </div>
                      ) : (
                        <select
                          className="playlistNameInput"
                          value={destinationPlaylistId}
                          onChange={(event) => setDestinationPlaylistId(event.target.value)}
                        >
                          <option value="">{text.destinationPlaylist}</option>
                          {destinationPlaylists.map((playlist) => (
                            <option value={playlist.id} key={playlist.id}>
                              {getPlaylistName(destinationPlatform.id, playlist)}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                  </div>
                </div>

                <div className="transferActionPanel">
                  <button
                    type="button"
                    className="startTransferBtn setupNextBtn"
                    onClick={onContinueToDestination ? () => setSetupStep("tracks") : startPlaylistTransfer}
                    disabled={onContinueToDestination ? !canContinueToTracks : !canStartTransfer}
                  >
                    {!onContinueToDestination && <span className="startTransferPulse" aria-hidden="true"></span>}
                    <span>{onContinueToDestination ? "Continue" : text.startTransfer}</span>
                  </button>

                  <section
                    className={`futureTransferStats${shouldDimCover ? " isWaitingForPlaylist" : ""}`}
                    aria-label="Future transfer stats"
                  >
                    <div className="futureSourceSummary">
                      <img className="futurePlaylistCover" src={sourcePlaylistCover} alt="" />
                      <div>
                        <p>{selectedSourcePlaylist ? getPlaylistName(sourcePlatform.id, selectedSourcePlaylist) : "Source playlist"}</p>
                        <span>
                          {sourcePlatform?.logo && <img src={sourcePlatform.logo} alt="" aria-hidden="true" />}
                          {sourcePlatform?.name || "Source"} · {selectedTrackCount} tracks 2 sync
                        </span>
                      </div>
                    </div>

                    <div className="futureTrackList">
                      {selectedTransferTracks.length > 0 ? (
                        selectedTransferTracks.map((track, index) => (
                          <p key={`${sourceTrackKey}:future:${index}`}>
                            {getTrackLabel(sourcePlatform.id, track)}
                          </p>
                        ))
                      ) : (
                        <p>No tracks selected</p>
                      )}
                    </div>
                  </section>
                </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="transferSetupStep tracksStepPanel" key="tracks-step">
              <div className="trackSelectionPanel">
                <div className="trackSelectionHeader">
                  <p>{text.transferTrackChoice}</p>
                  <button
                    type="button"
                    className="secondaryBtn trackSelectAllBtn"
                    onClick={toggleAllTracks}
                    disabled={sourceTracksLoading || Boolean(sourceTracksError) || visibleTrackKeys.length === 0}
                  >
                    {areAllTracksSelected ? "Deselect all" : "Select all"}
                  </button>
                  <span>{selectedTrackCount}/{sourceTracks.length}</span>
                </div>

                <div className="trackChoiceList">
                  {sourceTracksLoading && <p>{text.loadingTracks}</p>}
                  {sourceTracksError && <p className="trackChoiceError">{sourceTracksError}</p>}
                  {!sourceTracksLoading && !sourceTracksError && visibleSourceTracks.map((track, index) => {
                    const trackKey = `${sourceTrackKey}:${index}`;
                    const isSelected = selectedTrackKeys.includes(trackKey);

                    return (
                      <label className="trackChoiceItem" key={trackKey}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectedTrack(trackKey)}
                        />
                        <span>{getTrackLabel(sourcePlatform.id, track)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <p className="transferLimit">{transferLimit}</p>

              {destinationPlatform?.id === "youtube" && (
                <label className="reviewTransferToggle">
                  <input
                    type="checkbox"
                    checked={Boolean(reviewBeforeTransfer)}
                    onChange={(event) => setReviewBeforeTransfer?.(event.target.checked)}
                  />
                  <span>{text.reviewBeforeTransfer}</span>
                </label>
              )}

              <div className="setupActionRow">
                {onContinueToDestination ? (
                  <button
                    className="startTransferBtn"
                    onClick={onContinueToDestination}
                    disabled={selectedTrackCount === 0}
                  >
                    <span>Continue</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="secondaryBtn setupBackBtn"
                      onClick={() => setSetupStep("destination")}
                    >
                      Back
                    </button>

                    <button
                      className="startTransferBtn"
                      onClick={startPlaylistTransfer}
                      disabled={!canStartTransfer}
                    >
                      <span>{text.startTransfer}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {transferError && <p className="error transferError">{transferError}</p>}

      {transferLoading && (
        <div className="transferProgress" role="status" aria-live="polite">
          <span className="transferProgressPulse" aria-hidden="true"></span>

          <div>
            <strong>{text.transferLoading}</strong>
            <p>{transferStatus}</p>
          </div>

          <button type="button" className="transferStopBtn" onClick={stopTransfer}>
            {text.stopTransfer}
          </button>
        </div>
      )}

      {transferReview && !transferLoading && (
        <div className="transferReview">
          <div className="transferResultHeader">
            <h3>{text.transferReviewingMatches}</h3>
          </div>

          <div className="transferReviewList">
            {reviewMatches.map((match, index) => (
              <label className="transferReviewItem" key={`${match.videoId}-${index}`}>
                <input
                  type="checkbox"
                  checked={match.approved !== false}
                  onChange={() => toggleReviewMatch(index)}
                />
                <span>
                  <strong>{match.label}</strong>
                  <em>{match.destinationLabel || "No match"}</em>
                </span>
              </label>
            ))}
          </div>

          <div className="setupActionRow">
            <button
              type="button"
              className="secondaryBtn setupBackBtn"
              onClick={cancelReviewedTransfer}
            >
              {text.cancelReviewedTransfer}
            </button>

            <button
              type="button"
              className="startTransferBtn"
              onClick={() => confirmReviewedTransfer?.(reviewMatches)}
              disabled={!reviewMatches.some((match) => match.approved !== false)}
            >
              <span>{text.confirmReviewedTransfer}</span>
            </button>
          </div>
        </div>
      )}

      {transferResult && (
        <div className="transferResult">
          <div className="transferResultHeader">
            <h3>{text.transferDone}</h3>

            {canRetryFailed && (
              <button
                type="button"
                className="retryFailedBtn"
                onClick={retryFailedTransfer}
              >
                {text.retryFailedTracks}
              </button>
            )}
          </div>

          <div className="transferResultSummary">
            <div className="resultStat addedStat">
              <strong>{transferResult.added.length}</strong>
              <span>{text.addedTracks}</span>
            </div>

            <div className="resultStat failedStat">
              <strong>{transferResult.failed.length}</strong>
              <span>{text.failedTracks}</span>
            </div>

            <div className="resultStat alreadyStat">
              <strong>{transferResult.already.length}</strong>
              <span>{text.alreadyTracks}</span>
            </div>
          </div>

          <div className="transferResultLists">
            <section className="resultListGroup addedGroup">
              <h4>Added</h4>
              {transferResult.added.length > 0 ? (
                <ol>
                  {transferResult.added.map((track, index) => (
                    <li key={`added-${track}-${index}`}>{track}</li>
                  ))}
                </ol>
              ) : (
                <p>None</p>
              )}
            </section>

            <section className="resultListGroup failedGroup">
              <h4>Failed</h4>
              {transferResult.failed.length > 0 ? (
                <ol>
                  {transferResult.failed.map((track, index) => (
                    <li key={`failed-${track}-${index}`}>{track}</li>
                  ))}
                </ol>
              ) : (
                <p>None</p>
              )}
            </section>

            <section className="resultListGroup alreadyGroup">
              <h4>Already There</h4>
              {transferResult.already.length > 0 ? (
                <ol>
                  {transferResult.already.map((track, index) => (
                    <li key={`already-${track}-${index}`}>{track}</li>
                  ))}
                </ol>
              ) : (
                <p>None</p>
              )}
            </section>
          </div>
        </div>
      )}

      {transferStarted && (
        <button
          className="startTransferBtn restartTransferBtn"
          onClick={returnToMenu || restartTransferFlow}
        >
          <span>{text.restartTransfer}</span>
        </button>
      )}
    </section>
  );
}

export default StartTransfer;
