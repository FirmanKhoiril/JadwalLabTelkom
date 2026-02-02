import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDzWfGlfLDjgVu0rySSfmwTv0RssyfdnFo",
  authDomain: "jadwallab-4c1fa.firebaseapp.com",
  projectId: "jadwallab-4c1fa",
  storageBucket: "jadwallab-4c1fa.firebasestorage.app",
  messagingSenderId: "977754946146",
  appId: "1:977754946146:web:84fd0b064ced6481122f3b",
  measurementId: "G-MJ09ZKX6X8"
};

console.log("Firebase Config: Initializing...");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Set persistence untuk menjaga login state
// import { setPersistence, browserLocalPersistence } from "firebase/auth";
// setPersistence(auth, browserLocalPersistence);

// Debug: Listen langsung ke auth state
onAuthStateChanged(auth, (user) => {
  console.log("🔥 Firebase DIRECT Auth State Changed:", user ? `User: ${user.email}` : "No user (null)");
});

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account' // Force account selection every time
});

// Collections
const scheduleCollection = collection(db, 'schedules');

// CRUD Operations
export const addSchedule = async (scheduleData) => {
  try {
    const docRef = await addDoc(scheduleCollection, {
      ...scheduleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding schedule: ", error);
    return { success: false, error: error.message };
  }
};

export const updateSchedule = async (id, scheduleData) => {
  try {
    const scheduleRef = doc(db, 'schedules', id);
    await updateDoc(scheduleRef, {
      ...scheduleData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating schedule: ", error);
    return { success: false, error: error.message };
  }
};

export const deleteSchedule = async (id) => {
  try {
    const scheduleRef = doc(db, 'schedules', id);
    await deleteDoc(scheduleRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting schedule: ", error);
    return { success: false, error: error.message };
  }
};

export const getSchedules = (callback) => {
  const q = query(scheduleCollection, orderBy('hari', 'asc'), orderBy('waktu', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const schedules = [];
    snapshot.forEach((doc) => {
      schedules.push({ id: doc.id, ...doc.data() });
    });
    callback(schedules);
  });
};

// Authentication - FIXED VERSION
export const signInWithGoogle = async () => {
  try {
    console.log("🚀 signInWithGoogle: Starting Google sign in...");
    
    // Force account selection and get additional scopes
    provider.addScope('email');
    provider.addScope('profile');
    
    const result = await signInWithPopup(auth, provider);
    console.log("✅ signInWithGoogle: Success!");
    console.log("   User:", result.user.email);
    console.log("   Access Token:", result.user.accessToken);
    
    // Cek auth state setelah login
    console.log("   Auth currentUser:", auth.currentUser?.email);
    
    return { 
      success: true, 
      user: result.user,
      credential: GoogleAuthProvider.credentialFromResult(result)
    };
  } catch (error) {
    console.error("❌ signInWithGoogle Error:", error);
    console.error("   Error Code:", error.code);
    console.error("   Error Message:", error.message);
    console.error("   Email:", error.email);
    console.error("   Credential:", error.credential);
    
    return { 
      success: false, 
      error: error.message,
      code: error.code
    };
  }
};

export const logout = async () => {
  try {
    console.log("Logging out...");
    await signOut(auth);
    console.log("Logged out successfully");
    return { success: true };
  } catch (error) {
    console.error("Error signing out: ", error);
    return { success: false, error: error.message };
  }
};

// Helper function untuk cek auth state
export const getCurrentUser = () => {
  return auth.currentUser;
};

export { db, auth };