import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchStats } from '../api/applicationApi.js';
import { getErrorMessage } from '../api/axios.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loading from '../components/Loading.jsx';
import StatsCards from '../components/StatsCards.jsx';
import { formatDate, getApplicationId } from '../utils/formatters.js';

// One compact list used for both follow-ups and interviews.
function UpcomingList(props) {
  const items = props.items;

  if (!items || items.length === 0) {
    return <p className="muted">{props.emptyMessage}</p>;
  }

  return (
    <ul className="upcoming-list">
      {items.map(function (item, index) {
        const id = getApplicationId(item);
        const date = props.dateField === 'interviewDate' ? item.interviewDate : item.followUpDate;

        return (
          <li key={id || index}>
            <span className="upcoming-date">{formatDate(date)}</span>
            <span className="upcoming-copy">
              <Link to={'/applications/' + id}>{item.jobTitle || 'Untitled role'}</Link>
              <span>{item.company || 'Company not set'}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // Load the summary numbers whenever the retry counter changes.
  useEffect(function () {
    let active = true;
    setLoading(true);
    setError('');

    fetchStats()
      .then(function (data) {
        if (!active) {
          return;
        }
        setStats(data.data);
      })
      .catch(function (requestError) {
        if (!active) {
          return;
        }
        setError(getErrorMessage(requestError, 'Could not load your dashboard.'));
      })
      .finally(function () {
        if (active) {
          setLoading(false);
        }
      });

    return function () {
      active = false;
    };
  }, [retryCount]);

  function retry() {
    setRetryCount(retryCount + 1);
  }

  if (loading && !stats) {
    return <Loading fullPage message="Loading your dashboard…" />;
  }

  if (error && !stats) {
    return <ErrorMessage message={error} onRetry={retry} />;
  }

  const byStatus = stats ? stats.byStatus : null;
  const total = stats ? stats.total : 0;
  const followUps = stats ? stats.upcomingFollowUps : [];
  const interviews = stats ? stats.upcomingInterviews : [];

  return (
    <div className="page">
      <div className="page-heading page-heading-with-action">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Your dashboard</h1>
          <p className="page-subtitle">A quick look at where your job search stands.</p>
        </div>
        <Link className="button button-primary" to="/applications/new">+ Add application</Link>
      </div>

      {error ? <ErrorMessage message={error} onRetry={retry} /> : null}
      {loading ? <Loading message="Refreshing…" /> : null}

      <StatsCards total={total} byStatus={byStatus} />

      <div className="dashboard-columns">
        <section className="panel" aria-labelledby="followups-heading">
          <div className="panel-heading">
            <h2 id="followups-heading">Upcoming follow-ups</h2>
            <span className="panel-count" aria-label="Number of follow-ups">
              {followUps ? followUps.length : 0}
            </span>
          </div>
          <UpcomingList
            items={followUps}
            dateField="followUpDate"
            emptyMessage="No follow-ups scheduled. Nice work!"
          />
        </section>

        <section className="panel" aria-labelledby="interviews-heading">
          <div className="panel-heading">
            <h2 id="interviews-heading">Upcoming interviews</h2>
            <span className="panel-count" aria-label="Number of interviews">
              {interviews ? interviews.length : 0}
            </span>
          </div>
          <UpcomingList
            items={interviews}
            dateField="interviewDate"
            emptyMessage="No interviews on the calendar yet."
          />
        </section>
      </div>

      <section className="panel quick-links" aria-labelledby="quick-links-heading">
        <h2 id="quick-links-heading">Quick links</h2>
        <div className="quick-link-buttons">
          <Link className="button button-secondary" to="/applications">View all applications</Link>
          <Link className="button button-ghost" to="/applications/new">Track a new role</Link>
        </div>
      </section>
    </div>
  );
}
