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
        <span>Playlist from</span>
        <img src={sourcePlatformLogo || sourcePlatform.logo} alt={sourcePlatform.name} />
      </div>

      {platformDetails.error && (
        <p className="error">{platformDetails.error}</p>
      )}

      {platformDetails.loading && (
        <p>{text.loadingPlaylists} {sourcePlatform.name}...</p>
      )}

      <div className="sourcePlaylistGrid">
        {playlists.map((playlist) => {
          const isSelected = selectedPlaylistId === playlist.id;

          return (
            <button
              className={`sourcePlaylistChoice${sourcePlatform.id === "apple" ? " appleSourcePlaylistChoice" : ""}${isSelected ? " selected" : ""}`}
              key={playlist.id}
              onClick={() => onSelectPlaylist(playlist)}
              style={{
                "--playlist-image": `url(${getPlaylistImage(sourcePlatform.id, playlist)})`,
              }}
            >
              <img
                src={getPlaylistImage(sourcePlatform.id, playlist)}
                alt={getPlaylistName(sourcePlatform.id, playlist)}
              />
              <span>{getPlaylistName(sourcePlatform.id, playlist)}</span>
              <small>{getPlaylistCount(sourcePlatform.id, playlist)} {text.tracks}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default PlaylistChooser;
