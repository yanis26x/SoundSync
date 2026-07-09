import { useEffect, useRef, useState } from "react";
import "./StartTransfer.css";

const whatMusicSound = new URL("../../../../SOUND/Miku/whatMusic.mp3", import.meta.url).href;
const orWhatSound = new URL("../../../../SOUND/Miku/Orwhat.mp3", import.meta.url).href;

function StartTransfer({
  text,
  destinationMode,
  setDestinationMode,
  newPlaylistName,
  setNewPlaylistName,
  destinationPlaylistId,
  setDestinationPlaylistId,
  destinationPlaylists,
  destinationPlatform,
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
  trackSelectionMode,
  setTrackSelectionMode,
  selectedTrackKeys,
  toggleSelectedTrack,
  getTrackLabel,
  startPlaylistTransfer,
  restartTransferFlow,
  returnToMenu,
  stopTransfer,
  transferResult,
  retryFailedTransfer,
  mikuVoiceEnabled = true,
}) {
  const [setupStep, setSetupStep] = useState("destination");
  const hasPlayedOrWhatSoundRef = useRef(false);
  const hasPlayedWhatMusicSoundRef = useRef(false);
  const sourceTrackKey =
    sourcePlatform && selectedSourcePlaylist
      ? `${sourcePlatform.id}:${selectedSourcePlaylist.id}`
      : "";
  const visibleSourceTracks = sourceTracks;
  const selectedTrackCount = selectedTrackKeys.filter((trackKey) =>
    trackKey.startsWith(`${sourceTrackKey}:`)
  ).length;
  const showTransferSetup = !transferStarted;
  const canContinueToTracks =
    destinationMode === "new" || Boolean(destinationPlaylistId);
  const canStartTransfer =
    selectedSourcePlaylist &&
    !transferLoading &&
    (trackSelectionMode !== "specific" || selectedTrackCount > 0) &&
    canContinueToTracks;
  const canRetryFailed =
    Boolean(transferResult?.failed?.length) && !transferLoading;

  useEffect(() => {
    if (!showTransferSetup || setupStep !== "tracks") {
      hasPlayedWhatMusicSoundRef.current = false;
      return;
    }

    if (!mikuVoiceEnabled || hasPlayedWhatMusicSoundRef.current) return;

    hasPlayedWhatMusicSoundRef.current = true;

    const audio = new Audio(whatMusicSound);
    audio.volume = 0.55;
    audio.play().catch(() => {});
  }, [mikuVoiceEnabled, setupStep, showTransferSetup]);

  useEffect(() => {
    if (!showTransferSetup || setupStep !== "destination") {
      hasPlayedOrWhatSoundRef.current = false;
      return;
    }

    if (!mikuVoiceEnabled || hasPlayedOrWhatSoundRef.current) return;

    hasPlayedOrWhatSoundRef.current = true;

    const audio = new Audio(orWhatSound);
    audio.volume = 0.55;
    audio.play().catch(() => {});
  }, [mikuVoiceEnabled, setupStep, showTransferSetup]);

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

              <div className="destinationInputGroup">
                {destinationMode === "new" ? (
                  <input
                    className="playlistNameInput"
                    value={newPlaylistName}
                    onChange={(event) => setNewPlaylistName(event.target.value)}
                    placeholder={text.playlistName}
                  />
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

              <button
                type="button"
                className="startTransferBtn setupNextBtn"
                onClick={() => setSetupStep("tracks")}
                disabled={!canContinueToTracks}
              >
                <span>Continue</span>
              </button>
            </div>
          ) : (
            <div className="transferSetupStep tracksStepPanel" key="tracks-step">
              <div className="trackSelectionPanel">
                <div className="trackSelectionHeader">
                  <p>{text.transferTrackChoice}</p>
                  <span>
                    {trackSelectionMode === "specific"
                      ? `${selectedTrackCount}/${sourceTracks.length}`
                      : `${sourceTracks.length} tracks`}
                  </span>
                </div>

                <div className="transferModeRow trackModeRow">
                  <button
                    type="button"
                    className={trackSelectionMode === "all" ? "selectedMode" : "secondaryBtn"}
                    onClick={() => setTrackSelectionMode("all")}
                  >
                    {text.transferAllTracks}
                  </button>

                  <button
                    type="button"
                    className={trackSelectionMode === "specific" ? "selectedMode" : "secondaryBtn"}
                    onClick={() => setTrackSelectionMode("specific")}
                  >
                    {text.transferSpecificTracks}
                  </button>
                </div>

                {trackSelectionMode === "specific" && (
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
                )}
              </div>

              <p className="transferLimit">{transferLimit}</p>

              <div className="setupActionRow">
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
