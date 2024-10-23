import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, collection, getDocs, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOe1lAYHG_xOCZHLdBDWAdKEe_4sg0WYM",
  authDomain: "fir-c8ee2.firebaseapp.com",
  projectId: "fir-c8ee2",
  storageBucket: "fir-c8ee2.appspot.com",
  messagingSenderId: "949915778545",
  appId: "1:949915778545:web:21486f967991101300d850",
  measurementId: "G-N8LSXX52ZD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth, collection, getDocs, getDoc, doc, setDoc, updateDoc, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };
