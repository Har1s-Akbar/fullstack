import { initializeApp } from "firebase/app";
import {getAuth, signInWithPopup ,GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from "firebase/firestore/lite";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDfwV_oGjrB8Km8r06FFVRNCEmII-lFNKc",
  authDomain: "fullstack-36ac5.firebaseapp.com",
  projectId: "fullstack-36ac5",
  storageBucket: "fullstack-36ac5.appspot.com",
  messagingSenderId: "79271122673",
  appId: "1:79271122673:web:ee6fdcc715c914607ebb50",
  measurementId: "G-Z798W81CJJ"
};

const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);