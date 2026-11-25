import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/axios.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { DEMO_ACCOUNTS } from '../utils/constants.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check the form before calling the API.
  function validate() {
    if (!email.trim()) {
      return 'Please enter your email address.';
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!password) {
      return 'Please enter your password.';
    }
    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validate();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await login({ email: email.trim(), password: password });
      const state = location.state;
      const destination = state && state.from ? state.from : '/dashboard';
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Could not log in. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  // Fill the form with one of the seeded demo users.
  function fillDemo(account) {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  }

  return (
    <div className="auth-layout">
      <section className="auth-card">
        <div className="auth-intro">
          <p className="eyebrow">Welcome back</p>
          <h1>Log in to Job Tracker</h1>
          <p>Your applications, interviews and follow-ups in one calm place.</p>
        </div>

        <ErrorMessage message={error} title="Could not log in" />

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={function (event) { setEmail(event.target.value); }}
              disabled={submitting}
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={function (event) { setPassword(event.target.value); }}
              disabled={submitting}
            />
          </div>

          <button type="submit" className="button button-primary button-block" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <div className="demo-block">
          <p className="demo-title">Try a demo account</p>
          <p className="demo-help">These buttons fill in the details for you.</p>
          {DEMO_ACCOUNTS.map(function (account) {
            return (
              <button
                type="button"
                className="demo-button"
                key={account.email}
                onClick={function () { fillDemo(account); }}
                disabled={submitting}
              >
                <span className="demo-name">{account.label}</span>
                <span className="demo-email">{account.email}</span>
              </button>
            );
          })}
        </div>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>

      <aside className="auth-aside" aria-label="About this app">
        <h2>Stay on top of your search</h2>
        <ul className="feature-list">
          <li>See every application in one sortable list.</li>
          <li>Know what is coming up with follow-up and interview reminders.</li>
          <li>Export your data to CSV whenever you need a backup.</li>
        </ul>
        <p className="aside-note">Demo data only — please do not store real personal details.</p>
      </aside>
    </div>
  );
}
