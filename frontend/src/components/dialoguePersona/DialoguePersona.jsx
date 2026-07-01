import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./DialoguePersona.css";

const selectPlaylistMikuSound = new URL(
  "../../../music/Miku/selectPlaylistMiku.mp3",
  import.meta.url
).href;

// JE N'EST PAS ECRIT CE CODE MOI MEME, IL VIENT DINTENET!!!
//YANIS26X


export default function DialoguePersona({
  nom = "@yanis26x",
  texte = "ughhh yea!?",
  mikuVoiceEnabled = true,
}) {
  const [visible, setVisible] = useState(true);
  const [disparition, setDisparition] = useState(false);
  const [nombreLettres, setNombreLettres] = useState(0);

  useEffect(() => {
    if (!mikuVoiceEnabled) return undefined;

    const audio = new Audio(selectPlaylistMikuSound);
    audio.volume = 0.55;
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [mikuVoiceEnabled]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setNombreLettres(index);

      if (index >= texte.length) {
        clearInterval(interval);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [texte]);

  useEffect(() => {
    const delaiDisparition = setTimeout(() => {
      setDisparition(true);
    }, 5000);

    const retraitDialogue = setTimeout(() => {
      setVisible(false);
    }, 7000);

    return () => {
      clearTimeout(delaiDisparition);
      clearTimeout(retraitDialogue);
    };
  }, []);

  const texteAffiche = texte.slice(0, nombreLettres);

  if (!visible) {
    return null;
  }

  return createPortal(
    <div className={`dialoguePersona${disparition ? " dialoguePersonaDisparition" : ""}`}>
      <div className="bulleDialoguePersona">
        <button
          className="fermerDialoguePersona"
          onClick={() => setVisible(false)}
          aria-label="Fermer le dialogue"
        >
          X
        </button>

        <div className="nomDialoguePersona">{nom}</div>

        <p className="texteDialoguePersona">{texteAffiche}</p>
      </div>
    </div>,
    document.body
  );
}
