import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./FirstVisitMikuModal.css";

const introStorageKey = "sound_sync_miku_intro_seen";
const introSound = new URL("../../../music/Miku/Turnheroff.mp3", import.meta.url).href;
const introDuration = 30000;
const maxSubtitleCharacters = 190;
const introText = `What's up! Welcome to SoundSync!
To help you out, I'll read what's on the screen, because I swear some people can't even read what's right in front of them and then say my app doesn't work.
I hope you burn in hell if you do that too. Stupid bitch.
Anyway, if you want me to shut up, click Custom at the top of the screen and turn Miku off.`;

export default function FirstVisitMikuModal() {
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem(introStorageKey) !== "true";
  });
  const [hasStarted, setHasStarted] = useState(false);
  const [visibleLetters, setVisibleLetters] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (!audioRef.current) return;

      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return undefined;

    const tickDuration = introDuration / introText.length;
    const textInterval = window.setInterval(() => {
      setVisibleLetters((currentCount) => {
        if (currentCount >= introText.length) {
          window.clearInterval(textInterval);
          return currentCount;
        }

        return currentCount + 1;
      });
    }, tickDuration);

    const closeTimeout = window.setTimeout(() => {
      localStorage.setItem(introStorageKey, "true");
      setIsVisible(false);
    }, introDuration);

    return () => {
      window.clearInterval(textInterval);
      window.clearTimeout(closeTimeout);
    };
  }, [hasStarted]);

  if (!isVisible) {
    return null;
  }

  const getVisibleSubtitle = () => {
    const textToCurrentPosition = introText.slice(0, visibleLetters);

    if (textToCurrentPosition.length <= maxSubtitleCharacters) {
      return textToCurrentPosition;
    }

    const subtitleStart = textToCurrentPosition.lastIndexOf(
      " ",
      textToCurrentPosition.length - maxSubtitleCharacters
    );

    return textToCurrentPosition.slice(Math.max(0, subtitleStart + 1));
  };

  const startIntro = () => {
    if (hasStarted) return;

    const audio = new Audio(introSound);
    audio.volume = 0.55;
    audioRef.current = audio;
    setHasStarted(true);
    audio.play().catch(() => {});
  };

  return createPortal(
    <div className="firstVisitMikuModal" role="dialog" aria-modal="true">
      <div className="firstVisitMikuBackdrop" aria-hidden="true"></div>

      <div className="firstVisitMikuContent">
        <img
          src="/SoundSync/SoundSyncLogo.png"
          alt="SoundSync"
          className="firstVisitMikuLogo"
        />

        {!hasStarted && (
          <p className="firstVisitMikuInstruction">
            Click on miku to hear what she have 2 say
          </p>
        )}

        {!hasStarted && (
          <button
            type="button"
            className="firstVisitMikuButton"
            onClick={startIntro}
            aria-label="Play Miku intro"
          >
            <img src="/miku-onion.webp" alt="Miku" />
          </button>
        )}
      </div>

      {hasStarted && (
        <div className="firstVisitMikuDialogue">
          <img src="/miku-onion.webp" alt="" aria-hidden="true" />

          <div className="firstVisitMikuBubble">
            <div className="nomDialoguePersona">@yanis26x</div>
            <p className="texteDialoguePersona">{getVisibleSubtitle()}</p>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
