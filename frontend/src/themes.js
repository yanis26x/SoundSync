const createBlackAccentTheme = ({
  name,
  description,
  accent,
  text = "#f2fffd",
}) => ({
  name,
  description,
  background: "",
  backgroundColor: `
    radial-gradient(ellipse at 50% 114%, color-mix(in srgb, var(--accent) 80%, transparent), transparent 40%),
    radial-gradient(circle at 16% 22%, color-mix(in srgb, var(--accent) 70%, transparent), transparent 30%),
    radial-gradient(circle at 88% 28%, color-mix(in srgb, var(--accent) 70%, transparent), transparent 28%),
    linear-gradient(#000000, #000000)
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
    background: "/IMAGE/ichigo/eyesContact.jpg",
    cardBg: "rgba(0, 0, 0, 0.68)",
    border: "rgb(249, 91, 0)",
    accent: "#fd4907",
    accentSoft: "rgba(255, 123, 0, 0.34)",
    text: "#fff7ea",
  },


  miku: {
    name: "Hastune Miku",
    description: "Hatsune Miku projetDIVA F - Playstation 3",
    background: "/IMAGE/wallpaper/Miku.jpg",
    cardBg: "rgba(2, 26, 36, 0.72)",
    border: "rgb(0, 255, 255)",
    accent: "#00ffd9",
    accentSoft: "rgb(0, 255, 179)",
    text: "#f2fdff",
  },


  noirMiku: {
    name: "Noir Miku",
    description: "Fond noir avec des lueurs turquoise Miku.",
    background: "",
    backgroundColor: `
      radial-gradient(ellipse at 50% 114%, color-mix(in srgb, #00ffd9 80%, transparent), transparent 40%),
      radial-gradient(circle at 16% 22%, color-mix(in srgb, #00ffd9 70%, transparent), transparent 30%),
      radial-gradient(circle at 88% 28%, color-mix(in srgb, #00ffd9 70%, transparent), transparent 28%),
      linear-gradient(#000000, #000000)
    `,
    cardBg: `
      linear-gradient(145deg, rgba(55, 113, 113, 0.16), transparent 28%),
      linear-gradient(0deg, rgba(0, 255, 217, 0.36) 0%, rgba(0, 255, 217, 0.16) 18%, rgba(0, 0, 0, 0.94) 48%),
      rgba(0, 0, 0, 0.94)
    `,
    border: "rgba(0, 255, 217, 0.42)",
    accent: "#00ffd9",
    accentSoft: "rgba(0, 255, 217, 0.16)",
    text: "#f2fdff",
  },

  noirBleuElectrique: {
    name: "Electric Blue",
    description: "Fond noir avec un bleu électrique subtil.",
    background: "",
    backgroundColor: "linear-gradient(#000000, #000000)",
    cardBg: "rgb(13, 0, 255)",
    border: "rgb(0, 0, 0)",
    accent: "#0026ff",
    accentSoft: "rgb(0, 0, 0)",
    text: "#f2f8ff",
    
  },

};
