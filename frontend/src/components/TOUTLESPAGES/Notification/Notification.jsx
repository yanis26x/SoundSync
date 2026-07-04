import "./Notification.css";

function Notification({
  className = "",
  title,
  message,
  added,
  failed,
}) {
  return (
    <div
      className={`transferDoneToast ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="transferDoneToastAvatarWrap">
        <img
          className="transferDoneToastAvatar"
          src="/utils/yanis26xPFP.jpg"
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
          {title}. {message} {added} added, {failed} failed.
        </p>
      </div>
    </div>
  );
}

export default Notification;
