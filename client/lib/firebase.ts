import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBF8d64Q7wAYWwC5wUp5fbvRf1sCfcj4Sw",
  authDomain: "collabspace-95a6c.firebaseapp.com",
  projectId: "collabspace-95a6c",
  storageBucket: "collabspace-95a6c.firebasestorage.app",
  messagingSenderId: "1009581384555",
  appId: "1:1009581384555:web:b8f755a263b4ef776ba22e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
