import { Link } from 'react-router-dom';
import EmptyState from './EmptyState.jsx';
import Loading from './Loading.jsx';
import StatusBadge from './StatusBadge.jsx';
import { formatDate, getApplicationId } from '../utils/formatters.js';

// Show applications in a scrollable table with a link on each row.
export default function ApplicationTable(props) {
  const items = props.items;

  if (props.loading) {
    return <Loading message="Loading applications…" />;
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        title="No applications found"
        message={props.emptyMessage || 'Try changing your filters, or add a new application.'}
        actionLabel={props.emptyActionLabel}
        actionTo={props.emptyActionTo}
      />
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption className="visually-hidden">Job applications</caption>
        <thead>
          <tr>
            <th scope="col">Job title</th>
            <th scope="col">Company</th>
            <th scope="col">Status</th>
            <th scope="col">Date applied</th>
            <th scope="col">Location</th>
            <th scope="col">Type</th>
            <th scope="col"><span className="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map(function (item, index) {
            const id = getApplicationId(item);
            const linkTo = '/applications/' + id;

            return (
              <tr key={id || index}>
                <td>
                  <Link className="table-link" to={linkTo}>{item.jobTitle || 'Untitled role'}</Link>
                </td>
                <td>{item.company || '—'}</td>
                <td><StatusBadge status={item.status} /></td>
                <td>{formatDate(item.dateApplied)}</td>
                <td>{item.location || '—'}</td>
                <td>{item.employmentType || '—'}</td>
                <td className="table-actions">
                  <Link className="table-action" to={linkTo} aria-label={'View ' + (item.jobTitle || 'application')}>
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
