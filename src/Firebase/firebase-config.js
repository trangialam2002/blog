import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyC5JoUS6HF7GgexaAeurpwuIjH-I_gfnCU",
  authDomain: "monkey-blogging-57329.firebaseapp.com",
  projectId: "monkey-blogging-57329",
  storageBucket: "monkey-blogging-57329.appspot.com",
  messagingSenderId: "226262309840",
  appId: "1:226262309840:web:863bc38ec2c99ff77737d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db=getFirestore(app)
const auth=getAuth(app)

export {db,auth}
