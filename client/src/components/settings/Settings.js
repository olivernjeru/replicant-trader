import React, { useState } from 'react';
import defaultTheme from '../styleUtilities/DefaultTheme';
import { ThemeProvider } from '@emotion/react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../authentication/authContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';

export default function Settings() {
    const { updatePassword } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true); // Set loading to true when starting the update process

        try {
            // Update password
            await updatePassword(currentPassword, newPassword);
            setLoading(false); // Set loading to false after updating the password
            navigate('/');
        } catch (error) {
            console.error('Error updating password:', error.message);
            setError(error.message);
            setLoading(false); // Set loading to false if there is an error
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{
                height: '92.4vh',
                background: '#0A192F',
                borderRadius: 0,
            }}>
                {loading ? (
                    <CircularProgress sx={{ mt: 15, mb: 1, ml: '50%' }} />
                ) : (
                    <>
                        <Typography variant='h4' sx={{ textAlign: 'center' }}>Password</Typography>
                        <Container>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        width: '25%',
                                    }}
                                >
                                    <Typography variant='p'>Update password</Typography>
                                    <TextField
                                        margin="normal"
                                        required
                                        id="currentPassword"
                                        label="Current Password"
                                        name="current-password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        autoFocus
                                        sx={{ margin: 1 }}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        id="new password"
                                        label="New Password"
                                        name="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        sx={{ margin: 1 }}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        id="confirm new password"
                                        label="Confirm New Password"
                                        name="confirm-new-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        sx={{ margin: 1 }}
                                    />
                                    {error && <Typography color="error">{error}</Typography>}
                                    <Button
                                        type="submit"
                                        onClick={handleSubmit} // Call handleSubmit on button click
                                        variant="contained"
                                        sx={{ mt: 0, mb: 1 }}
                                    >
                                        UPDATE
                                    </Button>
                                </Box>
                            </Box>
                        </Container>
                    </>
                )}
            </Box>
        </ThemeProvider>
    );
}
