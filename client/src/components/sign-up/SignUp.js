import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import './SignUp.css'

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tradingNo, setTradingNo] = useState('');
  const [identificationNo, setIdentificationNo] = useState('');
  const [username, setUsername] = useState('');

  const signUp = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password, tradingNo, identificationNo, username).then((userCredential) => { console.log(userCredential) }).catch((error) => { console.log(error); })
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
              name="username"
              label="Username"
              id="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
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
            />
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