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
import { getDatabase, ref, push } from "firebase/database";

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
  const navigate = useNavigate();
  const [tradingNo, setTradingNo] = useState('');
  const [identificationNo, setIdentificationNo] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const db = getDatabase();

  const submitDetails = (event) => {
    event.preventDefault();

    // Form validation
    if (!tradingNo) {
      setError('Enter your trading number.');
      return;
    }
    else if (!identificationNo) {
      setError('Enter your national identification number.');
      return;
    }
    else if (!username) {
      setError('Enter your username.');
      return;
    }

    // Clear previous error messages
    setError('');

    // Generate a unique timestamp representing the current time
    const currentTime = new Date().getTime();

    push(ref(db, `userDetails/${currentTime}`), {
      tradingNo: tradingNo,
      identificationNo: identificationNo,
      userName: username,
    })
      .then(() => {
        console.log('Data Saved Successfully');
        navigate("/login");
      })
      .catch((error) => {
        if (error.code === 'PERMISSION_DENIED') {
          setError('Permission denied. Check your database rules.');
        } else {
          setError('An error occurred while saving data:', error.message);
        }
      })
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
              value={tradingNo}
              onChange={(event) => setTradingNo(event.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="identificationNo."
              label="National ID No./Passport No."
              id="identificationNo."
              autoComplete="identification-number"
              value={identificationNo}
              onChange={(event) => setIdentificationNo(event.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              id="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
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
            {/* {error && <p>{errorMessage}</p>} */}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}