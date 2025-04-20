// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCG0YfkSofUMdwX0H4m-YJJ7r6NZAKZPQg",
  authDomain: "cyberloop-3da6d.firebaseapp.com",
  projectId: "cyberloop-3da6d",
  storageBucket: "cyberloop-3da6d.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "549245276493",
  appId: "1:549245276493:web:505c3b5235a692f5b9a704",
  measurementId: "G-6THL6W9QNB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(err => {
  console.error("Analytics error:", err);
});

// Initialize Firestore
const db = getFirestore(app);

export { app, analytics, db };