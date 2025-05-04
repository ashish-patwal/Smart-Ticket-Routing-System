import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBmgVCkFrU8AebbxU5jggQ-Fq-QnQfixBw",
  authDomain: "smart-ticket-router.firebaseapp.com",
  projectId: "smart-ticket-router",
  storageBucket: "smart-ticket-router.firebasestorage.app",
  messagingSenderId: "1009839698321",
  appId: "1:1009839698321:web:c47f19d5fc808386046a30",
  measurementId: "G-6KF2YJX8JC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
