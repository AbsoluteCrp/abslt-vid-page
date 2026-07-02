import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        credential: credentialResponse.credential
      });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión con Google');
    }
  };

  const handleGoogleError = () => {
    setError('El inicio de sesión con Google falló');
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Iniciar Sesión</h2>
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input 
          type="text" 
          placeholder="Nombre de usuario" 
          className="input-field"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          className="input-field"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-accent" style={{ marginTop: '1rem', padding: '0.75rem' }}>
          Entrar
        </button>
      </form>
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="filled_black"
          shape="pill"
        />
      </div>
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        ¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--accent)' }}>Regístrate aquí</Link>
      </div>
    </div>
  );
}
