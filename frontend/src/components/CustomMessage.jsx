import "./CustomMessage.css";

function CustomMessage() {
  const openInstagram = () => {
    window.open(
      "https://www.instagram.com/yanis26x",
      "_blank"
    );
  };

  return (
    <div
      className="customMessage"
      onClick={openInstagram}
    >
      <img
        src="/image/yanis26xPFP.jpg"
        alt="Yanis"
        className="customMessageImg"
      />

      <div className="customMessageText">
        <h3>@yanis26x</h3>
        <p>always open to make new friends!</p>
      </div>
    </div>
  );
}

export default CustomMessage;





