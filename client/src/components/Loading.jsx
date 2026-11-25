// A small spinner used on its own or centered on a whole page.
export default function Loading(props) {
  const message = props.message || 'Loading…';

  if (props.fullPage) {
    return (
      <div className="loading-page" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true"></span>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="loading-inline" role="status" aria-live="polite">
      <span className="spinner spinner-small" aria-hidden="true"></span>
      <span>{message}</span>
    </div>
  );
}
