import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function VideoCard({ video }) {
  return (
    <Link to={`/video/${video.id}`} className="video-card">
      <div className="video-thumbnail-container">
        <Play size={48} color="rgba(255,255,255,0.2)" />
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <div className="video-meta">
          <span>{video.user?.username || 'Usuario'}</span>
          <span> • </span>
          <span>{video.views} vistas</span>
        </div>
      </div>
    </Link>
  );
}
