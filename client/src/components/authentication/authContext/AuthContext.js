import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, firestoredb, storage } from '../../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchData = async (user) => {
    try {
      const userDocRef = doc(firestoredb, 'user-details', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        let userData = userDocSnapshot.data();
        const pictureRef = ref(storage, `user_details/profile_pictures/${user.uid}`);
        const pictureUrl = await getDownloadURL(pictureRef);
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

  const signup = async (email, password, userInput) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(firestoredb, 'user-details', user.uid);
      await setDoc(userRef, {
        displayName: `${userInput.firstName} ${userInput.lastName}`,
        tradingNo: userInput.tradingNo,
        kraPin: userInput.kraPin,
        nationalId: userInput.nationalId,
        createdAt: new Date(),
        username: userInput.username,
      });

      if (userInput.picture) {
        const pictureRef = ref(storage, `user_details/profile_pictures/${user.uid}`);
        await uploadBytes(pictureRef, userInput.picture);
      }

      await fetchData(user);

      if (userInput.tradingNo.startsWith('MM')) {
        navigate('/mm-dashboard');
      } else if (userInput.tradingNo.startsWith('C')) {
        navigate('/client');
      }

      return user;
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email address is already in use.');
      } else {
        console.error(error);
        throw new Error('An error occurred. Please try again later.');
      }
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(firestoredb, 'user-details', user.uid));
      const userData = userDoc.data();

      const pictureRef = ref(storage, `user_details/profile_pictures/${user.uid}`);
      const pictureUrl = await getDownloadURL(pictureRef);

      const userInfo = { ...userData, pictureUrl };

      if (userInfo.tradingNo.startsWith('MM')) {
        navigate('/mm-dashboard');
      } else if (userInfo.tradingNo.startsWith('C')) {
        navigate('/client');
      }

      return user;
    } catch (error) {
      console.error('Login Error:', error.message);
      throw error;
    }
  };

  const logout = () => {
    auth.signOut()
      .then(() => {
        localStorage.clear();
        navigate('/');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const updateProfilePicture = async (file) => {
    if (!currentUser) return;

    const pictureRef = ref(storage, `user_details/profile_pictures/${currentUser.uid}`);
    await uploadBytes(pictureRef, file);
    const pictureUrl = await getDownloadURL(pictureRef);

    const userRef = doc(firestoredb, 'user-details', currentUser.uid);
    await updateDoc(userRef, { profilePictureUrl: pictureUrl });

    await fetchData(currentUser);
  };

  const updateUserProfile = async (displayName, username) => {
    if (!currentUser) return;

    const userRef = doc(firestoredb, 'user-details', currentUser.uid);
    await updateDoc(userRef, {
      displayName: displayName,
      username: username,
    });

    await fetchData(currentUser);
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

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    updateProfilePicture,
    updateUserProfile,
    updatePassword: updatePasswordInAuthProvider
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
