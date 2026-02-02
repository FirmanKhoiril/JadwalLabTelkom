import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cek jika sudah login
  useEffect(() => {
    console.log("LoginPage: Checking initial auth state...");
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("LoginPage: Auth state changed - User:", user ? user.email : "null");
      if (user) {
        console.log("LoginPage: User already logged in, redirecting to /post-jadwal");
        navigate('/post-jadwal');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    console.log("=== STARTING GOOGLE LOGIN ===");
    
    try {
      const result = await signInWithGoogle();
      console.log("LoginPage: signInWithGoogle result:", result);
      
      if (result.success) {
        console.log("LoginPage: Login successful!");
        console.log("LoginPage: Auth currentUser after login:", auth.currentUser?.email);
        
        // Tunggu sebentar untuk memastikan auth state update
        setTimeout(() => {
          console.log("LoginPage: Redirecting after timeout...");
          navigate('/post-jadwal');
        }, 1000);
        
      } else {
        console.error("LoginPage: Login failed:", result);
        
        // Handle specific error codes
        if (result.code === 'auth/popup-blocked') {
          setError('Popup diblokir oleh browser. Izinkan popup untuk website ini.');
        } else if (result.code === 'auth/popup-closed-by-user') {
          setError('Login dibatalkan. Silakan coba lagi.');
        } else {
          setError(`Gagal login: ${result.error}`);
        }
      }
    } catch (err) {
      console.error("LoginPage: Unexpected error:", err);
      setError('Terjadi kesalahan tak terduga. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Test function untuk debugging
  const debugAuth = () => {
    console.log("=== DEBUG AUTH ===");
    console.log("Auth object:", auth);
    console.log("Current user:", auth.currentUser);
    console.log("Auth state (immediate):", auth.onAuthStateChanged);
    
    // Cek localStorage untuk Firebase auth data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.includes('firebase') || key.includes('auth')) {
        console.log(`LocalStorage ${key}:`, localStorage.getItem(key));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h1>
          <p className="text-gray-600">Sistem Jadwal Lab Teknik Telekomunikasi</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="font-medium text-gray-700">Memproses...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-semibold text-gray-800">Login dengan Google</span>
              </>
            )}
          </button>

          {/* Debug Button */}
          <button
            onClick={debugAuth}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
          >
            Debug Auth State
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold text-blue-600">Hanya Admin</span> yang diizinkan mengakses panel admin
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Kembali ke Halaman Jadwal
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;