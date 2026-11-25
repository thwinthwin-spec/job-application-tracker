import { STATUSES } from '../utils/constants.js';
import { getStatusCount } from '../utils/formatters.js';
import StatusBadge from './StatusBadge.jsx';

// Render the headline number and one card per status.
export default function StatsCards(props) {
  const total = props.total || 0;
  const byStatus = props.byStatus;

  return (
    <section className="stats-section" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="section-title">Your progress at a glance</h2>

      <div className="stats-grid">
        <article className="stat-card stat-card-total">
          <p className="stat-label">Total applications</p>
          <p className="stat-value">{total}</p>
          <p className="stat-footnote">All time</p>
        </article>

        {STATUSES.map(function (status) {
          return (
            <article className="stat-card" key={status}>
              <p className="stat-label">In status</p>
              <p className="stat-value">{getStatusCount(byStatus, status)}</p>
              <StatusBadge status={status} />
            </article>
          );
        })}
      </div>
    </section>
  );
}
