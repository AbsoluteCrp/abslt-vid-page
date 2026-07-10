import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2 } from 'lucide-react';
import CommentSection from '../components/CommentSection';
import { AuthContext } from '../context/AuthContext';

export default function VideoPlayer() {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [channelInfo, setChannelInfo] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchVideoAndChannel = async () => {
      try {
        const res = await axios.get(`/api/videos/${id}`);
        setVideo(res.data);
        
        if (res.data && res.data.userId) {
          const channelRes = await axios.get(`/api/users/${res.data.userId}`);
          setChannelInfo(channelRes.data);

          if (currentUser) {
            const subRes = await axios.get(`/api/users/${res.data.userId}/isSubscribed`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setIsSubscribed(subRes.data.isSubscribed);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchVideoAndChannel();
  }, [id, currentUser]);

  const handleSubscribe = async () => {
    if (!currentUser) return alert("Debes iniciar sesión para suscribirte.");
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      if (isSubscribed) {
        const res = await axios.post(`/api/users/${video.userId}/unsubscribe`, {}, config);
        setIsSubscribed(false);
        setChannelInfo(prev => ({ ...prev, followerCount: res.data.followerCount }));
      } else {
        const res = await axios.post(`/api/users/${video.userId}/subscribe`, {}, config);
        setIsSubscribed(true);
        setChannelInfo(prev => ({ ...prev, followerCount: res.data.followerCount }));
      }
    } catch (error) {
      console.error('Error in subscription:', error);
    }
  };

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
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Subido por <strong>{video.user?.username}</strong>
              {channelInfo?.isVerified && <CheckCircle2 size={16} color="var(--primary)" />}
            </span>
            {channelInfo && <span>{channelInfo.followerCount} suscriptores</span>}
            <span>{video.views} vistas</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            
            {currentUser && currentUser.id !== video.userId && (
              <button 
                onClick={handleSubscribe} 
                className={`btn ${isSubscribed ? 'btn-ghost' : 'btn-primary'}`}
                style={{ marginLeft: 'auto', padding: '0.3rem 0.8rem', fontSize: '0.9rem' }}
              >
                {isSubscribed ? 'Suscrito' : 'Suscribirse'}
              </button>
            )}
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
