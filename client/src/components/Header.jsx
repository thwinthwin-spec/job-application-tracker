import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getInitials } from '../utils/formatters.js';

// Give the active navigation link a highlight class.
function navClass(details) {
  if (details.isActive) {
    return 'nav-link active';
  }
  return 'nav-link';
}

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Clear the session and return to the login page.
  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Job Tracker home">
          <span className="brand-mark" aria-hidden="true">JT</span>
          <span className="brand-name">Job Tracker</span>
        </Link>

        <nav className="header-nav" aria-label="Main navigation">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
              <NavLink to="/applications" className={navClass}>Applications</NavLink>
              <NavLink to="/applications/new" className={navClass}>Add new</NavLink>
              <span className="header-user" title={user && user.name ? user.name : 'Account'}>
                <span className="avatar" aria-hidden="true">{getInitials(user && user.name)}</span>
                <span className="header-user-name">{user && user.name ? user.name : 'Account'}</span>
              </span>
              <button
                type="button"
                className="button button-ghost button-small"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>Log in</NavLink>
              <NavLink to="/register" className="button button-primary button-small">
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
