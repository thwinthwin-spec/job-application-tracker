import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Loading from './components/Loading.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ApplicationListPage from './pages/ApplicationListPage.jsx';
import ApplicationFormPage from './pages/ApplicationFormPage.jsx';
import ApplicationDetailPage from './pages/ApplicationDetailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Send the visitor to the right first page based on their session.
function HomeRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullPage />;
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
}

// A small wrapper so each protected route stays easy to read.
function Protected(props) {
  return <ProtectedRoute>{props.children}</ProtectedRoute>;
}

export default function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header />

      <main id="main-content" className="app-main">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
          <Route path="/applications" element={<Protected><ApplicationListPage /></Protected>} />
          <Route path="/applications/new" element={<Protected><ApplicationFormPage /></Protected>} />
          <Route path="/applications/:id" element={<Protected><ApplicationDetailPage /></Protected>} />
          <Route path="/applications/:id/edit" element={<Protected><ApplicationFormPage /></Protected>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container">Demo project — sample data only.</div>
      </footer>
    </div>
  );
}
