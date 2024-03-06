// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzCqh8W0klj90kAW7JRL4mnoDHAYDJKJk",
  authDomain: "trade-96ab9.firebaseapp.com",
  projectId: "trade-96ab9",
  storageBucket: "trade-96ab9.appspot.com",
  messagingSenderId: "976415999393",
  appId: "1:976415999393:web:32386ae5126faf3bff37e0",
  measurementId: "G-S7JYC4PHW1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);