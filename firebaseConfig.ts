// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQtB9zEKUsIUQfUcWOdADcMo_KMH2YMDQ",
  authDomain: "hirely-bb476.firebaseapp.com",
  projectId: "hirely-bb476",
  storageBucket: "hirely-bb476.firebasestorage.app",
  messagingSenderId: "654364001353",
  appId: "1:654364001353:web:edd76a67bb326a84082b98",
  measurementId: "G-CF1KPF5EYV",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
