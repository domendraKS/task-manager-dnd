// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "task-manager-bang.firebaseapp.com",
  projectId: "task-manager-bang",
  storageBucket: "task-manager-bang.appspot.com",
  messagingSenderId: "312299100605",
  appId: "1:312299100605:web:08c0ba06f66401003a5ad4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
