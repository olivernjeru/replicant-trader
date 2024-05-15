import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, firestoredb, storage } from '../../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap the application and provide authentication context
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null); // Additional user details fetched from Firestore

  // Function to fetch user data from Firestore
  const fetchData = async (user) => {
    try {
      // Fetch user details document based on the user's ID
      const userDocRef = doc(firestoredb, 'user-details', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // If user details document exists, set the user data state
        let userData = userDocSnapshot.data();

        // Fetch profile picture URL from Firebase Storage
        const pictureRef = ref(storage, `user_details/profile_pictures/${user.uid}`);
        const pictureUrl = await getDownloadURL(pictureRef);

        // Add profile picture URL to user data
        userData = { ...userData, profilePictureUrl: pictureUrl };

        setUserData(userData);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      if (user) {
        await fetchData(user);
      } else {
        setUserData(null);
      }
    });

    return unsubscribe;
  }, []);

  // Function to sign up a new user
  const signup = async (email, password, userInput) => {
    try {
      // Call the createUserWithEmailAndPassword function from firebase/auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Extract user from userCredential
      const user = userCredential.user;

      // Store user details in Firestore using setDoc from firebase/firestore
      const userRef = doc(firestoredb, 'user-details', user.uid);
      await setDoc(userRef, {
        displayName: `${userInput.firstName} ${userInput.lastName}`,
        tradingNo: userInput.tradingNo,
        kraPin: userInput.kraPin,
        nationalId: userInput.nationalId,
        createdAt: new Date(),
        username: userInput.username,
      });

      // Upload picture to Firebase Storage using uploadBytes from firebase/storage
      if (userInput.picture) {
        const pictureRef = ref(storage, `user_details/profile_pictures/${user.uid}`);
        await uploadBytes(pictureRef, userInput.picture);
      }

      // Fetch user details after signup
      await fetchData(user);

      // Check if the user is a client or market maker based on trading number
      if (userInput.tradingNo.startsWith('MM')) {
        navigate('/mm-dashboard');
      } else if (userInput.tradingNo.startsWith('C')) {
        navigate('/client');
      }

      // Return the user
      return user;
    } catch (error) {
      // Handle authentication errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email address is already in use.');
      } else {
        console.error(error);
        throw new Error('An error occurred. Please try again later.');
      }
    }
  };

  // Function to log in an existing user
  const login = async (email, password) => {
    try {
      // Authenticate user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lookup user details in Firestore
      const userDoc = await getDoc(doc(firestoredb, 'user-details', user.uid));
      const userData = userDoc.data();

      // Lookup profile picture in Firebase Storage
      const pictureRef = ref(storage, `user_details/profile_pictures/${user.uid}`);
      const pictureUrl = await getDownloadURL(pictureRef);

      // Combine user data with profile picture URL
      const userInfo = { ...userData, pictureUrl };

      // Redirect based on trading number prefix
      if (userInfo.tradingNo.startsWith('MM')) {
        navigate('/mm-dashboard');
      } else if (userInfo.tradingNo.startsWith('C')) {
        navigate('/client');
      }

      return user;
    } catch (error) {
      console.error('Login Error:', error.message);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  // Function to log out the current user
  const logout = () => {
    auth.signOut()
      .then(() => {
        // Clear all cache throughout the app
        localStorage.clear();

        // After successful sign out, navigate to "/"
        navigate('/');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  // Function to update profile picture
  const updateProfilePicture = async (newPicture) => {
    try {
      const user = auth.currentUser;
      const pictureRef = ref(storage, `user_details/profile_pictures/${user.uid}`);

      // Upload new picture to Firebase Storage
      await uploadBytes(pictureRef, newPicture);

      // Fetch updated profile picture URL
      const pictureUrl = await getDownloadURL(pictureRef);

      // Update user data in Firestore with the new profile picture URL
      const userDocRef = doc(firestoredb, 'user-details', user.uid);
      await setDoc(userDocRef, { profilePictureUrl: pictureUrl }, { merge: true });

      // Update local user data
      setUserData(prevUserData => ({
        ...prevUserData,
        profilePictureUrl: pictureUrl
      }));
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    }
  };

  // Function to update password
  const updatePasswordInAuthProvider = async (currentPassword, newPassword) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error('User is not authenticated');
      }

      // Reauthenticate user
      const credentials = await signInWithEmailAndPassword(auth, user.email, currentPassword);
      if (!credentials) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      await updatePassword(user, newPassword);

      console.log('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  // Value object to be provided by the context
  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    updateProfilePicture,
    updatePassword: updatePasswordInAuthProvider
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};
