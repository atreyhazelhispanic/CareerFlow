import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to={isAuthenticated ? '/dashboard' : '/login'}>
        CareerFlow
      </Link>
      <div className="ms-auto d-flex gap-2">
        {isAuthenticated ? (
          <>
            <Link className="btn btn-outline-light btn-sm" to="/dashboard">
              Dashboard
            </Link>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-light btn-sm" to="/login">
              Login
            </Link>
            <Link className="btn btn-primary btn-sm" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
