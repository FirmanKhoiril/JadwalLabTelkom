import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import PostJadwal from "./pages/PostJadwal";
import LoginPage from './pages/LoginPage';
import Homepage from './pages/Homepage';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

function App() {
   const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path="/post-jadwal" element={<PostJadwal />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;