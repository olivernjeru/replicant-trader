import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase';
import './SignUp.css'
import { useNavigate } from 'react-router-dom';

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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const signUp = (event) => {
    event.preventDefault();

    // Form validation
    if (!email) {
      setError('Enter your email.');
      return;
    }
    else if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    else if (!password) {
      setError('Enter your password.');
      return;
    }
    else if (!confirmPassword) {
      setError('Enter the password again to confirm.');
      return;
    }
    else if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Clear previous error messages
    setError('');

    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          navigate("/submit-details");
        })
        .catch((error) => {
          const errorMessage = error.message;
          const errorCode = error.code;

          setError(true);

          switch (errorCode) {
            case "auth/weak-password":
              setErrorMessage("The password is too weak.");
              break;
            case "auth/missing-password":
              setErrorMessage("Please enter a password.");
              break;
            case "auth/email-already-in-use":
              setErrorMessage(
                "This email address is already in use by another account."
              );
              break;
            case "auth/invalid-email":
              setErrorMessage("This email address is invalid.");
              break;
            case "auth/operation-not-allowed":
              setErrorMessage("Email/password accounts are not enabled.");
              break;
            default:
              setErrorMessage(errorMessage);
              break;
          }
        })
    }
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="email-address"
              label="Email Address"
              type="email"
              id="email-address"
              autoComplete="email-address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              autoComplete="confirm-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            {error && <Typography color="error" variant="body2">{error}</Typography>}
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