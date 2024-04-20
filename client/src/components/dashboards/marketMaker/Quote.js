import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import QuotesTable from './QuotesTable';
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

const initialState = {
    stockTicker: '',
    bid: '',
    offer: '',
    volume: '',
    validFor: '',
};

export default function Quote() {
    const [formData, setFormData] = useState(initialState);
    const db = getDatabase();

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const sendQuote = (event) => {
        event.preventDefault();
        const { stockTicker, bid, offer, volume, validFor } = formData;

        // Form validation
        if (!stockTicker || !bid || !offer || !volume || !validFor) {
            setFormData({ ...formData, error: 'All fields are required.' });
            return;
        }

        // Additional validation (e.g., numeric values for bid, offer, volume)
        // You can add your validation logic here

        // Clear previous error messages
        setFormData({ ...formData, error: '' });

        // Generate a unique timestamp representing the current time
        const currentTime = new Date().getTime();

        push(ref(db, `quotes/${currentTime}`), formData)
            .then(() => {
                console.log('Data Saved Successfully');
                // Reset form fields after successful submission
                setFormData(initialState);
            })
            .catch((error) => {
                if (error.code === 'PERMISSION_DENIED') {
                    setFormData({ ...formData, error: 'Permission denied. Check your database rules.' });
                } else {
                    setFormData({ ...formData, error: `An error occurred while saving data: ${error.message}` });
                }
            });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <form onSubmit={sendQuote} noValidate >
                        <Box sx={{ display: 'flex' }}>
                            <TextField
                                margin="normal"
                                required
                                id="stock-ticker-input"
                                label="Stock Ticker"
                                name="stockTicker"
                                autoComplete="off"
                                sx={{ margin: 1 }}
                                value={formData.stockTicker}
                                onChange={handleFormChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                id="bid"
                                label="Bid"
                                name="bid"
                                type="number"
                                autoComplete="off"
                                sx={{ margin: 1 }}
                                value={formData.bid}
                                onChange={handleFormChange}
                            />
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            <TextField
                                margin="normal"
                                required
                                id="offer"
                                label="Offer"
                                name="offer"
                                type="number"
                                autoComplete="off"
                                sx={{ margin: 1 }}
                                value={formData.offer}
                                onChange={handleFormChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                id="volume"
                                label="Volume"
                                name="volume"
                                type="number"
                                autoComplete="off"
                                sx={{ margin: 1 }}
                                value={formData.volume}
                                onChange={handleFormChange}
                            />
                        </Box>
                        <TextField
                            margin="normal"
                            required
                            id="valid-for"
                            label="Valid for"
                            name="validFor"
                            autoComplete="off"
                            sx={{ margin: 1 }}
                            value={formData.validFor}
                            onChange={handleFormChange}
                        />
                        {formData.error && <Typography color="error" variant="body2">{formData.error}</Typography>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 0, mb: 1 }}
                        >
                            SEND QUOTE
                        </Button>
                    </form>
                    <QuotesTable />
                </Box>
            </Container>
        </ThemeProvider>
    );
}
