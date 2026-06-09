import "./ThemeModal.css";

function ThemeModal({
  themes,
  currentTheme,
  setCurrentTheme,
  isOpen,
  isClosing,
  onClose,
}) {
  if (!isOpen && !isClosing) {
    return null;
  }

  const modalClassName = `themeModalOverlay ${isClosing ? "closing" : "open"}`;

  return (
    <div className={modalClassName} onClick={onClose}>
      <div
        className="themeModal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="themeModalHeader">
          <h2>Choose theme</h2>

          <button
            className="themeModalClose"
            onClick={onClose}
            aria-label="Close theme modal"
          >
            ×
          </button>
        </div>

        <div className="themeModalGrid">
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
      </div>
    </div>
  );
}

export default ThemeModal;
