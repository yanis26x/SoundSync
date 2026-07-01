import "./HomeStart.css";

function HomeStart({ onOpenTransfer, isActivityVisible, onToggleActivity }) {
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
        <button
          type="button"
          className="homeActivityToggleBtn"
          onClick={onToggleActivity}
        >
          {isActivityVisible ? "Hide activity" : "Show activity"}
        </button>

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
        </div>
      </div>
    </section>
  );
}

export default HomeStart;
