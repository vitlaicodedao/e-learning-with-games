import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxZyH9fxQiL6kZIB-rNP3-5I9EJYTBlA4",
  authDomain: "khoaluan-2026.firebaseapp.com",
  projectId: "khoaluan-2026",
  storageBucket: "khoaluan-2026.firebasestorage.app",
  messagingSenderId: "1019302468978",
  appId: "1:1019302468978:web:4bf608e352c26b08ed91eb",
  measurementId: "G-80WC2GF4YT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Provider for Authentication
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // Force account selection every time
});

// Initialize Analytics safely (avoid errors during SSR or when unsupported)
let analytics = null;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (err) {
  // Analytics failed to initialize (running in non-browser environment or missing support)
  // keep analytics as null and continue
}

export { analytics };

export default app;
