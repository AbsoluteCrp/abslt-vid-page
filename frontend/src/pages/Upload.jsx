import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Upload as UploadIcon } from 'lucide-react';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Debes iniciar sesión para subir videos.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/videos', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Hubo un error subiendo el video.');
      setUploading(false);
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '600px' }}>
      <h2 className="auth-title">Subir Video</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        
        <div 
          className="upload-area" 
          onClick={() => fileInputRef.current.click()}
        >
          <UploadIcon size={48} style={{ marginBottom: '1rem', color: 'var(--accent)' }} />
          {file ? (
            <p style={{ color: 'var(--text-main)', fontWeight: '500' }}>{file.name}</p>
          ) : (
            <p>Haz clic para seleccionar un video (.mp4)</p>
          )}
          <input 
            type="file" 
            accept="video/*" 
            ref={fileInputRef} 
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <input 
          type="text" 
          placeholder="Título del video" 
          className="input-field"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        
        <textarea 
          placeholder="Descripción (opcional)" 
          className="input-field"
          rows="4"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        
        <button 
          type="submit" 
          className="btn btn-accent" 
          style={{ marginTop: '1rem', padding: '0.75rem' }}
          disabled={uploading || !file || !title}
        >
          {uploading ? 'Subiendo...' : 'Publicar Video'}
        </button>
      </form>
    </div>
  );
}
