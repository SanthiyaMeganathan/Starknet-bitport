import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhqQdIubUwH3ymCsgJCiz6vpD4LYpLtnc",
  authDomain: "bitbuddy-822c0.firebaseapp.com",
  projectId: "bitbuddy-822c0",
  storageBucket: "bitbuddy-822c0.appspot.com",
  messagingSenderId: "53794234231",
  appId: "1:53794234231:web:0fb4fb3b18c3da919b8b72",
  measurementId: "G-M1BZPW3CCF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
