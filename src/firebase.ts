import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEHooOyab4HoZOcqdKBlCoXq58nWXIr9o",
  authDomain: "second-hand-db-3d16b.firebaseapp.com",
  projectId: "second-hand-db-3d16b",
  storageBucket: "second-hand-db-3d16b.firebasestorage.app",
  messagingSenderId: "596839187992",
  appId: "1:596839187992:web:be54fb2eb76c671b75656d",
  measurementId: "G-B429DXXSWG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);