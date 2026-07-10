import "./JumpingText.css";

function JumpingText({ text }) {
  return (
    <span className="jumpingText" aria-label={text}>
      {Array.from(text).map((character, index) => (
        <span
          className="jumpingTextLetter"
          style={{ "--jump-delay": `${index * 0.045}s` }}
          aria-hidden="true"
          key={`${character}-${index}`}
        >
          {character === " " ? "\u00A0" : character}
        </span>
      ))}
    </span>
  );
}

export default JumpingText;
