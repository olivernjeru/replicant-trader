import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, firestoredb, storage } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ref, getDownloadURL } from 'firebase/storage';

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
  const [loading, setLoading] = useState(true);

  // Function to sign up a new user
  const signup = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  // Function to log in an existing user
  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  // Function to log out the current user
  const logout = () => {
    auth.signOut()
      .then(() => {
        // After successful sign out, navigate to "/"
        navigate('/');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  useEffect(() => {
    // Firebase event listener to set the current user
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      setLoading(false);

      // Fetch additional user details from Firestore if user is authenticated
      if (user) {
        try {
          // Fetch user details document
          const userDocRef = firestoredb.doc(`user-details/${user.uid}`);
          const userDocSnapshot = await userDocRef.get();

          if (userDocSnapshot.exists()) {
            // If user details document exists, set the user data state
            let userData = userDocSnapshot.data();

            // Fetch profile picture URL from Firebase Storage
            const pictureRef = ref(storage, `user_details/profile_pictures/${user.uid}`);
            const pictureUrl = await getDownloadURL(pictureRef);

            // Add profile picture URL to user data
            userData = { ...userData, profilePictureUrl: pictureUrl };

            console.log('User ID:', user.uid);
            console.log('Email:', user.email);
            console.log('User Details Data:', userData);
            setUserData(userData);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      } else {
        // If user is not authenticated, reset user data state
        setUserData(null);
      }
    });

    // Clean up function
    return unsubscribe;
  }, []);

  // Fetch data from Firestore collection
  // Fetch data from Firestore collection
useEffect(() => {
  // Firebase event listener to set the current user
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    setCurrentUser(user);
    setLoading(false);

    // Fetch additional user details from Firestore if user is authenticated
    if (user) {
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

          console.log('User ID:', user.uid);
          console.log('User Data:', userData);
          console.log('User Profile Photo:', pictureUrl);
          setUserData(userData);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    } else {
      // If user is not authenticated, reset user data state
      setUserData(null);
    }
  });

  // Clean up function
  return unsubscribe;
}, []);

  // Value object to be provided by the context
  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
