import { useEffect, useRef } from "react";
import "./CustomModal.css";

const previewSounds = {
  psp: new URL("../../../music/psp.mp3", import.meta.url).href,
  hello: new URL("../../../music/hello.mp3", import.meta.url).href,
  oupsP4: new URL("../../../music/oupsP4.wav", import.meta.url).href,
  touchP4: new URL("../../../music/touchP4.wav", import.meta.url).href,
  miku: new URL("../../../music/Miku/selectPlaylistMiku.mp3", import.meta.url).href,
};

const defaultSoundSettings = {
  notificationSound: "psp",
  transferButtonSound: "touchP4",
  mikuVoiceEnabled: true,
};

function CustomModal({
  themes,
  currentTheme,
  setCurrentTheme,
  soundSettings = defaultSoundSettings,
  setSoundSettings = () => {},
  isOpen,
  isClosing,
  onClose,
}) {
  const previewAudioRef = useRef(null);

  useEffect(() => {
    if (isOpen) return undefined;

    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
    }

    return undefined;
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (!previewAudioRef.current) return;

      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
    };
  }, []);

  if (!isOpen && !isClosing) {
    return null;
  }

  const modalClassName = `customModalOverlay ${isClosing ? "closing" : "open"}`;

  const updateSoundSetting = (settingKey, value) => {
    setSoundSettings((currentSettings) => ({
      ...currentSettings,
      [settingKey]: value,
    }));
  };

  const playPreviewSound = (soundKey) => {
    const sound = previewSounds[soundKey];
    if (!sound) return;

    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
    }

    const audio = new Audio(sound);
    audio.volume = 0.55;
    previewAudioRef.current = audio;
    audio.play().catch(() => {});
  };

  const notificationSoundOptions = [
    { value: "psp", label: "PSP" },
    { value: "hello", label: "hello" },
    { value: "none", label: "Rien" },
  ];

  const transferButtonSoundOptions = [
    { value: "oupsP4", label: "Oups P4" },
    { value: "touchP4", label: "Touch P4" },
    { value: "none", label: "Rien" },
  ];

  return (
    <div className={modalClassName} onClick={onClose}>
      <div
        className="customModal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="customModalHeader">
          <h2>Custom</h2>

          <button
            className="customModalClose"
            onClick={onClose}
            aria-label="Close custom modal"
          >
            ×
          </button>
        </div>

        <h3 className="customModalSectionTitle">Theme</h3>

        <div className="customModalGrid">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              className={`themeOption ${
                currentTheme === key ? "selectedTheme" : ""
              }`}
              onClick={() => {
                setCurrentTheme(key);
                onClose();
              }}
            >
              <img src={theme.background} alt={theme.name} />

              <div>
                <h3>{theme.name}</h3>
                <p>{theme.description}</p>
              </div>
            </button>
          ))}
        </div>

        <h3 className="customModalSectionTitle">Sons</h3>

        <div className="customSoundSettings">
          <div className="customSoundRow">
            <div>
              <h4>Notification</h4>
              <p>Son quand un transfert est fini.</p>
            </div>

            <div className="customSegmentedControl" aria-label="Notification sound">
              {notificationSoundOptions.map((option) => (
                <div
                  key={option.value}
                  className={`customSoundOption ${
                    soundSettings.notificationSound === option.value ? "selectedSoundOption" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="customSoundSelect"
                    onClick={() => updateSoundSetting("notificationSound", option.value)}
                    aria-pressed={soundSettings.notificationSound === option.value}
                  >
                    <span>{option.label}</span>
                    {soundSettings.notificationSound === option.value && (
                      <strong>Choisi</strong>
                    )}
                  </button>

                  {option.value !== "none" && (
                    <button
                      type="button"
                      className="customSoundPreview"
                      onClick={() => playPreviewSound(option.value)}
                      aria-label={`Play ${option.label}`}
                    >
                      ▶
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="customSoundRow">
            <div>
              <h4>Boutons Transfer</h4>
              <p>Bruit quand tu cliques un bouton dans la page Transfer.</p>
            </div>

            <div className="customSegmentedControl" aria-label="Transfer button sound">
              {transferButtonSoundOptions.map((option) => (
                <div
                  key={option.value}
                  className={`customSoundOption ${
                    soundSettings.transferButtonSound === option.value ? "selectedSoundOption" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="customSoundSelect"
                    onClick={() => updateSoundSetting("transferButtonSound", option.value)}
                    aria-pressed={soundSettings.transferButtonSound === option.value}
                  >
                    <span>{option.label}</span>
                    {soundSettings.transferButtonSound === option.value && (
                      <strong>Choisi</strong>
                    )}
                  </button>

                  {option.value !== "none" && (
                    <button
                      type="button"
                      className="customSoundPreview"
                      onClick={() => playPreviewSound(option.value)}
                      aria-label={`Play ${option.label}`}
                    >
                      ▶
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="customSoundRow">
            <div>
              <h4>Hatsune Miku</h4>
              <p>Voix dans dialoguePersona.</p>
            </div>

            <div className="customToggleGroup">
              <label className="customToggle">
                <input
                  type="checkbox"
                  checked={soundSettings.mikuVoiceEnabled}
                  onChange={(event) =>
                    updateSoundSetting("mikuVoiceEnabled", event.target.checked)
                  }
                />
                <span>{soundSettings.mikuVoiceEnabled ? "On - Choisi" : "Off - Choisi"}</span>
              </label>

              <button
                type="button"
                className="customSoundPreview"
                onClick={() => playPreviewSound("miku")}
                aria-label="Play Hatsune Miku"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomModal;
