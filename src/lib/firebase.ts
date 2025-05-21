import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { EmailAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBw73KvS5MXRAQ4nGxCkyYr6cnp_5Ulaw4",
  authDomain: "therapy-c5dd0.firebaseapp.com",
  projectId: "therapy-c5dd0",
  storageBucket: "therapy-c5dd0.firebasestorage.app",
  messagingSenderId: "38714534926",
  appId: "1:38714534926:web:b210175cec8dbc9f71605f"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const provider = new EmailAuthProvider();
const db = getFirestore(app);
const auth = getAuth(app);

export { provider, auth };
export default db;