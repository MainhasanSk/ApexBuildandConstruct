// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsaM1XDG9gcYg79S8CSl83OCuqqloIzB0",
  authDomain: "apex-building-67412.firebaseapp.com",
  projectId: "apex-building-67412",
  storageBucket: "apex-building-67412.firebasestorage.app",
  messagingSenderId: "387820864534",
  appId: "1:387820864534:web:f82c133862f69c1aee6137",
  measurementId: "G-81B31CF4XS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);