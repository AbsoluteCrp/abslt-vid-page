import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments/video/${videoId}`);
      setComments(res.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `/api/comments/video/${videoId}`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Debes iniciar sesión para comentar');
    }
  };

  return (
    <div className="comments-section">
      <h3 style={{ marginBottom: '1.5rem' }}>{comments.length} Comentarios</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="comment-input-container">
          <textarea 
            className="input-field" 
            rows="3" 
            placeholder="Añade un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-accent" disabled={!newComment.trim()}>
              Comentar
            </button>
          </div>
        </form>
      ) : (
        <div className="comment-input-container" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Inicia sesión para poder comentar</p>
        </div>
      )}

      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-avatar">
              {comment.user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="comment-content">
              <div className="comment-author">
                {comment.user?.username} 
                <span style={{ fontWeight: '400', fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="comment-text">{comment.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
