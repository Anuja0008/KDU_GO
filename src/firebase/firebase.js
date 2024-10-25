// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Importing the authentication module
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi6N7qlRYtQZwKk8hiRZ5LcDSfu6SP8Mw",
  authDomain: "newkdugo.firebaseapp.com",
  projectId: "newkdugo",
  storageBucket: "newkdugo.appspot.com", // Ensure this matches your Firebase Storage bucket
  messagingSenderId: "120240812673",
  appId: "1:120240812673:web:81073cca67a9789409d380",
  measurementId: "G-6LKQ6WDJ1P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics if it's available
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Export the necessary modules
export { app, analytics, auth, db, storage };
