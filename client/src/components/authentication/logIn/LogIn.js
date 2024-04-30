import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { auth, firestoredb, storage } from '../../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import defaultTheme from '../../styleUtilities/DefaultTheme';
import './LogIn.css';

export default function LogIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const logIn = async (event) => {
    event.preventDefault();

    // Clear previous error messages
    setEmailError('');
    setPasswordError('');

    // Form validation
    if (!email.trim()) {
      setEmailError('Enter your email.');
      return;
    } else if (!isValidEmail(email.trim())) {
      setEmailError('Enter a valid email address.');
      return;
    } else if (!password.trim()) {
      setPasswordError('Enter your password.');
      return;
    }

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
    } catch (error) {
      console.error('Login Error:', error.message);
      if (error.code === 'auth/user-not-found') {
        setEmailError('User not found.');
      } else {
        setPasswordError('Invalid email or password.');
      }
    }
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            paddingTop: 4,
            paddingRight: 8,
            paddingBottom: 4,
            paddingLeft: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            LOG IN
          </Typography>
          <Box component="form" onSubmit={logIn} noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoFocus
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={!!passwordError}
              helperText={passwordError}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/reset-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/sign-up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
