// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);

// Initialize Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
