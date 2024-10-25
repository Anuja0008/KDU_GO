import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

// Function to create a new user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error creating user: ", error);
    throw error; // Rethrow to handle in the component calling this function
  }
};

// Function to sign in with email and password
export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error; // Rethrow to handle in the component calling this function
  }
};

// Function to sign in with Google
export const doSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Example: Add user to Firestore (uncomment and implement as needed)
    // await addUserToFirestore(user);

    return user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error; // Rethrow to handle in the component calling this function
  }
};

// Function to sign out
export const doSignOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error; // Rethrow to handle in the component calling this function
  }
};

// Function to reset password
export const doPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email: ", error);
    throw error; // Rethrow to handle in the component calling this function
  }
};

// Function to change password
export const doPasswordChange = async (password) => {
  try {
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, password);
    } else {
      throw new Error("No user is currently signed in.");
    }
  } catch (error) {
    console.error("Error changing password: ", error);
    throw error; // Rethrow to handle in the component calling this function
  }
};

// Function to send email verification
export const doSendEmailVerification = async () => {
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
      });
    } else {
      throw new Error("No user is currently signed in.");
    }
  } catch (error) {
    console.error("Error sending email verification: ", error);
    throw error; // Rethrow to handle in the component calling this function
  }
};
