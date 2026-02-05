import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, getDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDzWfGlfLDjgVu0rySSfmwTv0RssyfdnFo",
  authDomain: "jadwallab-4c1fa.firebaseapp.com",
  projectId: "jadwallab-4c1fa",
  storageBucket: "jadwallab-4c1fa.firebasestorage.app",
  messagingSenderId: "977754946146",
  appId: "1:977754946146:web:84fd0b064ced6481122f3b",
  measurementId: "G-MJ09ZKX6X8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

const scheduleCollection = collection(db, 'jadwal');

export const addSchedule = async (scheduleData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const firestoreData = {
      Dosen: scheduleData.dosen,
      Hari: scheduleData.hari,
      KeLas: scheduleData.kelas,
      Lab: scheduleData.lab,
      MatKul: scheduleData.matkul,
      Status: scheduleData.status,
      Waktu: scheduleData.waktu,
      userId: user.uid,
      userEmail: user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(scheduleCollection, firestoreData);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateSchedule = async (id, scheduleData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const scheduleRef = doc(db, 'jadwal', id);
    const scheduleDoc = await getDoc(scheduleRef);
    const schedule = scheduleDoc.data();
    
    if (schedule.userId !== user.uid) {
      throw new Error("Unauthorized: You can only update your own schedules");
    }
    
    const firestoreData = {
      Dosen: scheduleData.dosen,
      Hari: scheduleData.hari,
      KeLas: scheduleData.kelas,
      Lab: scheduleData.lab,
      MatKul: scheduleData.matkul,
      Status: scheduleData.status,
      Waktu: scheduleData.waktu,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(scheduleRef, firestoreData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteSchedule = async (id) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const scheduleRef = doc(db, 'jadwal', id);
    const scheduleDoc = await getDoc(scheduleRef);
    const schedule = scheduleDoc.data();
    
    if (schedule.userId !== user.uid) {
      throw new Error("Unauthorized: You can only delete your own schedules");
    }
    
    await deleteDoc(scheduleRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getSchedules = (callback) => {
  const q = query(scheduleCollection, orderBy('Hari', 'asc'), orderBy('Waktu', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const schedules = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      schedules.push({
        id: doc.id,
        lab: data.Lab || '',
        matkul: data.MatKul || '',
        kelas: data.KeLas || '',
        dosen: data.Dosen || '',
        waktu: data.Waktu || '',
        hari: data.Hari || '',
        status: data.Status || 'Akan Datang',
        userId: data.userId,
        userEmail: data.userEmail
      });
    });
    callback(schedules);
  });
};

export const getSchedulesByUser = (callback) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }
  
  const q = query(
    scheduleCollection, 
    where('userId', '==', user.uid),
    orderBy('Hari', 'asc'), 
    orderBy('Waktu', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const schedules = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      schedules.push({
        id: doc.id,
        lab: data.Lab || '',
        matkul: data.MatKul || '',
        kelas: data.KeLas || '',
        dosen: data.Dosen || '',
        waktu: data.Waktu || '',
        hari: data.Hari || '',
        status: data.Status || 'Akan Datang',
        userId: data.userId,
        userEmail: data.userEmail
      });
    });
    callback(schedules);
  });
};

export const getAllSchedulesForAdmin = (callback) => {
  const q = query(
    scheduleCollection,
    orderBy('Hari', 'asc'), 
    orderBy('Waktu', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const schedules = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      schedules.push({
        id: doc.id,
        lab: data.Lab || '',
        matkul: data.MatKul || '',
        kelas: data.KeLas || '',
        dosen: data.Dosen || '',
        waktu: data.Waktu || '',
        hari: data.Hari || '',
        status: data.Status || 'Akan Datang',
        userId: data.userId,
        userEmail: data.userEmail
      });
    });
    callback(schedules);
  });
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return { 
      success: true, 
      user: result.user,
      credential: GoogleAuthProvider.credentialFromResult(result)
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      code: error.code
    };
  }
};

export const getAllSchedules = () => {
  return new Promise((resolve, reject) => {
    const q = query(scheduleCollection, orderBy('Hari', 'asc'), orderBy('Waktu', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const schedules = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        schedules.push({
          id: doc.id,
          lab: data.Lab || '',
          matkul: data.MatKul || '',
          kelas: data.KeLas || '',
          dosen: data.Dosen || '',
          waktu: data.Waktu || '',
          hari: data.Hari || '',
          status: data.Status || 'Akan Datang',
          userId: data.userId,
          userEmail: data.userEmail
        });
      });
      resolve(schedules);
      unsubscribe();
    }, reject);
  });
};

export const getRealTimeSchedules = (callback) => {
  try {
    const q = query(scheduleCollection, orderBy('Hari', 'asc'));
    
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const schedules = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          schedules.push({
            id: doc.id,
            lab: data.Lab || '',
            matkul: data.MatKul || '',
            kelas: data.KeLas || '',
            dosen: data.Dosen || '',
            waktu: data.Waktu || '',
            hari: data.Hari || '',
            status: data.Status || 'Akan Datang',
            userId: data.userId,
            userEmail: data.userEmail
          });
        });
        
        const hariOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        schedules.sort((a, b) => {
          const hariCompare = hariOrder.indexOf(a.hari) - hariOrder.indexOf(b.hari);
          if (hariCompare !== 0) return hariCompare;
          return a.waktu.localeCompare(b.waktu);
        });
        
        callback(schedules);
      },
      (error) => {
        callback([]);
      }
    );
    
    return unsubscribe;
  } catch (error) {
    return () => {};
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export { db, auth };