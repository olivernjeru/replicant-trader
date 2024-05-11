import React, { useState } from 'react';
import defaultTheme from '../styleUtilities/DefaultTheme';
import { ThemeProvider } from '@emotion/react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Typography } from '@mui/material';
import { useAuth } from '../authentication/authContext/AuthContext'; // Import the useAuth hook

export default function Settings() {
    const { currentUser, updatePassword } = useAuth(); // Access currentUser and updatePassword from AuthContext
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Update password
            await updatePassword(currentPassword, newPassword);
            console.log('Password updated successfully!');
        } catch (error) {
            console.error('Error updating password:', error.message);
            setError(error.message);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 0,
                height: '92.4vh',
            }} >
                <Typography variant='h4'>Password</Typography>
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
        </ThemeProvider>
    )
}
