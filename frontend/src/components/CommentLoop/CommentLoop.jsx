import { useEffect, useState } from "react";
import "./CommentLoop.css";

const comments = [
  {
    quote: "super facile, j'ai pu transférer mes playlists en quelques clics !",
    name: "Nassim Djenadi",
    role: "Professional DJ",
    avatar: "/yanis26xPFP.jpg",
  },
  {
    quote: "NaNa 0 HaTch1",
    name: "Hi-c",
    role: "em0cha0666xd",
    avatar: "/yanis26xPFP2.jpg",
  },
  {
    quote: "idk",
    name: "name",
    role: "Music lover",
    avatar: "/yanis26xPFP.jpg",
  },
];

function CommentLoop() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeComment = comments[activeIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % comments.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="commentLoopPanel" aria-label="User comments">
      <div className="commentLoopContent" key={activeComment.name}>
        <p>{activeComment.quote}</p>

        <div className="commentAuthor">
          <img
            className="commentAvatar"
            src={activeComment.avatar}
            alt=""
            aria-hidden="true"
          />

          <div>
            <strong>{activeComment.name}</strong>
            <span>{activeComment.role}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CommentLoop;
