// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBSNed86HUwL9nvHsrOyLD_T4pKYKTqcDE",
    authDomain: "react-todo-auth-cca76.firebaseapp.com",
    projectId: "react-todo-auth-cca76",
    storageBucket: "react-todo-auth-cca76.firebasestorage.app",
    messagingSenderId: "224211916624",
    appId: "1:224211916624:web:739fd0f6b53174a847be55",
    measurementId: "G-YG2T5R1HTX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {analytics, auth}