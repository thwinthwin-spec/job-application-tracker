import { Navigate, useLocation } from 'react-router-dom';
import Loading from './Loading.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Keep private pages away from visitors who are not signed in.
export default function ProtectedRoute(props) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullPage message="Checking your session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return props.children;
}
