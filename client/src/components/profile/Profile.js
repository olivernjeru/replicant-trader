import React, { useEffect, useState } from 'react';
import defaultTheme from '../styleUtilities/DefaultTheme';
import { ThemeProvider } from '@emotion/react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Container, Divider, Typography } from '@mui/material';
import { useAuth } from '../authentication/authContext/AuthContext';

export default function Profile() {
    const { currentUser, userData, updateProfilePicture } = useAuth(); // Access currentUser, userData, and updateProfilePicture from AuthContext
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        // Update state with user data when available
        if (userData) {
            const fullName = userData.displayName || ''; // Get the full display name from userData, or an empty string if not available
            const [firstNameFromDisplayName, lastNameFromDisplayName] = fullName.split(' '); // Split full name into first name and last name

            setFirstName(firstNameFromDisplayName || ''); // Use firstNameFromDisplayName if available, otherwise set it to an empty string
            setLastName(lastNameFromDisplayName || ''); // Use lastNameFromDisplayName if available, otherwise set it to an empty string
            setEmail(currentUser ? currentUser.email : ''); // Use currentUser.email if available, otherwise set it to an empty string
            setUsername(userData.username || ''); // Use userData.username if available, otherwise set it to an empty string

            // Set profile picture
            setProfilePicture(userData.profilePictureUrl || null);
        }
    }, [currentUser, userData]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // Call function to update profile picture
        updateProfilePicture(file);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ width: '100vw', display: 'flex', justifyContent: 'center', borderRadius: 0 }}>
                <Container maxWidth="none">
                    <Box>
                        <Typography variant='h4' sx={{ textAlign: 'center' }}>Profile</Typography></Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '87.4vh',
                        borderRadius: 0
                    }} >
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: '#0A192F',
                            width: '30%',
                            height: '40%',
                            ml: 20
                        }}>
                            {profilePicture && (
                                <img src={profilePicture} alt="Profile" style={{ width: 80, height: 80, borderRadius: '100%', marginTop: '2%' }} />
                            )}
                            {userData && <Typography variant="h6" sx={{ mt: "3%", mb: "15%"}}>{userData.displayName}</Typography>}
                            <Divider sx={{ backgroundColor: 'white', width: '100%' }} />
                            <input
                                accept="image/*"
                                id="upload-button"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <label htmlFor="upload-button">
                                <Button variant="outlined" component="span" sx={{ mt: '15%' }}>
                                    Upload Picture
                                </Button>
                            </label>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#0A192F',
                            width: '30%',
                            height: '40%',
                            mr: 5
                        }}>
                            <Box sx={{
                                mt: 3,
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
                            <Divider sx={{ backgroundColor: 'white', width: '100%' }} />
                            <Button
                                type="submit"
                                // fullWidth
                                variant="contained"
                                sx={{ mb: 2 }}
                            >
                                UPDATE
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    )
}
