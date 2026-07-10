import JumpingText from "../JumpingText/JumpingText";
import "./Socials.css";

const socials = [
  {
    title: "My Website",
    description: "Visit my site.",
    image: "/wallpaper/soraMusic.jpg",
    href: "https://yanis26x.github.io/yanis26x/",
  },
  {
    title: "SoundCloud",
    description: "Listen to my tracks.",
    image: "/ichigo/confetti.jpg",
    href: "https://soundcloud.com/yanis26x",
  },
  {
    title: "Instagram",
    description: "Follow my updates.",
    image: "/utils/yanis26xPFP2.jpg",
    href: "https://www.instagram.com/yanis26x/",
  },
  {
    title: "GitHub",
    description: "See my projects.",
    image: "/SoundSync/SoundSyncLogoNoBG2.png",
    href: "https://github.com/yanis26x",
  },
];

function Socials() {
  return (
    <section className="socialsSection" aria-labelledby="socialsTitle">
      <div className="socialsHeader">
        <p className="socialsHeaderText">
          <JumpingText text="I am allways open to make new friends!! @yanis26x on all socials." />
        </p>
        <h2 id="socialsTitle">My Socials</h2>
      </div>

      <div className="socialsGrid">
        {socials.map((social) => (
          <a
            className="socialCard"
            href={social.href}
            target="_blank"
            rel="noreferrer"
            key={social.title}
          >
            <img src={social.image} alt="" />
            <div className="socialCardText">
              <strong>{social.title}</strong>
              <span>{social.description}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Socials;
