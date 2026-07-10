import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlaySquare, Upload, LogOut, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          <PlaySquare size={24} color="var(--accent)" />
          Abslt Vid
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              {user.isAdmin && (
                <Link to="/admin" className="btn btn-ghost" style={{ color: 'var(--primary)' }}>
                  Admin
                </Link>
              )}
              <Link to="/upload" className="btn btn-ghost">
                <Upload size={18} />
                Subir
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user.username}</span>
                <button onClick={handleLogout} className="btn btn-ghost" title="Cerrar Sesión">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Ingresar</Link>
              <Link to="/register" className="btn btn-primary">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
