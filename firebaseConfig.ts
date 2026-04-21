
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyDS8sxoRr5jYkErRpbx2K05IFvLXmrSde0",
  authDomain: "pawpointcare.firebaseapp.com",
  projectId: "pawpointcare",
  storageBucket: "pawpointcare.firebasestorage.app",
  messagingSenderId: "872245822062",
  appId: "1:872245822062:web:381b7b7e81c842249e5c7f",
  measurementId: "G-R52ES4KLDV"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);