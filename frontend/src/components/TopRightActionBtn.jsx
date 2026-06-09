function TopRightActionBtn({
  themes,
  currentTheme,
  setCurrentTheme,
  language,
  setLanguage,
}) {
  const nextLanguage = language === "en" ? "fr" : "en";

  return (
    <div className="topRightActionBtn">
      {Object.entries(themes).map(([key, theme]) => (
        <button
          key={key}
          className={`themeBtn ${currentTheme === key ? "activeTheme" : ""}`}
          onClick={() => setCurrentTheme(key)}
        >
          {theme.name}
        </button>
      ))}

      <button
        className="languageBtn"
        onClick={() => setLanguage(nextLanguage)}
      >
        {language.toUpperCase()}
      </button>
    </div>
  );
}

export default TopRightActionBtn;
