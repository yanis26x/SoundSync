import "./HomeStart.css";

function HomeStart() {
  const openTransferPage = () => {
    window.location.href = "/transfer";
  };

  return (
    <section className="homeStartSection">
      <div className="homeStartContent">
        <div className="homeStartCopy">
          {/* <p className="homeStartEyebrow">Ready 2 sync?</p> */}
          <h2>
            Start your playlist <span>transfer</span>
          </h2>
          <p className="homeStartDescription">
            Choose your platforms, pick your playlist, and keep your music alive.
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