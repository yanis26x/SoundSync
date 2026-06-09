import { useState } from "react";
import ThemeModal from "./ThemeModal";

function TopRightActionBtn({
  themes,
  currentTheme,
  setCurrentTheme,
  language,
  setLanguage,
  onOpenProfile,
  profileLabel = "Profile",
}) {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isThemeModalClosing, setIsThemeModalClosing] = useState(false);
  const nextLanguage = language === "en" ? "fr" : "en";

  const openThemeModal = () => {
    setIsThemeModalClosing(false);
    setIsThemeModalOpen(true);
  };

  const closeThemeModal = () => {
    setIsThemeModalClosing(true);

    window.setTimeout(() => {
      setIsThemeModalOpen(false);
      setIsThemeModalClosing(false);
    }, 200);
  };

  return (
    <>
      <div className="topRightActionBtn">

          <button
          className="profileBtn"
          onClick={onOpenProfile}
        >
          {profileLabel}
        </button>

        <button
          className="themeBtn"
          onClick={openThemeModal}
        >
          Theme
        </button>

        <button
          className="languageBtn"
          onClick={() => setLanguage(nextLanguage)}
        >
          {language.toUpperCase()}
        </button>

      </div>

      <ThemeModal
        themes={themes}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        isOpen={isThemeModalOpen}
        isClosing={isThemeModalClosing}
        onClose={closeThemeModal}
      />
    </>
  );
}

export default TopRightActionBtn;
