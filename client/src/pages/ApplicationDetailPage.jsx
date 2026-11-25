import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteApplication, fetchApplication } from '../api/applicationApi.js';
import { getErrorMessage, toAppError } from '../api/axios.js';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loading from '../components/Loading.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatDate } from '../utils/formatters.js';

// One label/value pair from the application record.
function DetailItem(props) {
  return (
    <div className="detail-item">
      <dt>{props.label}</dt>
      <dd>{props.children ? props.children : '—'}</dd>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Load the selected application from the API.
  useEffect(function () {
    let active = true;
    setLoading(true);
    setError('');
    setNotFound(false);

    fetchApplication(id)
      .then(function (data) {
        if (active) setApplication(data.data.application);
      })
      .catch(function (requestError) {
        if (!active) return;
        const appError = toAppError(requestError, 'Could not load this application.');
        if (appError.status === 404) {
          setNotFound(true);
        } else {
          setError(appError.message);
        }
      })
      .finally(function () {
        if (active) setLoading(false);
      });

    return function () { active = false; };
  }, [id, retryCount]);

  // Remove the record after the dialog has been confirmed.
  async function handleDelete() {
    setDeleting(true);
    setDeleteError('');

    try {
      await deleteApplication(id);
      navigate('/applications', { replace: true });
    } catch (requestError) {
      setDeleteError(getErrorMessage(requestError, 'Could not delete this application.'));
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (loading) {
    return <Loading fullPage message="Loading application…" />;
  }

  if (notFound) {
    return (
      <div className="page page-narrow">
        <div className="panel centered-panel">
          <h1>Application not found</h1>
          <p>This application may have been removed.</p>
          <Link className="button button-primary" to="/applications">Back to applications</Link>
        </div>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="page">
        <ErrorMessage message={error}
          onRetry={function () { setRetryCount(retryCount + 1); }} />
      </div>
    );
  }

  const app = application || {};

  return (
    <div className="page page-narrow">
      <div className="page-heading">
        <p className="eyebrow">Application details</p>
        <h1>{app.jobTitle || 'Untitled role'}</h1>
        <p className="page-subtitle">{app.company || 'Company not set'}</p>
      </div>

      <div className="detail-actions">
        <Link className="button button-secondary" to={'/applications/' + id + '/edit'}>Edit</Link>
        <button type="button" className="button button-danger-outline"
          onClick={function () { setConfirming(true); }}>
          Delete
        </button>
        <Link className="button button-ghost" to="/applications">Back to list</Link>
      </div>

      <ErrorMessage message={error} onRetry={function () { setRetryCount(retryCount + 1); }} />
      <ErrorMessage message={deleteError} title="Could not delete" />

      <section className="panel" aria-labelledby="details-heading">
        <h2 id="details-heading" className="panel-title">Role details</h2>
        <dl className="detail-grid">
          <DetailItem label="Job title">{app.jobTitle}</DetailItem>
          <DetailItem label="Company">{app.company}</DetailItem>
          <DetailItem label="Location">{app.location}</DetailItem>
          <DetailItem label="Employment type">{app.employmentType}</DetailItem>
          <DetailItem label="Date applied">{formatDate(app.dateApplied)}</DetailItem>
          <DetailItem label="Status"><StatusBadge status={app.status} /></DetailItem>
          <DetailItem label="Job posting">
            {app.postingUrl ? (
              <a href={app.postingUrl} target="_blank" rel="noreferrer">Open posting</a>
            ) : null}
          </DetailItem>
        </dl>
      </section>

      <section className="panel" aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="panel-title">Contact</h2>
        <dl className="detail-grid">
          <DetailItem label="Contact name">{app.contactName}</DetailItem>
          <DetailItem label="Contact email">
            {app.contactEmail ? <a href={'mailto:' + app.contactEmail}>{app.contactEmail}</a> : null}
          </DetailItem>
        </dl>
      </section>

      <section className="panel" aria-labelledby="dates-heading">
        <h2 id="dates-heading" className="panel-title">Follow-up and interview</h2>
        <dl className="detail-grid">
          <DetailItem label="Follow-up date">{formatDate(app.followUpDate)}</DetailItem>
          <DetailItem label="Interview date">{formatDate(app.interviewDate)}</DetailItem>
        </dl>
      </section>

      <section className="panel" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="panel-title">Notes</h2>
        <p className="detail-notes">{app.notes ? app.notes : 'No notes for this application yet.'}</p>
      </section>

      <ConfirmDialog
        open={confirming}
        title="Delete this application?"
        message={'This will permanently remove "' + (app.jobTitle || 'this application') +
          '" from your tracker. This cannot be undone.'}
        confirmLabel="Delete application"
        busy={deleting}
        onCancel={function () { setConfirming(false); }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
