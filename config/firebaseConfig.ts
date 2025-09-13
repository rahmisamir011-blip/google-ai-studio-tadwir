// This file now relies on the Firebase SDK being loaded globally via <script> tags in index.html.

// FIX: Import types for firebase compat to allow TypeScript to correctly resolve them.
// FIX: Renamed type import to `Firebase` to avoid conflict with `firebase` constant below.
import type Firebase from 'firebase/compat/app';

// Tell TypeScript that a 'firebase' object exists on the global window scope.
declare global {
  interface Window {
    // Using 'any' as the type for the global firebase object is simplest for this context.
    firebase: any;
  }
}

// Access the globally available firebase object.
const firebase = window.firebase;

export const firebaseConfig = {
  apiKey: "AIzaSyBax5BWST6Z6KAE2-APc27RJ-uVutkVsuw",
  authDomain: "tadwir-38169.firebaseapp.com",
  projectId: "tadwir-38169",
  storageBucket: "tadwir-38169.firebasestorage.app",
  messagingSenderId: "399773716200",
  appId: "1:399773716200:web:b02bfaf1a286ab47fc835d",
  measurementId: "G-BBMBMCD6XB"
};

// Initialize Firebase using a singleton pattern.
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get the v8 compat services from the global firebase object.
export const auth = firebase.auth();
export const db = firebase.firestore();

// Export necessary types and classes to avoid namespace issues in other modules.
export const GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
// FIX: Corrected the User type. It is part of the top-level firebase namespace, not firebase.auth.
export type User = Firebase.User;

// Export the augmented firebase object itself as a fallback.
export default firebase;