import { useEffect, useRef, useState } from "react";
import "./CustomModal.css";

const previewSounds = {
  psp: new URL("../../../../../SOUND/sfx/psp.mp3", import.meta.url).href,
  hello: new URL("../../../../../SOUND/sfx/hello.mp3", import.meta.url).href,
  evilLaugh: new URL("../../../../../SOUND/sfx/evilLaugh.mp3", import.meta.url).href,
  oupsP4: new URL("../../../../../SOUND/sfx/oups-P4.wav", import.meta.url).href,
  touchP4: new URL("../../../../../SOUND/sfx/touch-P4.wav", import.meta.url).href,
  cancelKh: new URL("../../../../../SOUND/sfx/Cancel-kh.mp3", import.meta.url).href,
  miku: new URL("../../../../../SOUND/Miku/selectPlaylistMiku.mp3", import.meta.url).href,
};

const defaultSoundSettings = {
  notificationSound: "psp",
  notificationStyle: "classic",
  transferButtonSound: "touchP4",
  cancelButtonSound: "oupsP4",
  mikuVoiceEnabled: true,
  particlesEnabled: true,
};

function CustomModal({
  themes,
  currentTheme,
  setCurrentTheme,
  soundSettings = defaultSoundSettings,
  setSoundSettings = () => {},
  onPreviewNotification,
  isOpen,
  isClosing,
  onClose,
}) {
  const previewAudioRef = useRef(null);
  const [activeTab, setActiveTab] = useState("theme");

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
    { value: "evilLaugh", label: "Evil Laugh" },
    { value: "none", label: "Mute", isMute: true },
  ];

  const notificationStyleOptions = [
    { value: "classic", label: "White" },
    { value: "theme", label: "Theme" },
  ];

  const transferButtonSoundOptions = [
    { value: "oupsP4", label: "Oups P4" },
    { value: "touchP4", label: "Touch P4" },
    { value: "none", label: "Mute", isMute: true },
  ];

  const cancelButtonSoundOptions = [
    { value: "oupsP4", label: "Oups P4" },
    { value: "cancelKh", label: "Cancel KH" },
    { value: "none", label: "Mute", isMute: true },
  ];

  const renderOptionLabel = (option) =>
    option.isMute ? (
      <img className="customMuteIcon" src="/logo/icon/mute.png" alt="Mute" />
    ) : (
      <span>{option.label}</span>
    );

  const renderSelectedDot = () => (
    <span className="customSelectedDot" aria-label="Choisi" />
  );

  const tabs = [
    { id: "theme", label: "Theme" },
    { id: "sounds", label: "Sounds" },
    { id: "notification", label: "Notification" },
    { id: "voice", label: "Voice" },
    { id: "fx", label: "FX" },
  ];

  return (
    <div className={modalClassName} onClick={onClose}>
      <div
        className="customModal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="customModalHeader">
          <h2>Custom</h2>

          <div className="customModalTabs" role="tablist" aria-label="Custom settings">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`customModalTab ${
                  activeTab === tab.id ? "activeCustomTab" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            className="customModalClose"
            onClick={onClose}
            aria-label="Close custom modal"
          >
            ×
          </button>
        </div>

        {activeTab === "theme" && (
          <>
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
                  }}
                >
                  {theme.background ? (
                    <img src={theme.background} alt={theme.name} />
                  ) : (
                    <span
                      className="themeOptionPreview"
                      style={{ background: theme.backgroundColor || theme.cardBg }}
                      aria-hidden="true"
                    />
                  )}

                  <div>
                    <h3>{theme.name}</h3>
                    <p>{theme.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {activeTab === "sounds" && (
          <div className="customSoundSettings">
          <div className="customSoundRow">
            <div>
              <h4>Select</h4>
              <p>Select sound when you click on a button.(pr linstant juste sur Menu et Tranfer, A FAIRE DANS TOUTES LES PAGES!!)</p>
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
                    {renderOptionLabel(option)}
                    {soundSettings.transferButtonSound === option.value && (
                      renderSelectedDot()
                    )}
                  </button>

                  {option.value !== "none" && (
                    <button
                      type="button"
                      className="customSoundPreview"
                      onClick={(event) => {
                        event.stopPropagation();
                        playPreviewSound(option.value);
                      }}
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
              <h4>Cancel</h4>
              <p>Cancel sound when you click on a closing/hiding button.</p>
            </div>

            <div className="customSegmentedControl" aria-label="Cancel button sound">
              {cancelButtonSoundOptions.map((option) => (
                <div
                  key={option.value}
                  className={`customSoundOption ${
                    soundSettings.cancelButtonSound === option.value ? "selectedSoundOption" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="customSoundSelect"
                    onClick={() => updateSoundSetting("cancelButtonSound", option.value)}
                    aria-pressed={soundSettings.cancelButtonSound === option.value}
                  >
                    {renderOptionLabel(option)}
                    {soundSettings.cancelButtonSound === option.value && (
                      renderSelectedDot()
                    )}
                  </button>

                  {option.value !== "none" && (
                    <button
                      type="button"
                      className="customSoundPreview"
                      onClick={(event) => {
                        event.stopPropagation();
                        playPreviewSound(option.value);
                      }}
                      aria-label={`Play ${option.label}`}
                    >
                      ▶
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {activeTab === "notification" && (
          <div className="customSoundSettings">
          <div className="customSoundRow">
            <div>
              <h4>Sound Notification</h4>
              <p>The sound that plays when you get a notification.</p>
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
                    {renderOptionLabel(option)}
                    {soundSettings.notificationSound === option.value && (
                      renderSelectedDot()
                    )}
                  </button>

                  {option.value !== "none" && (
                    <button
                      type="button"
                      className="customSoundPreview"
                      onClick={(event) => {
                        event.stopPropagation();
                        playPreviewSound(option.value);
                      }}
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
              <h4>Color notification</h4>
              <p>Change the color of the notification.</p>
            </div>

            <div className="customSegmentedControl" aria-label="Notification color style">
              {notificationStyleOptions.map((option) => (
                <div
                  key={option.value}
                  className={`customSoundOption ${
                    soundSettings.notificationStyle === option.value ? "selectedSoundOption" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="customSoundSelect"
                    onClick={() => updateSoundSetting("notificationStyle", option.value)}
                    aria-pressed={soundSettings.notificationStyle === option.value}
                  >
                    {renderOptionLabel(option)}
                    {soundSettings.notificationStyle === option.value && (
                      renderSelectedDot()
                    )}
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="customSoundPreview customPreviewNotificationBtn"
                onClick={(event) => {
                  event.stopPropagation();
                  onPreviewNotification?.();
                }}
                aria-label="Preview notification"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
        )}

        {activeTab === "voice" && (
          <div className="customSoundSettings">
          <div className="customSoundRow">
            <div>
              <h4>Hatsune Miku</h4>
              <p>Voice that play to tell you what to do.</p>
            </div>

            <div className="customSegmentedControl" aria-label="Hatsune Miku voice">
              <div
                className={`customSoundOption ${
                  soundSettings.mikuVoiceEnabled ? "selectedSoundOption" : ""
                }`}
              >
                <button
                  type="button"
                  className="customSoundSelect"
                  onClick={() => updateSoundSetting("mikuVoiceEnabled", true)}
                  aria-pressed={soundSettings.mikuVoiceEnabled}
                >
                  <span>On</span>
                  {soundSettings.mikuVoiceEnabled && renderSelectedDot()}
                </button>
              </div>

              <div
                className={`customSoundOption ${
                  !soundSettings.mikuVoiceEnabled ? "selectedSoundOption" : ""
                }`}
              >
                <button
                  type="button"
                  className="customSoundSelect customIconOnlySelect"
                  onClick={() => updateSoundSetting("mikuVoiceEnabled", false)}
                  aria-pressed={!soundSettings.mikuVoiceEnabled}
                >
                  <img className="customMuteIcon" src="/logo/icon/mute.png" alt="Mute" />
                  {!soundSettings.mikuVoiceEnabled && renderSelectedDot()}
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === "fx" && (
          <div className="customSoundSettings">
          <div className="customSoundRow">
            <div>
              <h4>Particles</h4>
              <p>Show or hide the floating music notes in the background.</p>
            </div>

            <div className="customToggleGroup">
              <label className="customToggle">
                <input
                  type="checkbox"
                  checked={soundSettings.particlesEnabled !== false}
                  onChange={(event) =>
                    updateSoundSetting("particlesEnabled", event.target.checked)
                  }
                />
                <span>
                  {soundSettings.particlesEnabled !== false ? "On" : "Off"}
                </span>
                {soundSettings.particlesEnabled !== false && renderSelectedDot()}
              </label>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default CustomModal;
