import React from 'react';
import defaultTheme from '../styleUtilities/DefaultTheme';
import { ThemeProvider } from '@emotion/react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Typography } from '@mui/material';

export default function Settings() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }} >
                <Typography variant='h4'>Password</Typography>
                <Typography variant='p'>Update password</Typography>
                <TextField
                    margin="normal"
                    required
                    id="currentPassword"
                    label="Current Password"
                    name="current-password"
                    autoFocus
                    sx={{ margin: 1 }}
                />
                <TextField
                    margin="normal"
                    required
                    id="new password"
                    label="New Password"
                    name="new-password"
                    sx={{ margin: 1 }}
                />
                <TextField
                    margin="normal"
                    required
                    id="confirm new password"
                    label="Confirm New Password"
                    name="confirm-new-password"
                    sx={{ margin: 1 }}
                />
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
