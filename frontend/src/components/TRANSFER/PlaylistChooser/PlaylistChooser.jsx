import "./PlaylistChooser.css";

function PlaylistChooser({
  text,
  sourcePlatform,
  sourcePlatformLogo,
  platformDetails,
  playlists,
  selectedPlaylistId,
  getPlaylistImage,
  getPlaylistName,
  getPlaylistCount,
  onSelectPlaylist,
}) {
  return (
    <section className="playlistPickPanel transferFocusPanel">
      <div className="playlistChooserHeader">
        <div>
          <p>from {sourcePlatform.name}</p>
          <h2>#2 Choose a playlist</h2>
        </div>


      </div>

      {platformDetails.error && <p className="error">{platformDetails.error}</p>}

      {platformDetails.loading && (
        <p>{text.loadingPlaylists} {sourcePlatform.name}...</p>
      )}

      <div className="sourcePlaylistGrid">
        {playlists.map((playlist) => {
          const isSelected = selectedPlaylistId === playlist.id;

          return (
            <button
              className={`sourcePlaylistChoice${isSelected ? " selected" : ""}`}
              key={playlist.id}
              onClick={() => onSelectPlaylist(playlist)}
              style={{
                "--playlist-image": `url(${getPlaylistImage(sourcePlatform.id, playlist)})`,
              }}
            >
              <div className="playlistText">
                <span>{getPlaylistName(sourcePlatform.id, playlist)}</span>
                <small>{getPlaylistCount(sourcePlatform.id, playlist)} {text.tracks}</small>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default PlaylistChooser;
