type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  compact?: boolean;
};

export function ErrorState({
  title = "Unable to load content",
  message,
  onRetry,
  compact = false,
}: ErrorStateProps) {
  return (
    <div
      className={`nx-error-state ${compact ? "nx-error-compact" : ""}`}
      role="alert"
    >
      <div className="nx-error-icon-box">
        <i className="bi bi-exclamation-triangle"></i>
      </div>
      <h3 className="nx-error-title">{title}</h3>
      {message && <p className="nx-error-message">{message}</p>}
      {onRetry && (
        <button
          type="button"
          className="nx-error-retry-btn"
          onClick={onRetry}
          aria-label="Retry"
        >
          <i className="bi bi-arrow-clockwise"></i>
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}

export default ErrorState;
