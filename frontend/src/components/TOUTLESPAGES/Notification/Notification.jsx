import "./Notification.css";

function Notification({
  className = "",
  variant = "classic",
  title,
  message,
  added,
  failed,
  showStats = true,
  onClose,
}) {
  return (
    <div
      className={`transferDoneToast ${variant === "theme" ? "themeToast" : "classicToast"} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="transferDoneToastAvatarWrap">
        <img
          className="transferDoneToastAvatar"
          src="/IMAGE/utils/yanis26xPFP.jpg"
          alt="@yanis26x"
        />

        <span
          className="transferDoneToastOnline"
          aria-hidden="true"
        />
      </div>

      <div className="transferDoneToastContent">
        <div className="transferDoneToastHeader">
          <strong>@yanis26x</strong>
          <span>now</span>
        </div>

        <p>
          {showStats
            ? `${title}. ${message} ${added} added, ${failed} failed.`
            : `${title}. ${message}.`}
        </p>
      </div>

      <button
        type="button"
        className="transferDoneToastClose"
        onClick={onClose}
        aria-label="Close notification"
      >
        X
      </button>
    </div>
  );
}

export default Notification;
