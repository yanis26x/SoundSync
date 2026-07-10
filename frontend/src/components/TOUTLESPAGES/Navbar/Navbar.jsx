import { useState } from "react";
import CustomModal from "./CustomModal/CustomModal";
import "./Navbar.css";

function Navbar({
  themes,
  currentTheme,
  setCurrentTheme,
  soundSettings,
  setSoundSettings,
  onPreviewNotification,
  onOpenInfo,
  onOpenProfile,
  onOpenTransfer,
  infoLabel = "INFO",
  profileLabel = "PROFIL",
  transferLabel = "Transfer",
  isTransferActive = false,
  isTransferLoading = false,
  transferStatus = "",
  showTransferButton = true,
  showInfoButton = true,
  showProfileButton = true,
  showThemeButton = true,
}) {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isCustomModalClosing, setIsCustomModalClosing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const normalizedTransferLabel = transferLabel.toUpperCase();

  const openCustomModal = () => {
    setIsMobileMenuOpen(false);
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

        {isTransferLoading && (
          <div className="siteNavbarTransferLoader" role="status" aria-live="polite">
            <div className="siteNavbarTransferLoaderBars" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>

            <div className="siteNavbarTransferLoaderText">
              <strong>Transfer in progress</strong>
              <span>{transferStatus || "Preparing your playlist..."}</span>
            </div>

            <div className="siteNavbarTransferLoaderRail" aria-hidden="true">
              <span></span>
            </div>
          </div>
        )}

        <div className="siteNavbarActions">
          {showTransferButton && (
            <button
              type="button"
              className="siteNavbarBtn siteNavbarStartBtn isHome"
              onClick={onOpenTransfer || (() => {
                window.location.href = "/transfer";
              })}
              title={isTransferLoading ? transferStatus : "HOME"}
              aria-label="HOME"
            >
              <span
                className="siteNavbarBtnImage"
                style={{ "--icon-url": "url('/logo/icon/home.png')" }}
                aria-hidden="true"
              />
            </button>
          )}

          {(showInfoButton || showProfileButton || showThemeButton) && (
            <>
              <button
                type="button"
                className="siteNavbarMenuBtn"
                onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
              >
                ☰
              </button>

              <div className={`siteNavbarSecondaryActions ${isMobileMenuOpen ? "isOpen" : ""}`}>
                {showInfoButton && (
                  <button
                    type="button"
                    className="siteNavbarBtn"
                    onClick={onOpenInfo || (() => {
                      window.location.href = "/profil";
                    })}
                    title={infoLabel}
                    aria-label={infoLabel}
                  >
                    <span
                      className="siteNavbarBtnImage"
                      style={{ "--icon-url": "url('/logo/icon/info.png')" }}
                      aria-hidden="true"
                    />
                  </button>
                )}

                {showProfileButton && (
                  <button
                    type="button"
                    className="siteNavbarBtn siteNavbarProfileBtn"
                    onClick={onOpenProfile || (() => {
                      window.location.href = "/profil";
                    })}
                    title={profileLabel}
                    aria-label={profileLabel}
                  >
                    <span
                      className="siteNavbarBtnImage"
                      style={{ "--icon-url": "url('/logo/icon/profil.png')" }}
                      aria-hidden="true"
                    />
                    <span className="siteNavbarNotificationBadge" aria-label="1 notification">1</span>
                  </button>
                )}

                {showThemeButton && (
                  <button
                    type="button"
                    className="siteNavbarBtn"
                    onClick={openCustomModal}
                    title="CUSTOM"
                    aria-label="CUSTOM"
                  >
                    <span
                      className="siteNavbarBtnImage"
                      style={{ "--icon-url": "url('/logo/icon/custom.png')" }}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            </>
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
          onPreviewNotification={onPreviewNotification}
          isOpen={isCustomModalOpen}
          isClosing={isCustomModalClosing}
          onClose={closeCustomModal}
        />
      )}
    </>
  );
}

export default Navbar;
