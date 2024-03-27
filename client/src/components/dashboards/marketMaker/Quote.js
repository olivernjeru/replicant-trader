import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import './Quote.css';
import QuotesTable from './QuotesTable';
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

export default function Quote() {
    const navigate = useNavigate();
    const [stockTicker, setStockTicker] = useState('');
    const [bid, setBid] = useState('');
    const [offer, setOffer] = useState('');
    const [volume, setVolume] = useState('');
    const [validFor, setValidFor] = useState('');
    const [error, setError] = useState('');

    const db = getDatabase();

    const sendQuote = (event) => {
        event.preventDefault();

        // Form validation
        if (!stockTicker) {
            setError('Enter Stock Ticker.');
            return;
        }
        else if (!bid) {
            setError('Enter Bid.');
            return;
        }
        else if (!offer) {
            setError('Enter Offer.');
            return;
        }
        else if (!volume) {
            setError('Enter Volume.');
            return;
        }
        else if (!validFor) {
            setError('Enter Quote Validity.');
            return;
        }

        // Clear previous error messages
        setError('');

        // Generate a unique timestamp representing the current time
        const currentTime = new Date().getTime();

        push(ref(db, `quotes/${currentTime}`), {
            stockTicker: stockTicker,
            bid: bid,
            offer: offer,
            volume: volume,
            validFor: validFor,
        })
            .then(() => {
                console.log('Data Saved Successfully');
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
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box component="form" onSubmit={sendQuote} noValidate >
                        <Box sx={{ display: 'flex' }}>
                            <TextField
                                margin="normal"
                                required
                                id="stock-ticker-input"
                                label="TSLA"
                                name="stock-ticker-input"
                                autoComplete="stock-ticker-input"
                                sx={{ margin: 1 }}
                                value={stockTicker}
                                onChange={(event) => setStockTicker(event.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                id="bid"
                                label="Bid"
                                name="bid"
                                autoComplete="bid"
                                sx={{ margin: 1 }}
                                value={bid}
                                onChange={(event) => setBid(event.target.value)}
                            />
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            <TextField
                                margin="normal"
                                required
                                id="offer"
                                label="Offer"
                                name="offer"
                                autoComplete="offer"
                                sx={{ margin: 1 }}
                                value={offer}
                                onChange={(event) => setOffer(event.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                id="volume"
                                label="Vol"
                                name="volime"
                                autoComplete="volume"
                                sx={{ margin: 1 }}
                                value={volume}
                                onChange={(event) => setVolume(event.target.value)}
                            />
                        </Box>
                        <TextField
                            margin="normal"
                            required
                            id="valid-for"
                            label="Valid for"
                            name="valid-for"
                            autoComplete="valid-for"
                            sx={{ margin: 1 }}
                            value={validFor}
                            onChange={(event) => setValidFor(event.target.value)}
                        />
                        {error && <Typography color="error" variant="body2">{error}</Typography>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 0, mb: 1 }}
                        >
                            SEND QUOTE
                        </Button>
                    </Box>
                    <QuotesTable />
                </Box>
            </Container>
        </ThemeProvider>
    );
}