import "./MusicParticles.css";

const notes = ["♪", "♫", "♬", "♩", "♭", "♯"];
const particles = Array.from({ length: 24 }).map((_, index) => ({
  id: index,
  note: notes[index % notes.length],
  left: `${(index * 37) % 100}%`,
  animationDelay: `${(index * 0.7) % 8}s`,
  animationDuration: `${8 + ((index * 1.3) % 10)}s`,
}));

export default function MusicParticles() {
  return (
    <div className="musicParticles">
      {particles.map((particle) => (
        <span
          key={particle.id}
          style={{
            left: particle.left,
            animationDelay: particle.animationDelay,
            animationDuration: particle.animationDuration,
          }}
        >
          {particle.note}
        </span>
      ))}
    </div>
  );
}
