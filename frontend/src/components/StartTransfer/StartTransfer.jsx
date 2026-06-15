import "./StartTransfer.css";

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
  transferLoading,
  transferStatus,
  transferLimit,
  selectedSourcePlaylist,
  startPlaylistTransfer,
  transferResult,
}) {
  return (
    <section className="destinationSetup transferFocusPanel">
      <div className="destinationHeader">
        <p>Destination setup</p>
        <h2>Start transfer</h2>
      </div>

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

      {transferError && <p className="error transferError">{transferError}</p>}

      {transferLoading && (
        <div className="transferProgress" role="status" aria-live="polite">
          <span className="transferProgressPulse" aria-hidden="true"></span>

          <div>
            <strong>{text.transferLoading}</strong>
            <p>{transferStatus}</p>
          </div>
        </div>
      )}

      <p className="transferLimit">{transferLimit}</p>

      <button
        className="startTransferBtn"
        onClick={startPlaylistTransfer}
        disabled={
          !selectedSourcePlaylist ||
          transferLoading ||
          (destinationMode === "existing" && !destinationPlaylistId)
        }
      >
        <span>{transferLoading ? text.transferLoading : text.startTransfer}</span>
      </button>

      {transferResult && (
        <div className="transferResult">
          <div className="transferResultHeader">
            <h3>{text.transferDone}</h3>
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
    </section>
  );
}

export default StartTransfer;