import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentSection from '../components/CommentSection';

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`/api/videos/${id}`);
        setVideo(res.data);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
    fetchVideo();
  }, [id]);

  if (!video) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;

  return (
    <div className="player-page">
      <div>
        <div className="video-container">
          <video 
            src={`/uploads/${video.filename}`} 
            controls 
            autoPlay 
          />
        </div>
        <div className="video-details">
          <h1 className="video-details-title">{video.title}</h1>
          <div className="video-details-meta">
            <span>Subido por <strong>{video.user?.username}</strong></span>
            <span>{video.views} vistas</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
          {video.description && (
            <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
              {video.description}
            </p>
          )}
        </div>
        
        <CommentSection videoId={video.id} />
      </div>
    </div>
  );
}
