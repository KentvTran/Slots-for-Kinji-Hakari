// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmdJ2YBbx50c9DvH6ojnI1nHPuNDcUf0w",
  authDomain: "hakari-spin.firebaseapp.com",
  projectId: "hakari-spin",
  storageBucket: "hakari-spin.firebasestorage.app",
  messagingSenderId: "639762671199",
  appId: "1:639762671199:web:91222bdf84131b3a21ddea",
  measurementId: "G-E6YMP50CZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)

export { app, auth };