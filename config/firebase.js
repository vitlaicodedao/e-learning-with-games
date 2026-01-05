import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDiGT3aKjuKRjzW2ZG4nnPnhSZ0V-msU6o",
  authDomain: "doan-79e5f.firebaseapp.com",
  projectId: "doan-79e5f",
  storageBucket: "doan-79e5f.firebasestorage.app",
  messagingSenderId: "673061549064",
  appId: "1:673061549064:web:ca6851c82c379aa0020dbd",
  measurementId: "G-ZGFNYB9VHL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
