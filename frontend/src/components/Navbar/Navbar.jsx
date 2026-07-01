import { useState } from "react";
import ThemeModal from "../ThemeModal/ThemeModal";
import "./Navbar.css";

function Navbar({
  themes,
  currentTheme,
  setCurrentTheme,
  onOpenProfile,
  onOpenTransfer,
  profileLabel = "Profile",
  transferLabel = "Transfer",
  showTransferButton = true,
  showProfileButton = true,
  showThemeButton = true,
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
          {showTransferButton && (
            <button
              type="button"
              className="siteNavbarBtn"
              onClick={onOpenTransfer || (() => {
                window.location.href = "/transfer";
              })}
            >
              <span className="siteNavbarBtnIcon" aria-hidden="true">🏠</span>
              <span>{transferLabel}</span>
            </button>
          )}

          {showProfileButton && (
            <button
              type="button"
              className="siteNavbarBtn"
              onClick={onOpenProfile || (() => {
                window.location.href = "/profil";
              })}
            >
              <span className="siteNavbarBtnIcon" aria-hidden="true">🧛🏻‍♀️</span>
              <span>{profileLabel}</span>
            </button>
          )}

          {showThemeButton && (
            <button
              type="button"
              className="siteNavbarBtn"
              onClick={openThemeModal}
            >
              <span className="siteNavbarBtnIcon" aria-hidden="true">⚙️</span>
              <span>Custom</span>
            </button>
          )}

        </div>
      </nav>

      {showThemeButton && (
        <ThemeModal
          themes={themes}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          isOpen={isThemeModalOpen}
          isClosing={isThemeModalClosing}
          onClose={closeThemeModal}
        />
      )}
    </>
  );
}

export default Navbar;
