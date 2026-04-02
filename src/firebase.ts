import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize anonymous auth
export const initAuth = async () => {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      if (error.code === 'auth/admin-restricted-operation') {
        console.error("Firebase Anonymous Auth is disabled. Please enable it in the Firebase Console (Authentication > Sign-in method).");
      } else {
        console.error("Error signing in anonymously:", error);
      }
      throw error; // Rethrow to allow UI handling
    }
  }
};

export { collection, addDoc, getDocs, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp, updateDoc, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, where };
