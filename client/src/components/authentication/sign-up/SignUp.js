import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestoredb, storage } from '../../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

const defaultTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root, & .MuiOutlinedInput-input': {
            color: 'white', // Change text color to white
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white', // Change border color to white
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1F63E8', // Change border color on hover to white
          },
        },
      },
    },
  },
});

export default function SignUp() {
  const navigate = useNavigate();

  // Validate if username is a correct email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [userInput, setUserInput] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    tradingNo: '',
    kraPin: '',
    nationalId: '',
    username: '',
    picture: null,
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    tradingNo: '',
    kraPin: '',
    nationalId: '',
    username: '',
  });

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setUserInput({
      ...userInput,
      [name]: name === 'picture' ? files[0] : value, // If it's a picture input, set it to the file object
    });

    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    let errorMessage = '';

    switch (name) {
      case 'email':
        errorMessage = emailRegex.test(value)
          ? ''
          : 'Please enter a valid email address.';
        break;
      case 'password':
        errorMessage = isValidPassword(value)
          ? ''
          : 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
        break;
      case 'confirmPassword':
        errorMessage =
          value === userInput.password ? '' : 'Passwords do not match.';
        break;
      case 'firstName':
        errorMessage = value ? '' : 'Please enter your first name.';
        break;
      case 'lastName':
        errorMessage = value ? '' : 'Please enter your last name.';
        break;
      case 'tradingNo':
        errorMessage =
          value && (value.startsWith('MM') || value.startsWith('C')) && value.length >= 10
            ? ''
            : 'Trading number must start with MM or C and have at least 10 characters.';
        break;
      case 'kraPin':
        errorMessage =
          value && /^[A-Z\d]{11}$/.test(value)
            ? ''
            : 'Please enter a valid KRA PIN.';
        break;
      case 'nationalId':
        errorMessage =
          value && /^\d{1,8}$/.test(value)
            ? ''
            : 'Please enter a valid national identification number.';
        break;
      case 'username':
        errorMessage =
          isValidUsername(value)
            ? ''
            : 'Username must be 6–30 characters long and can contain letters, numbers, or periods only. It cannot contain special characters or more than one period in a row.';
        break;
      default:
        break;
    }

    setErrors({
      ...errors,
      [name]: errorMessage,
    });
  };

  const signUp = async (event) => {
    event.preventDefault();

    // Check if there are any validation errors
    if (Object.values(errors).some((error) => error !== '')) {
      return;
    }

    try {
      // Check if the email already exists
      const emailQuery = query(collection(firestoredb, 'user-details'), where('email', '==', userInput.email));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        setErrors((prevState) => ({ ...prevState, email: 'Email address already exists.' }));
        return;
      }

      // Check if the username already exists
      const usernameQuery = query(collection(firestoredb, 'user-details'), where('username', '==', userInput.username));
      const usernameSnapshot = await getDocs(usernameQuery);

      if (!usernameSnapshot.empty) {
        setErrors((prevState) => ({ ...prevState, username: 'Username already exists.' }));
        return;
      }

      // Check if the KRA PIN already exists
      const kraPinQuery = query(collection(firestoredb, 'user-details'), where('kraPin', '==', userInput.kraPin));
      const kraPinSnapshot = await getDocs(kraPinQuery);

      if (!kraPinSnapshot.empty) {
        setErrors((prevState) => ({ ...prevState, kraPin: 'KRA PIN already exists.' }));
        return;
      }

      // Check if the National Identification Number already exists
      const nationalIdQuery = query(collection(firestoredb, 'user-details'), where('nationalId', '==', userInput.nationalId));
      const nationalIdSnapshot = await getDocs(nationalIdQuery);

      if (!nationalIdSnapshot.empty) {
        setErrors((prevState) => ({ ...prevState, nationalId: 'National Identification Number already exists.' }));
        return;
      }

      // Check if the Trading Number already exists
      const tradingNoQuery = query(collection(firestoredb, 'user-details'), where('tradingNo', '==', userInput.tradingNo));
      const tradingNoSnapshot = await getDocs(tradingNoQuery);

      if (!tradingNoSnapshot.empty) {
        setErrors((prevState) => ({ ...prevState, tradingNo: 'Trading Number already exists.' }));
        return;
      }

      // If the email, username, KRA PIN, National Identification Number, and Trading Number do not exist, proceed with user registration
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userInput.email,
        userInput.password
      );

      // Extract user from userCredential
      const user = userCredential.user;

      // Store user details in Firestore
      const userRef = doc(firestoredb, 'user-details', user.uid);
      await setDoc(userRef, {
        displayName: `${userInput.firstName} ${userInput.lastName}`,
        tradingNo: userInput.tradingNo,
        kraPin: userInput.kraPin,
        nationalId: userInput.nationalId,
        createdAt: new Date(),
        username: userInput.username,
      });

      // Check if the user is a client or market maker based on trading number
      if (userInput.tradingNo.startsWith('MM')) {
        navigate('/mm-dashboard');
      } else if (userInput.tradingNo.startsWith('C')) {
        navigate('/client');
      }

      // Upload picture to Firebase Storage
      if (userInput.picture) {
        const pictureRef = ref(storage, `user_details/profile_pictures/${user.uid}`);
        await uploadBytes(pictureRef, userInput.picture);
      }
    } catch (error) {
      // Handle authentication errors
      if (error.code === 'auth/email-already-in-use') {
        setErrors((prevState) => ({ ...prevState, email: 'Email address is already in use.' }));
      } else if (error.code === '400') {
        // Handle bad request error
        console.error('Bad Request:', error.message);
        setErrors((prevState) => ({ ...prevState, general: 'An error occurred. Please try again later.' }));
      } else {
        console.error(error);
      }
    }
  };

  // Password validation function
  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Username validation function
  const isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9.]{6,30}$/;
    return usernameRegex.test(username) && !/[&=_\-' +\[\]<>]/.test(username) && !/\.\./.test(username) && !/^\.|\.$/.test(username);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            paddingTop: 2,
            paddingRight: 8,
            paddingBottom: 2,
            paddingLeft: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            CREATE AN ACCOUNT
          </Typography>
          <Box component="form" onSubmit={signUp} noValidate sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="firstName"
                label="First Name"
                autoFocus
                value={userInput.firstName}
                onChange={handleInputChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="lastName"
                label="Last Name"
                value={userInput.lastName}
                onChange={handleInputChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email Address"
                type="email"
                autoComplete="email"
                value={userInput.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                value={userInput.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                value={userInput.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="tradingNo"
                label="Trading Number"
                value={userInput.tradingNo}
                onChange={handleInputChange}
                error={!!errors.tradingNo}
                helperText={errors.tradingNo}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="kraPin"
                label="KRA PIN"
                value={userInput.kraPin}
                onChange={handleInputChange}
                error={!!errors.kraPin}
                helperText={errors.kraPin}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="nationalId"
                label="National Identification Number"
                value={userInput.nationalId}
                onChange={handleInputChange}
                error={!!errors.nationalId}
                helperText={errors.nationalId}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="username"
                  label="Username"
                  value={userInput.username}
                  onChange={handleInputChange}
                  error={!!errors.username}
                  helperText={errors.username}
                />
                <input
                  accept="image/*"
                  id="contained-button-file"
                  multiple
                  type="file"
                  name="picture"
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="contained-button-file">
                  <Button variant="contained" component="span" fullWidth>
                    Upload Picture
                  </Button>
                </label>
              </Box>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              SUBMIT
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
