import { useState } from "react";
import ThemeModal from "../ThemeModal/ThemeModal";
import StatusOfTransfer from "../StatusOfTransfer/StatusOfTransfer";
import "./Navbar.css";

function Navbar({
  themes,
  currentTheme,
  setCurrentTheme,
  onOpenProfile,
  profileLabel = "Profile",
  onResetPlatformChoice,
  resetLabel = "Reset",
  sourcePlatform,
  destinationPlatform,
  showTransferStatus = true,
}) {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isThemeModalClosing, setIsThemeModalClosing] = useState(false);

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
      <nav className="siteNavbar" aria-label="Main navigation">
        <a className="siteNavbarBrand" href="/">
          <span className="siteNavbarTitle">SoundSync</span>
          <span className="siteNavbarSubtitle">Transfer Anywhere, Sync Everthing</span>
        </a>

        <div className="siteNavbarActions">
          {showTransferStatus && (
            <StatusOfTransfer
              sourcePlatform={sourcePlatform}
              destinationPlatform={destinationPlatform}
              onReset={onResetPlatformChoice}
              resetLabel={resetLabel}
            />
          )}

          <button
            type="button"
            className="siteNavbarBtn"
            onClick={onOpenProfile || (() => {
              window.location.href = "/profil";
            })}
          >
            {profileLabel}
          </button>

          <button
            type="button"
            className="siteNavbarBtn"
            onClick={openThemeModal}
          >
            Theme
          </button>

        </div>
      </nav>

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

export default Navbar;
