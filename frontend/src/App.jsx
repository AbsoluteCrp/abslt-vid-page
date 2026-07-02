import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
