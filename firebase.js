import { initializeApp } from 'firebase/app';


import {getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDQtIFUPLWD79SMEWMWE8_1NUvGssSY2-0",
    authDomain: "anonyters.firebaseapp.com",
    projectId: "anonyters",
    storageBucket: "anonyters.appspot.com",
    messagingSenderId: "417317024330",
    appId: "1:417317024330:web:dca20acd141624f9adacb3"
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();


export {auth, db, storage, };