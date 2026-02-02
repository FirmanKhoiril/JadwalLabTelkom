import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLogin, setUserLogin] = useState(false)

  useEffect(() => {
    console.log("AuthProvider: Initializing...");
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("AuthProvider: onAuthStateChanged", user);
      setUser(user);
      setUserLogin(true)
      setLoading(false);
    }, (error) => {
      console.error("AuthProvider Error:", error);
      setLoading(false);
      setUserLogin(false)
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children} {/* Hapus !loading, render semua saat loading */}
    </AuthContext.Provider>
  );
};