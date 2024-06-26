import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme, AppBar, Tabs, Tab, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from '@mui/material';
import styled from '@emotion/styled';
import { firestoredb } from "../../../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useAuth } from '../../authentication/authContext/AuthContext';
import { Timestamp } from 'firebase/firestore';

const StyledTableCell = styled(TableCell)({
    color: 'black',
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`action-tabpanel-${index}`}
            aria-labelledby={`action-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export default function QuotesTable() {
    const theme = useTheme();
    const { currentUser } = useAuth();
    const [value, setValue] = useState(0);
    const [liveQuotes, setLiveQuotes] = useState([]);
    const [oldQuotes, setOldQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to convert Firestore Timestamp to JavaScript Date
    const convertTimestampToDate = (timestamp) => {
        return timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    };

    // Function to calculate the remaining time for each quote
    const calculateRemainingTime = (createdAt, validFor) => {
        const now = new Date();
        const expiryTime = new Date(createdAt.getTime() + validFor * 1000); // validFor is in seconds
        return Math.max(0, Math.floor((expiryTime - now) / 1000));
    };

    useEffect(() => {
        const quotesCollectionRef = collection(firestoredb, 'quotes', currentUser.uid, 'data');

        const unsubscribe = onSnapshot(quotesCollectionRef, (quotesSnapshot) => {
            let liveQuotesData = [];
            let oldQuotesData = [];

            quotesSnapshot.forEach((doc) => {
                const quoteData = {
                    id: doc.id,
                    ...doc.data(),
                    createdAt: convertTimestampToDate(doc.data().createdAt) // Convert Timestamp to Date
                };

                if (quoteData.status === 'active') {
                    liveQuotesData.push(quoteData);
                } else {
                    oldQuotesData.push(quoteData);
                }
            });

            // Sorting by createdAt after converting to Date
            liveQuotesData.sort((a, b) => b.createdAt - a.createdAt);
            oldQuotesData.sort((a, b) => b.createdAt - a.createdAt);

            setLiveQuotes(liveQuotesData);
            setOldQuotes(oldQuotesData);
            setLoading(false);
        }, error => {
            console.error('Error fetching quotes:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveQuotes((prevLiveQuotes) => {
                return prevLiveQuotes.map((quote) => {
                    const remainingTime = calculateRemainingTime(quote.createdAt, quote.validFor);

                    if (remainingTime <= 0) {
                        // Update the quote status in the database
                        const quoteDocRef = doc(firestoredb, 'quotes', currentUser.uid, 'data', quote.id);
                        updateDoc(quoteDocRef, { status: 'expired' });

                        // Move the quote to oldQuotes
                        setOldQuotes((prevOldQuotes) => [quote, ...prevOldQuotes]);
                        return null;
                    }

                    return { ...quote, remainingTime };
                }).filter(quote => quote !== null);
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [liveQuotes, currentUser]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                width: 600,
                position: 'relative',
                minHeight: 100,
            }}
        >
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="quotes status tabs"
                >
                    <Tab label="Live Quotes" />
                    <Tab label="Old Quotes" />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <TableContainer component={Paper} sx={{ maxHeight: 330, overflowY: 'auto', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#1976D2', borderRadius: '4px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#D9D9D9' } }}>
                        <Table sx={{ maxWidth: 500 }} size="small" aria-label="live-quotes-table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left">SECURITY</StyledTableCell>
                                    <StyledTableCell align="left">VOLUME</StyledTableCell>
                                    <StyledTableCell align="left">BUY</StyledTableCell>
                                    <StyledTableCell align="left">SELL</StyledTableCell>
                                    <StyledTableCell align="left">VALID FOR</StyledTableCell>
                                    <StyledTableCell align="left">MARKET MAKER</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {liveQuotes.map((row) => (
                                    <TableRow key={row.id}>
                                        <StyledTableCell align="left">{row.stockTicker}</StyledTableCell>
                                        <StyledTableCell align="left">{row.volume}</StyledTableCell>
                                        <StyledTableCell align="left">
                                            <Button variant="contained" color="primary" size="small">{row.offer}</Button>
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            <Button variant="contained" color="secondary" size="small">{row.bid}</Button>
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{row.remainingTime}</StyledTableCell>
                                        <StyledTableCell align="left">{row.createdBy}</StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <TableContainer component={Paper} sx={{ maxHeight: 330, overflowY: 'auto', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#1976D2', borderRadius: '4px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#D9D9D9' } }}>
                        <Table sx={{ maxWidth: 500 }} size="small" aria-label="old-quotes-table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left">SECURITY</StyledTableCell>
                                    <StyledTableCell align="left">VOLUME</StyledTableCell>
                                    <StyledTableCell align="left">BUY</StyledTableCell>
                                    <StyledTableCell align="left">SELL</StyledTableCell>
                                    <StyledTableCell align="left">VALID FOR</StyledTableCell>
                                    <StyledTableCell align="left">MARKET MAKER</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {oldQuotes.map((row) => (
                                    <TableRow key={row.id}>
                                        <StyledTableCell align="left">{row.stockTicker}</StyledTableCell>
                                        <StyledTableCell align="left">{row.volume}</StyledTableCell>
                                        <StyledTableCell align="left">
                                            {row.offer}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {row.bid}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{row.validFor}</StyledTableCell>
                                        <StyledTableCell align="left">{row.createdBy}</StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
            </SwipeableViews>
        </Box>
    );
}
