import { auth, db, GoogleAuthProvider, type User as FirebaseUser } from '../config/firebaseConfig';
import type { UserProfile } from '../types';
import { FIRESTORE_COLLECTIONS } from '../constants';

// --- Authentication Functions ---

export const signUpWithEmail = (email: string, password: string) => {
  return auth.createUserWithEmailAndPassword(email, password);
};

export const signInWithEmail = (email: string, password: string) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const signInWithGoogle = () => {
  const googleProvider = new GoogleAuthProvider();
  return auth.signInWithPopup(googleProvider);
};

export const signOutUser = () => {
  return auth.signOut();
};


// --- Firestore User Profile Functions ---

/**
 * Creates a user profile document in Firestore.
 * @param user - The Firebase user object.
 * @param additionalData - Additional profile data like name and date of birth.
 */
export const createUserProfile = async (user: FirebaseUser, additionalData: { name: string, dateOfBirth: string }) => {
    if (!user) return;
    const userRef = db.collection(FIRESTORE_COLLECTIONS.USERS).doc(user.uid);
    const profileData: UserProfile = {
        uid: user.uid,
        email: user.email,
        name: additionalData.name,
        dateOfBirth: additionalData.dateOfBirth,
    };
    // Use set to create or overwrite the document for a given UID.
    await userRef.set(profileData);
};

/**
 * Checks if a user profile document exists in Firestore.
 * @param uid - The user's unique ID.
 * @returns A boolean indicating if the profile exists.
 */
export const doesUserProfileExist = async (uid: string): Promise<boolean> => {
    if (!uid) return false;
    const userRef = db.collection(FIRESTORE_COLLECTIONS.USERS).doc(uid);
    try {
        const docSnap = await userRef.get();
        return docSnap.exists;
    } catch (error) {
        console.error("Error checking user profile:", error);
        return false;
    }
};