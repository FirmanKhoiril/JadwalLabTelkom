import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// 🔥 GANTI DENGAN KONFIGURASI FIREBASE ANDA
const firebaseConfig = {
  apiKey: "AIzaSyC1XJZ9x9Xx9Xx9Xx9Xx9Xx9Xx9Xx9Xx9Xx",
  authDomain: "jadwal-lab-telkom.firebaseapp.com",
  projectId: "jadwal-lab-telkom",
  storageBucket: "jadwal-lab-telkom.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

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

// Authentication
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Error signing in: ", error);
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Error signing out: ", error);
    return { success: false, error: error.message };
  }
};

export { db, auth };