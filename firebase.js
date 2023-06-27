// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCQ7Oh___qwbmec7ogI7hXftRRQomUGtM",
  authDomain: "notes-app-1c8de.firebaseapp.com",
  projectId: "notes-app-1c8de",
  storageBucket: "notes-app-1c8de.appspot.com",
  messagingSenderId: "456345498542",
  appId: "1:456345498542:web:6fbbf815256aa90dc9ce3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, 'notes')