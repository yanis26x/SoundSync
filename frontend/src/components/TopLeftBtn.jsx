import "./TopLeftBtn.css";

function TopLeftBtn() {
  return (
    <a
      className="topLeftBtn"
      href="https://www.instagram.com/yanis26x"
      target="_blank"
      rel="noreferrer"
    >
      <div className="profileWrapper">
        <img
          src="/yanis26xPFP.jpg"
          alt="Yanis"
          className="topLeftProfileImg"
        />

        <span className="onlineIndicator"></span>
      </div>

      <div className="topLeftProfileText">
        <strong>@yanis26x</strong>
        <span></span>
      </div>
    </a>
  );
}

export default TopLeftBtn;