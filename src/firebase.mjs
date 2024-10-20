// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, collection, getDocs, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHV39U3yjDHW__4XovznXvZfVAUy9YNoE",
  authDomain: "dbkl-d5a0b.firebaseapp.com",
  projectId: "dbkl-d5a0b",
  storageBucket: "dbkl-d5a0b.appspot.com",
  messagingSenderId: "135739678772",
  appId: "1:135739678772:web:d071c15fc0d0ce9a25aa61",
  measurementId: "G-WSCKBG36L2"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth, collection, getDocs, getDoc, doc, setDoc, updateDoc, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };

