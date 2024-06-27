import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme, AppBar, Tabs, Tab, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from '@mui/material';
import styled from '@emotion/styled';
import { firestoredb } from "../../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from '../../authentication/authContext/AuthContext';

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

    useEffect(() => {
        const quotesCollectionRef = collection(firestoredb, 'quotes', currentUser.uid, 'data');

        const unsubscribe = onSnapshot(quotesCollectionRef, async (quotesSnapshot) => {
            let liveQuotesData = [];
            let oldQuotesData = [];

            for (const doc of quotesSnapshot.docs) {
                const quoteData = { id: doc.id, ...doc.data() };

                if (quoteData.status === 'active') {
                    liveQuotesData.push(quoteData);
                } else {
                    oldQuotesData.push(quoteData);
                }
            }

            setLiveQuotes(liveQuotesData);
            setOldQuotes(oldQuotesData);
            setLoading(false);
        }, error => {
            console.error('Error fetching quotes:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

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
                width: 560,
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
                    aria-label="action tabs example"
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
                    <TableContainer component={Paper}>
                        <Table sx={{ maxWidth: 500 }} size="small" aria-label="live-quotes-table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left">SECURITY</StyledTableCell>
                                    <StyledTableCell align="left">VOLUME</StyledTableCell>
                                    <StyledTableCell align="left">BID</StyledTableCell>
                                    <StyledTableCell align="left">OFFER</StyledTableCell>
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
                                            <Button variant="contained" color="primary">Sell {row.bid}</Button>
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            <Button variant="contained" color="primary">Buy {row.offer}</Button>
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{row.validFor}</StyledTableCell>
                                        <StyledTableCell align="left">{row.createdBy}</StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <TableContainer component={Paper}>
                        <Table sx={{ maxWidth: 500 }} size="small" aria-label="old-quotes-table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left">SECURITY</StyledTableCell>
                                    <StyledTableCell align="left">VOLUME</StyledTableCell>
                                    <StyledTableCell align="left">BID</StyledTableCell>
                                    <StyledTableCell align="left">OFFER</StyledTableCell>
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
                                            <Button variant="contained" color="primary">Sell {row.bid}</Button>
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            <Button variant="contained" color="primary">Buy {row.offer}</Button>
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
