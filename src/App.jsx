import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { auth } from './firebase/config';
import PostJadwal from "./pages/PostJadwal";
import LoginPage from './pages/LoginPage';
import Homepage from './pages/Homepage';
import Navbar from './components/Navbar';
  
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path="/post-jadwal" element={
            user ? <PostJadwal /> : <Navigate to="/login" />
          } />
          <Route path="/login" element={
            user ? <Navigate to="/post-jadwal" /> : <LoginPage />
          } />
        </Routes>
         <PostJadwal />
      </div>
    </Router>
  );
}

export default App;