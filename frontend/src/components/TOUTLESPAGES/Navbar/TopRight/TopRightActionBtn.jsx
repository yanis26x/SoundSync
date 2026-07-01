import { useState } from "react";
import CustomModal from "../CustomModal/CustomModal";

function TopRightActionBtn({
  themes,
  currentTheme,
  setCurrentTheme,
  soundSettings,
  setSoundSettings,
  onOpenProfile,
  profileLabel = "Profile",
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
      <div className="topRightActionBtn">

        <button
          className="profileBtn"
          onClick={onOpenProfile || (() => {
            window.location.href = "/profil";
          })}
        >
          {profileLabel}
        </button>

        <button
          className="themeBtn"
          onClick={openCustomModal}
        >
          Theme
        </button>


      </div>

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
    </>
  );
}

export default TopRightActionBtn;
