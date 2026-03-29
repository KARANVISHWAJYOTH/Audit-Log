import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsG1U-iozaIuVbKcPxcG5DyolLU71nEOo",
  authDomain: "auditlog-3ae1f.firebaseapp.com",
  projectId: "auditlog-3ae1f",
  storageBucket: "auditlog-3ae1f.firebasestorage.app",
  messagingSenderId: "695226940967",
  appId: "1:695226940967:web:a98d03d4288ec09a145802",
  measurementId: "G-XM94GVZNMM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (only in production)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export { analytics };
export default app;