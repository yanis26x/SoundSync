import "./MusicParticles.css";

export default function MusicParticles() {
  const notes = ["♪", "♫", "♬", "♩", "♭", "♯"];

  return (
    <div className="musicParticles">
      {Array.from({ length: 24 }).map((_, index) => (
        <span
          key={index}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 10}s`,
          }}
        >
          {notes[index % notes.length]}
        </span>
      ))}
    </div>
  );
}