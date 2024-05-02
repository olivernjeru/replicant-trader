import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import QuotesTable from './QuotesTable';
import { doc, addDoc, collection } from 'firebase/firestore';
import { firestoredb } from '../../../firebase';
import { useAuth } from '../../authentication/authContext/AuthContext';
import defaultTheme from '../../styleUtilities/DefaultTheme';

const initialState = {
    stockTicker: '',
    bid: '',
    offer: '',
    volume: '',
    validFor: '',
};

export default function Quote() {
    const [formData, setFormData] = useState(initialState);
    const { currentUser } = useAuth(); // Get the current authenticated user

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const sendQuote = async (event) => {
        event.preventDefault();
        const { stockTicker, bid, offer, volume, validFor } = formData;

        // Form validation
        if (!stockTicker || !bid || !offer || !volume || !validFor) {
            setFormData({ ...formData, error: 'All fields are required.' });
            return;
        }

        // Clear previous error messages
        setFormData({ ...formData, error: '' });

        try {
            // Get reference to the document with the current user's ID as the document ID
            const userDocRef = doc(collection(firestoredb, 'quotes'), currentUser.uid);

            // Add a new subcollection with a timestamp as the document ID
            const newSubCollectionRef = collection(userDocRef, 'quotesData');
            await addDoc(newSubCollectionRef, {
                stockTicker,
                bid,
                offer,
                volume,
                validFor,
                status: 'active', // Set default status to 'active'
                createdAt: new Date(),
            });

            console.log('Document written successfully');
            // Reset form fields after successful submission
            setFormData(initialState);
        } catch (error) {
            console.error('Error adding document: ', error);
            setFormData({ ...formData, error: `An error occurred while saving data: ${error.message}` });
        }
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
