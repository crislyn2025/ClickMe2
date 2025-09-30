// src/services/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrtPPmGrT4kQuzzvmjYGKekfAbghE6XH4",
  authDomain: "clickme-665c8.firebaseapp.com",
  projectId: "clickme-665c8",
  storageBucket: "clickme-665c8.appspot.com",
  messagingSenderId: "321904595484",
  appId: "1:321904595484:web:f1f9a5bfb79d73338245d9"
}

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)