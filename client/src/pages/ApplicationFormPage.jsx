import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createApplication, fetchApplication, updateApplication } from '../api/applicationApi.js';
import { getErrorMessage, toAppError } from '../api/axios.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loading from '../components/Loading.jsx';
import { EMPLOYMENT_TYPES, STATUSES } from '../utils/constants.js';
import { getApplicationId, toDateInputValue } from '../utils/formatters.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A label, one control and an optional validation message.
function Field(props) {
  return (
    <div className="form-field">
      <label htmlFor={props.id}>{props.label}{props.required ? ' *' : ''}</label>
      {props.children}
      {props.error ? <p className="field-error" id={props.id + '-error'}>{props.error}</p> : null}
    </div>
  );
}

// A small text, date, email or URL input.
function TextField(props) {
  return (
    <Field id={props.id} label={props.label} required={props.required} error={props.error}>
      <input id={props.id} type={props.type || 'text'} value={props.value}
        placeholder={props.placeholder} disabled={props.disabled}
        onChange={function (event) { props.onChange(event.target.value); }} />
    </Field>
  );
}

// A select built from a simple list of string options.
function SelectField(props) {
  return (
    <Field id={props.id} label={props.label} error={props.error}>
      <select id={props.id} value={props.value} disabled={props.disabled}
        onChange={function (event) { props.onChange(event.target.value); }}>
        {props.options.map(function (option) {
          return <option value={option} key={option}>{option}</option>;
        })}
      </select>
    </Field>
  );
}

export default function ApplicationFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [postingUrl, setPostingUrl] = useState('');
  const [dateApplied, setDateApplied] = useState('');
  const [status, setStatus] = useState('Saved');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditing);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // When editing, load the saved values into the form.
  useEffect(function () {
    if (!id) return;

    let active = true;
    setLoading(true);
    setLoadError('');

    fetchApplication(id)
      .then(function (data) {
        if (!active) return;
        const app = data.data.application;
        setJobTitle(app.jobTitle || '');
        setCompany(app.company || '');
        setLocation(app.location || '');
        setEmploymentType(app.employmentType || 'Full-time');
        setPostingUrl(app.postingUrl || '');
        setDateApplied(toDateInputValue(app.dateApplied));
        setStatus(app.status || 'Saved');
        setContactName(app.contactName || '');
        setContactEmail(app.contactEmail || '');
        setNotes(app.notes || '');
        setFollowUpDate(toDateInputValue(app.followUpDate));
        setInterviewDate(toDateInputValue(app.interviewDate));
      })
      .catch(function (requestError) {
        if (!active) return;
        setLoadError(getErrorMessage(toAppError(requestError), 'Could not load this application.'));
      })
      .finally(function () {
        if (active) setLoading(false);
      });

    return function () { active = false; };
  }, [id, retryCount]);

  // Check required fields plus the optional URL and email values.
  function validate() {
    const nextErrors = {};
    if (!jobTitle.trim()) nextErrors.jobTitle = 'Please enter a job title.';
    if (!company.trim()) nextErrors.company = 'Please enter a company name.';
    if (!dateApplied) nextErrors.dateApplied = 'Please choose the date you applied.';
    if (contactEmail && !EMAIL_PATTERN.test(contactEmail.trim())) {
      nextErrors.contactEmail = 'Please enter a valid contact email.';
    }
    if (postingUrl && postingUrl.indexOf('http://') !== 0 && postingUrl.indexOf('https://') !== 0) {
      nextErrors.postingUrl = 'Start the link with http:// or https://.';
    }
    return nextErrors;
  }

  // Create a new record or save changes to the existing one.
  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0];
    if (firstError && document.getElementById(firstError)) {
      document.getElementById(firstError).focus();
    }
    if (firstError) return;

    const values = {
      jobTitle: jobTitle.trim(), company: company.trim(),
      location: location.trim(), employmentType: employmentType,
      postingUrl: postingUrl.trim(), dateApplied: dateApplied,
      status: status, contactName: contactName.trim(),
      contactEmail: contactEmail.trim(), notes: notes.trim(),
      followUpDate: followUpDate, interviewDate: interviewDate,
    };

    setSubmitting(true);
    setSubmitError('');

    try {
      let data;
      if (isEditing) {
        data = await updateApplication(id, values);
      } else {
        data = await createApplication(values);
      }
      const savedId = getApplicationId(data.data.application);
      navigate('/applications/' + savedId, { replace: true });
    } catch (requestError) {
      setSubmitError(getErrorMessage(requestError, 'Could not save this application.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading fullPage message="Loading the form…" />;

  if (loadError) {
    return (
      <div className="page">
        <ErrorMessage message={loadError}
          onRetry={function () { setRetryCount(retryCount + 1); }} />
      </div>
    );
  }

  const pageTitle = isEditing ? 'Edit application' : 'Add an application';
  const submitLabel = isEditing ? 'Save changes' : 'Save application';

  return (
    <div className="page page-narrow">
      <div className="page-heading">
        <p className="eyebrow">{isEditing ? 'Update details' : 'New entry'}</p>
        <h1>{pageTitle}</h1>
        <p className="page-subtitle">Fields marked * are required. Everything else is optional.</p>
      </div>

      <ErrorMessage message={submitError} title="Could not save" />

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <fieldset className="form-section">
          <legend>Role details</legend>
          <TextField id="jobTitle" label="Job title" required error={errors.jobTitle}
            value={jobTitle} onChange={setJobTitle} disabled={submitting} />
          <TextField id="company" label="Company" required error={errors.company}
            value={company} onChange={setCompany} disabled={submitting} />
          <div className="form-row">
            <TextField id="location" label="Location" placeholder="City or Remote"
              value={location} onChange={setLocation} disabled={submitting} />
            <SelectField id="employmentType" label="Employment type"
              options={EMPLOYMENT_TYPES} value={employmentType}
              onChange={setEmploymentType} disabled={submitting} />
          </div>
          <div className="form-row">
            <TextField id="dateApplied" label="Date applied" type="date" required
              error={errors.dateApplied} value={dateApplied}
              onChange={setDateApplied} disabled={submitting} />
            <SelectField id="status" label="Status"
              options={STATUSES} value={status} onChange={setStatus} disabled={submitting} />
          </div>
          <TextField id="postingUrl" label="Job posting URL" type="url" error={errors.postingUrl}
            placeholder="https://example.com/job" value={postingUrl}
            onChange={setPostingUrl} disabled={submitting} />
        </fieldset>
        <fieldset className="form-section">
          <legend>Contact (optional)</legend>
          <div className="form-row">
            <TextField id="contactName" label="Contact name"
              value={contactName} onChange={setContactName} disabled={submitting} />
            <TextField id="contactEmail" label="Contact email" type="email" error={errors.contactEmail}
              value={contactEmail} onChange={setContactEmail} disabled={submitting} />
          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Dates and notes (optional)</legend>
          <div className="form-row">
            <TextField id="followUpDate" label="Follow-up date" type="date"
              value={followUpDate} onChange={setFollowUpDate} disabled={submitting} />
            <TextField id="interviewDate" label="Interview date" type="date"
              value={interviewDate} onChange={setInterviewDate} disabled={submitting} />
          </div>
          <Field id="notes" label="Notes">
            <textarea id="notes" rows="5"
              placeholder="Anything you want to remember about this role…"
              value={notes} disabled={submitting}
              onChange={function (event) { setNotes(event.target.value); }} />
          </Field>
        </fieldset>
        <div className="form-actions">
          <button type="submit" className="button button-primary" disabled={submitting}>
            {submitting ? 'Saving…' : submitLabel}
          </button>
          <button type="button" className="button button-ghost"
            onClick={function () { navigate(-1); }} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
