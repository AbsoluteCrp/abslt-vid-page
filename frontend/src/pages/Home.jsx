import { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('/api/videos');
        setVideos(res.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div>
      <div className="video-grid">
        {videos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
      {videos.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
          <p>No hay videos disponibles aún. ¡Sé el primero en subir uno!</p>
        </div>
      )}
    </div>
  );
}
