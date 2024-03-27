import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './submitDetails.css'
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


export default function SubmitDetails() {
  // const navigate = useNavigate();
  // const [tradingNo, setTradingNo] = useState('');
  // const [identificationNo, setIdentificationNo] = useState('');
  // const [username, setUsername] = useState('');
  // const [error, setError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");

  const submitDetails = (event) => {
    // event.preventDefault();
    // createUserWithEmailAndPassword(auth, email, password)
    // .then((userCredential) => {
    //   const user = userCredential.user;
    //   console.log(user);
    //   navigate("/login");
    //  })
    // .catch((error) => {
    //   const errorMessage = error.message;
    //   const errorCode = error.code;

    //   setError(true);

    //   switch (errorCode) {
    //     case "auth/weak-password":
    //       setErrorMessage("The password is too weak.");
    //       break;
    //     case "auth/missing-password":
    //       setErrorMessage("Please enter a password.");
    //       break;
    //     case "auth/email-already-in-use":
    //       setErrorMessage(
    //         "This email address is already in use by another account."
    //       );
    //       break;
    //     case "auth/invalid-email":
    //       setErrorMessage("This email address is invalid.");
    //       break;
    //     case "auth/operation-not-allowed":
    //       setErrorMessage("Email/password accounts are not enabled.");
    //       break;
    //     default:
    //       setErrorMessage(errorMessage);
    //       break;
    //   }})
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
            YOUR DETAILS
          </Typography>
          <Box component="form" onSubmit={submitDetails} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="tradingNo"
              label="Trading No."
              name="tradingNo"
              autoComplete="tradingNo"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="identificationNo."
              label="National ID No./Passport No."
              id="identificationNo."
              autoComplete="identification-number"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              id="username"
              autoComplete="username"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              SUBMIT
            </Button>
            {/* {error && <p>{errorMessage}</p>} */}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}