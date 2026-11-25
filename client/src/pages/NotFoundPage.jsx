import { Link } from 'react-router-dom';

// Shown for any address that is not part of this app.
export default function NotFoundPage() {
  return (
    <div className="page">
      <section className="panel centered-panel">
        <p className="error-code" aria-hidden="true">404</p>
        <h1>Page not found</h1>
        <p>The page you were looking for does not exist or has moved.</p>
        <Link className="button button-primary" to="/dashboard">Go to dashboard</Link>
      </section>
    </div>
  );
}
