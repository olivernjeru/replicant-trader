import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, firestoredb, storage } from '../../../firebase'; import { createUserWithEmailAndPassword } from 'firebase/auth';
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
  const [loading, setLoading] = useState(true);

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

        console.log('User ID:', user.uid);
        console.log('User Data:', userData);
        console.log('User Profile Photo:', pictureUrl);
        setUserData(userData);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

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
