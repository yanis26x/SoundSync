const createBlackAccentTheme = ({
  name,
  description,
  accent,
  mid,
  end,
  text = "#f2fffd",
}) => ({
  name,
  description,
  background: "",
  backgroundColor: `
    radial-gradient(
      circle at 50% 45%,
      ${end} 0%,
      ${mid} 38%,
      #050505 72%,
      #000000 100%
    ),
    linear-gradient(
      180deg,
      #000000 0%,
      #000000 100%
    )
  `,
  cardBg: "rgba(0, 10, 9, 0.84)",
  border: `${accent}80`,
  accent,
  accentSoft: `${accent}29`,
  text,
});

export const themes = {
  tomo: {
    name: "Tomo",
    description: "Two girls looking at each other and smiling.",
    background: "/wallpaper/eyesContact.jpg",
    cardBg: "rgba(0, 0, 0, 0.68)",
    border: "rgb(249, 91, 0)",
    accent: "#fd4907",
    accentSoft: "rgba(255, 123, 0, 0.34)",
    text: "#fff7ea",
  },

  // sora: {
  //   name: "Sora",
  //   description: "Sora from Kingdom Hearts feeling the music flowing through his body.",
  //   background: "/wallpaper/soraMusic.jpg",
  //   cardBg: "rgba(0, 8, 42, 0.78)",
  //   border: "rgb(0, 42, 255)",
  //   accent: "#002aff",
  //   accentSoft: "rgba(0, 80, 255, 0.38)",
  //   text: "#eaf6ff",
  // },

  miku: {
    name: "Hastune Miku",
    description: "Hatsune Miku projetDIVA F - Playstation 3",
    background: "/wallpaper/Miku.jpg",
    cardBg: "rgba(2, 26, 36, 0.72)",
    border: "rgb(0, 255, 255)",
    accent: "#00ffd9",
    accentSoft: "rgb(0, 255, 179)",
    text: "#f2fdff",
  },

  noir: createBlackAccentTheme({
    name: "Turquoise",
    description: "Fond noir avec un léger dégradé turquoise.",
    accent: "#00ffd9",
    mid: "#000000",
    end: "#00ffd9",
  }),

  noirOrange: createBlackAccentTheme({
    name: "Orange",
    description: "Fond noir avec un léger dégradé orange.",
    accent: "#ff8800",
    mid: "#000000",
    end: "#ff8800",
    text: "#fff8ef",
  }),

  noirMauve: createBlackAccentTheme({
    name: "Purple",
    description: "Fond noir avec un léger dégradé mauve.",
    accent: "#8602fa",
    mid: "#000000",
    end: "#8602fa",
    text: "#fbf5ff",
  }),

  noirSilver: createBlackAccentTheme({
    name: "Silver",
    description: "Fond noir avec un léger dégradé silver.",
    accent: "#ffffff",
    mid: "#000000",
    end: "#ffffff",
    text: "#ffffff",
  }),

  noirRose: createBlackAccentTheme({
    name: "Pink",
    description: "Fond noir avec un léger dégradé rose.",
    accent: "#ff007b",
    mid: "#000000",
    end: "#ff0084",
    text: "#fff4fa",
  }),

  noirRouge: createBlackAccentTheme({
    name: "Red",
    description: "Fond noir avec un léger dégradé rouge.",
    accent: "#ff0000",
    mid: "#000000",
    end: "#ff0000",
    text: "#fff4f4",
  }),

};
