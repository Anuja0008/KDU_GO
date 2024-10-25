// api.js

import { db } from '../../firebase/firebase'; // Make sure this path is correct

// Function to get profile data
export const getProfile = async (userId) => {
  try {
    const profileRef = db.collection('admin').doc('login').collection('profiles').doc(userId); // Adjusted path to the document
    const doc = await profileRef.get();
    if (doc.exists) {
      return doc.data();
    } else {
      throw new Error('No such document!');
    }
  } catch (error) {
    console.error("Error getting profile: ", error);
    throw error;
  }
};
