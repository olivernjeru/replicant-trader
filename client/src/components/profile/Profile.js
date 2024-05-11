import React, { useEffect, useState } from 'react';
import defaultTheme from '../styleUtilities/DefaultTheme';
import { ThemeProvider } from '@emotion/react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Typography } from '@mui/material';
import { useAuth } from '../authentication/authContext/AuthContext';

export default function Profile() {
    const { currentUser, userData } = useAuth(); // Access currentUser and userData from AuthContext
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Update state with user data when available
        if (userData) {
            const fullName = userData.displayName || ''; // Get the full display name from userData, or an empty string if not available
            const [firstNameFromDisplayName, lastNameFromDisplayName] = fullName.split(' '); // Split full name into first name and last name

            setFirstName(firstNameFromDisplayName || ''); // Use firstNameFromDisplayName if available, otherwise set it to an empty string
            setLastName(lastNameFromDisplayName || ''); // Use lastNameFromDisplayName if available, otherwise set it to an empty string
            setEmail(currentUser ? currentUser.email : ''); // Use currentUser.email if available, otherwise set it to an empty string
            setUsername(userData.username || ''); // Use userData.username if available, otherwise set it to an empty string
        }
    }, [currentUser, userData]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }} >
                <Typography variant='h4'>Account Profile</Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <TextField
                        margin="normal"
                        required
                        id="firstName"
                        label="First Name"
                        name="first-name"
                        value={firstName} // Set value to firstName state
                        sx={{ margin: 1 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        id="last-name"
                        label="Last Name"
                        name="last-name"
                        value={lastName} // Set value to lastName state
                        sx={{ margin: 1 }}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <TextField
                        margin="normal"
                        required
                        id="email-address"
                        label="Email Address"
                        name="email-address"
                        value={email} // Set value to email state
                        sx={{ margin: 1 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        id="username"
                        label="Username"
                        name="username"
                        value={username} // Set value to username state
                        sx={{ margin: 1 }}
                    />
                </Box>
                <Button
                    type="submit"
                    // fullWidth
                    variant="contained"
                    sx={{ mt: 0, mb: 1 }}
                >
                    UPDATE
                </Button>
            </Box>
        </ThemeProvider>
    )
}
