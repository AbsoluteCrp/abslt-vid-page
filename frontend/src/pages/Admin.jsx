import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function Admin() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
        const res = await axios.get('/api/admin/users', config);
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    if (user?.isAdmin) {
      fetchUsers();
    } else {
      setError('Acceso denegado. Solo administradores.');
      setLoading(false);
    }
  }, [user]);

  const toggleVerify = async (userId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const res = await axios.put(`/api/admin/users/${userId}/verify`, {}, config);
      
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isVerified: res.data.isVerified } : u
      ));
    } catch (err) {
      console.error('Error toggling verification', err);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Panel de Administración</h1>
      
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem' }}>Usuario</th>
              <th style={{ padding: '1rem' }}>Seguidores</th>
              <th style={{ padding: '1rem' }}>Admin</th>
              <th style={{ padding: '1rem' }}>Verificado</th>
              <th style={{ padding: '1rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {u.username}
                  {u.isVerified && <CheckCircle2 size={16} color="var(--primary)" />}
                </td>
                <td style={{ padding: '1rem' }}>{u.followerCount}</td>
                <td style={{ padding: '1rem' }}>{u.isAdmin ? 'Sí' : 'No'}</td>
                <td style={{ padding: '1rem' }}>
                  {u.isVerified ? 
                    <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={16} /> Sí
                    </span> : 
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <XCircle size={16} /> No
                    </span>
                  }
                </td>
                <td style={{ padding: '1rem' }}>
                  <button 
                    onClick={() => toggleVerify(u.id)}
                    className="btn btn-ghost"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    {u.isVerified ? 'Quitar Verificación' : 'Verificar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
