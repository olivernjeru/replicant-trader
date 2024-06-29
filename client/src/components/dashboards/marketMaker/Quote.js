import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import QuotesTable from './QuotesTable';
import { addDoc, collection, serverTimestamp, doc, onSnapshot, getDocs, updateDoc } from 'firebase/firestore';
import { firestoredb } from '../../../firebase';
import { useAuth } from '../../authentication/authContext/AuthContext';
import defaultTheme from '../../styleUtilities/DefaultTheme';
import { useSelectedClient } from './SelectedClientContext';
import { auth } from '../../../firebase';

const initialState = {
    stockTicker: '',
    bid: '',
    offer: '',
    volume: '',
    validFor: '',
    error: '',
};

export default function Quote() {
    const [formData, setFormData] = useState(initialState);
    const { currentUser } = useAuth();
    const { selectedClientId } = useSelectedClient();

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
            // Check if a client is selected
            if (!selectedClientId) {
                setFormData({ ...formData, error: 'No client selected.' });
                return;
            }

            // Reference to the quotes collection under the selected client
            const quotesCollectionRef = collection(firestoredb, 'quotes', selectedClientId, 'data');

            // Add a new document in the quotes collection
            const docRef = await addDoc(quotesCollectionRef, {
                stockTicker,
                bid,
                offer,
                volume,
                validFor,
                status: 'active', // Set default status to 'active'
                createdAt: new Date(),
                createdBy: currentUser.displayName,
            });

            console.log('Document written successfully');

            // Send message to chat
            const roomId = [auth.currentUser.uid, selectedClientId].sort().join("_");
            const roomDocRef = doc(collection(firestoredb, "chats"), roomId);
            const messagesSubCollectionRef = collection(roomDocRef, "messages");

            await addDoc(messagesSubCollectionRef, {
                text: `Quote sent: ${stockTicker}, Bid: ${bid}, Offer: ${offer}, Volume: ${volume}, Valid for: ${validFor}, Status: active`,
                email: currentUser.email,
                createdAt: serverTimestamp(),
                uid: auth.currentUser.uid,
                read: false,
            });

            // Reset form fields after successful submission
            setFormData(initialState);
        } catch (error) {
            console.error('Error adding document: ', error);
            setFormData({ ...formData, error: `An error occurred while saving data: ${error.message}` });
        }
    };

    useEffect(() => {
        if (selectedClientId) {
            const quotesCollectionRef = collection(firestoredb, 'quotes', selectedClientId, 'data');

            const unsubscribe = onSnapshot(quotesCollectionRef, (snapshot) => {
                snapshot.docChanges().forEach(async (change) => {
                    if (change.type === "modified") {
                        const { stockTicker, status } = change.doc.data();
                        const roomId = [auth.currentUser.uid, selectedClientId].sort().join("_");
                        const roomDocRef = doc(collection(firestoredb, "chats"), roomId);
                        const messagesSubCollectionRef = collection(roomDocRef, "messages");

                        // Find the message corresponding to the quote
                        const messagesSnapshot = await getDocs(messagesSubCollectionRef);
                        messagesSnapshot.forEach((doc) => {
                            if (doc.data().text.includes(stockTicker)) {
                                // Update the status in the existing message
                                updateDoc(doc.ref, {
                                    text: doc.data().text.replace(/Status: \w+/, `Status: ${status}`),
                                    updatedAt: serverTimestamp(),
                                });
                            }
                        });
                    }
                });
            });

            return () => unsubscribe();
        }
    }, [selectedClientId]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <form onSubmit={sendQuote} noValidate>
                    <Box>
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
                    <Box>
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
                    </Box>
                    {formData.error && <Typography color="error" variant="body2">{formData.error}</Typography>}
                    <Box sx={{ width: '55%' }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 0, mb: 1 }}
                        >
                            SEND QUOTE
                        </Button>
                    </Box>
                </form>
                <QuotesTable />
            </Box>
        </ThemeProvider>
    );
}
