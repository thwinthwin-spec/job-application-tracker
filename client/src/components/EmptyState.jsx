import { Link } from 'react-router-dom';

// A friendly placeholder for empty lists and empty search results.
export default function EmptyState(props) {
  const title = props.title || 'Nothing here yet';
  const message = props.message || 'There is no data to show right now.';

  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">◎</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {props.actionTo && props.actionLabel ? (
        <Link className="button button-primary button-small" to={props.actionTo}>
          {props.actionLabel}
        </Link>
      ) : null}
      {props.onAction && props.actionLabel ? (
        <button type="button" className="button button-ghost button-small" onClick={props.onAction}>
          {props.actionLabel}
        </button>
      ) : null}
    </div>
  );
}
