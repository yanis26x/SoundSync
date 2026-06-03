function ThemeSelector({ themes, currentTheme, setCurrentTheme }) {
  return (
    <div className="themeSelector">
      {Object.entries(themes).map(([key, theme]) => (
        <button
          key={key}
          className={`themeBtn ${currentTheme === key ? "activeTheme" : ""}`}
          onClick={() => setCurrentTheme(key)}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
}

export default ThemeSelector;