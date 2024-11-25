// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebase} from "../constants";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig : firebase = {
  apiKey: "AIzaSyCyEQbwuqvhqU9gZGAdmDCZRkADJ5_wzs4",
  authDomain: "tic-tac-toe-db-43085.firebaseapp.com",
  projectId: "tic-tac-toe-db-43085",
  storageBucket: "tic-tac-toe-db-43085.firebasestorage.app",
  messagingSenderId: "689736976974",
  appId: "1:689736976974:web:153b1a002b7e843622511f"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebaseApp);

export {firebaseApp, auth}