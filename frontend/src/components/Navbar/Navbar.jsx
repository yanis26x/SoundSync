import { useState } from "react";
import CustomModal from "../CustomModal/CustomModal";
import "./Navbar.css";

function Navbar({
  themes,
  currentTheme,
  setCurrentTheme,
  soundSettings,
  setSoundSettings,
  onOpenProfile,
  onOpenTransfer,
  profileLabel = "Profile",
  transferLabel = "Transfer",
  showTransferButton = true,
  showProfileButton = true,
  showThemeButton = true,
}) {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isCustomModalClosing, setIsCustomModalClosing] = useState(false);

  const openCustomModal = () => {
    setIsCustomModalClosing(false);
    setIsCustomModalOpen(true);
  };

  const closeCustomModal = () => {
    setIsCustomModalClosing(true);

    window.setTimeout(() => {
      setIsCustomModalOpen(false);
      setIsCustomModalClosing(false);
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
              onClick={openCustomModal}
            >
              <span className="siteNavbarBtnIcon" aria-hidden="true">⚙️</span>
              <span>Custom</span>
            </button>
          )}

        </div>
      </nav>

      {showThemeButton && (
        <CustomModal
          themes={themes}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          soundSettings={soundSettings}
          setSoundSettings={setSoundSettings}
          isOpen={isCustomModalOpen}
          isClosing={isCustomModalClosing}
          onClose={closeCustomModal}
        />
      )}
    </>
  );
}

export default Navbar;
