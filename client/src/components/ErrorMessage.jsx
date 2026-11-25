// A visible, accessible error box with an optional retry button.
export default function ErrorMessage(props) {
  if (!props.message) {
    return null;
  }

  const title = props.title || 'Something went wrong';

  return (
    <div className="error-message" role="alert">
      <span className="error-icon" aria-hidden="true">!</span>
      <div className="error-copy">
        <strong>{title}</strong>
        <p>{props.message}</p>
      </div>
      {props.onRetry ? (
        <button type="button" className="button button-ghost button-small" onClick={props.onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}
