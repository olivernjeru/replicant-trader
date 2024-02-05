import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './ResetPassword.css'
import { Link as RouterLink } from 'react-router-dom';

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
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white', // Change border color when focused to white
                    },
                },
            },
        },
    },
});


export default function ResetPassword() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            username: data.get('username'),
            password: data.get('password'),
        });
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
                        RESET PASSWORD
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
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
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    size="large"
                                    variant="contained"
                                    fullWidth
                                    component={RouterLink}
                                    to="/login"
                                    sx={{ mt: 4, mb: 2 }}
                                >
                                    BACK TO LOGIN
                                </Button>
                                </Grid>
                                <Grid item xs={6}>
                                <Button
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: 4, mb: 2 }}
                                >
                                    RESET
                                </Button>
                            </Grid>

                        </Grid>

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}