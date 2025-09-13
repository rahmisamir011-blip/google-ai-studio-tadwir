import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';

// All these variables are expected to be defined by the build process.
// See package.json build script.
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// A simple check to see if the config is loaded.
if (!firebaseConfig.apiKey) {
    console.error("Firebase configuration is missing. Make sure all FIREBASE_ environment variables are set in your deployment environment.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export modular services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export user type for convenience
export type { User };