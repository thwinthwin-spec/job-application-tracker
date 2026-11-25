import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/axios.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { DEMO_ACCOUNTS } from '../utils/constants.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Show a clear message for the first problem we find.
  function validate() {
    if (name.trim().length < 2) {
      return 'Please enter a name with at least 2 characters.';
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (password.length < 8) {
      return 'Your password needs at least 8 characters.';
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return 'Use at least one uppercase letter, one lowercase letter and one number.';
    }
    if (password !== confirmPassword) {
      return 'The two passwords do not match.';
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
      await register({
        name: name.trim(),
        email: email.trim(),
        password: password,
      });
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Could not create your account. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  // Copy a demo account into the form as a quick example.
  function fillDemo(account) {
    setName(account.name);
    setEmail(account.email);
    setPassword(account.password);
    setConfirmPassword(account.password);
    setError('');
  }

  return (
    <div className="auth-layout">
      <section className="auth-card">
        <div className="auth-intro">
          <p className="eyebrow">Get started</p>
          <h1>Create your account</h1>
          <p>Make a free demo account to explore the tracker.</p>
        </div>

        <ErrorMessage message={error} title="Could not register" />

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="register-name">Name</label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={function (event) { setName(event.target.value); }}
              disabled={submitting}
            />
          </div>

          <div className="form-field">
            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={function (event) { setEmail(event.target.value); }}
              disabled={submitting}
            />
          </div>

          <div className="form-field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={function (event) { setPassword(event.target.value); }}
              disabled={submitting}
            />
            <p className="field-hint">Use an uppercase letter, a lowercase letter and a number.</p>
          </div>

          <div className="form-field">
            <label htmlFor="register-confirm">Confirm password</label>
            <input
              id="register-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={function (event) { setConfirmPassword(event.target.value); }}
              disabled={submitting}
            />
          </div>

          <button type="submit" className="button button-primary button-block" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="demo-block">
          <p className="demo-title">Prefer to look around first?</p>
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
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>

      <aside className="auth-aside" aria-label="About this app">
        <h2>Your search, organised</h2>
        <ul className="feature-list">
          <li>Track statuses from saved to offer in a few clicks.</li>
          <li>Keep contact details and notes beside each role.</li>
          <li>Share a CSV export with a career coach or mentor.</li>
        </ul>
        <p className="aside-note">Demo data only — please do not store real personal details.</p>
      </aside>
    </div>
  );
}
