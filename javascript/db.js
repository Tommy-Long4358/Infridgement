import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, push, ref, update, increment, onValue, set, limitToLast, limitToFirst, query, get, orderByChild, orderByKey, orderByValue, remove } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, updatePassword, reauthenticateWithCredential,EmailAuthProvider } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
export { push, ref, remove, update, orderByChild, orderByKey, orderByValue, increment, onValue, limitToLast, limitToFirst, query, set, get, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, updatePassword, reauthenticateWithCredential,EmailAuthProvider };

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDd8OVuXXSDNoFyE7R0DXA_hgo5L1bK3wc",
  authDomain: "infridgement-de310.firebaseapp.com",
  projectId: "infridgement-de310",
  storageBucket: "infridgement-de310.appspot.com",
  messagingSenderId: "1007141359831",
  appId: "1:1007141359831:web:3b36334a2088170991e092"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Get Database Object with app
export const db = getDatabase(firebaseApp);

export const auth = getAuth();