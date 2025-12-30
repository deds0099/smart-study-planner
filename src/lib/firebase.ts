import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdIyP2ilswcnNLUurDJihTEZCWJMuhQIE",
  authDomain: "estudos-6ef0b.firebaseapp.com",
  projectId: "estudos-6ef0b",
  storageBucket: "estudos-6ef0b.firebasestorage.app",
  messagingSenderId: "289495983242",
  appId: "1:289495983242:web:0f025895c4bdcb9f4f3973"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
