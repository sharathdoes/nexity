// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXpyBJPWbe5mTE4zT5XeVW_Ynl4YOieQU",
  authDomain: "vnr-cse-csbs-portal.firebaseapp.com",
  projectId: "vnr-cse-csbs-portal",
  storageBucket: "vnr-cse-csbs-portal.appspot.com",
  messagingSenderId: "649792794328",
  appId: "1:649792794328:web:5fac58c1faa95e8a6031ad",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;