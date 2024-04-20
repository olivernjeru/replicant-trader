import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styled from '@emotion/styled';
import { getDatabase, ref, onValue } from "firebase/database";
import isEqual from 'lodash/isEqual';

const StickyStyledTableCell = styled(TableCell)({
    color: 'black',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white', // Set background color if needed
    zIndex: 1, // Ensure the header remains on top of other content
});

const StyledTableCell = styled(TableCell)({
    color: 'black',
});

function QuoteTableRow({ row }) {
    return (
        <TableRow>
            <StyledTableCell align="left">{row.stockTicker}</StyledTableCell>
            <StyledTableCell align="left">{row.volume}</StyledTableCell>
            <StyledTableCell align="left">{row.bid}</StyledTableCell>
            <StyledTableCell align="left">{row.offer}</StyledTableCell>
            <StyledTableCell align="left">
                <CountdownTimer initialValue={parseInt(row.validFor)} status={row.status} />
            </StyledTableCell>
        </TableRow>
    );
}

QuoteTableRow.propTypes = {
    row: PropTypes.object.isRequired,
};

function CountdownTimer({ initialValue, status }) {
    const [secondsLeft, setSecondsLeft] = useState(() => {
        // Retrieve the remaining time from local storage
        const storedTime = localStorage.getItem(`countdownTime-${initialValue}`);
        // If the stored time is found, parse and return it
        if (storedTime && status === 'active') {
            return Math.max(0, parseInt(storedTime, 10));
        }
        // If not found or the status is not active, use the provided initial value
        return initialValue > 0 ? initialValue : 0;
    });

    useEffect(() => {
        let timer;
        if (status === 'active' && secondsLeft > 0) {
            // Store the remaining time in local storage
            localStorage.setItem(`countdownTime-${initialValue}`, secondsLeft.toString());
            // Start the countdown timer
            timer = setInterval(() => {
                setSecondsLeft(prevSeconds => {
                    const newSeconds = prevSeconds - 1;
                    // Update the remaining time in local storage
                    localStorage.setItem(`countdownTime-${initialValue}`, newSeconds.toString());
                    return Math.max(0, newSeconds);
                });
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [initialValue, status, secondsLeft]);

    return (
        <Typography color="black">{secondsLeft > 0 ? `${secondsLeft} seconds` : '0 seconds'}</Typography>
    );
}

CountdownTimer.propTypes = {
    initialValue: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
};

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
    const [rows, setRows] = useState([]);
    const db = getDatabase();

    useEffect(() => {
        const quotesRef = ref(db, 'quotes');

        const unsubscribe = onValue(quotesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const updatedRows = Object.entries(data).flatMap(([timestamp, quotes]) =>
                    Object.entries(quotes).map(([id, quote]) => ({
                        id,
                        status: 'active', // Add status property and initialize it as 'active'
                        ...quote
                    }))
                );
                // Reverse the order of the rows to display the latest quotes first
                setRows(prevRows => {
                    // Check if there are any new quotes
                    const newQuotes = updatedRows.filter(newRow => !prevRows.some(prevRow => prevRow.id === newRow.id));
                    // Check if there are any updated quotes
                    const updatedQuotes = updatedRows.filter(newRow => prevRows.some(prevRow => prevRow.id === newRow.id && !isEqual(prevRow, newRow)));
                    // Check if there are any removed quotes
                    const removedQuotes = prevRows.filter(prevRow => !updatedRows.some(newRow => newRow.id === prevRow.id));

                    // Add new quotes and update existing quotes
                    const mergedRows = [
                        ...prevRows.filter(prevRow => !removedQuotes.some(removedRow => removedRow.id === prevRow.id)),
                        ...newQuotes,
                        ...updatedQuotes
                    ];

                    // Reverse the order again to display the latest quotes first
                    return mergedRows.reverse();
                });
            }
        });

        // Unsubscribe from the database listener when the component unmounts
        return () => unsubscribe();
    }, [db]);

    const theme = useTheme();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                width: 500,
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
                {[0, 1].map((index) => (
                    <TabPanel key={index} value={value} index={index} dir={theme.direction}>
                        <TableContainer component={Paper} sx={{ maxHeight: 150, overflowY: 'auto' }}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <StickyStyledTableCell align="left">SECURITY</StickyStyledTableCell>
                                        <StickyStyledTableCell align="left">VOLUME</StickyStyledTableCell>
                                        <StickyStyledTableCell align="left">BID</StickyStyledTableCell>
                                        <StickyStyledTableCell align="left">OFFER</StickyStyledTableCell>
                                        <StickyStyledTableCell align="left">VALID FOR</StickyStyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <QuoteTableRow key={row.id} row={row} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                ))}
            </SwipeableViews>
        </Box>
    );
}
