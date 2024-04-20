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
                        ...quote
                    }))
                );
                setRows(updatedRows);
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
                        <TableContainer component={Paper}>
                            <Table sx={{ maxWidth: 500 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">SECURITY</StyledTableCell>
                                        <StyledTableCell align="left">VOLUME</StyledTableCell>
                                        <StyledTableCell align="left">BID</StyledTableCell>
                                        <StyledTableCell align="left">OFFER</StyledTableCell>
                                        <StyledTableCell align="left">VALID FOR</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <StyledTableCell align="left">{row.stockTicker}</StyledTableCell>
                                            <StyledTableCell align="left">{row.volume}</StyledTableCell>
                                            <StyledTableCell align="left">{row.bid}</StyledTableCell>
                                            <StyledTableCell align="left">{row.offer}</StyledTableCell>
                                            <StyledTableCell align="left">{row.validFor}</StyledTableCell>
                                        </TableRow>
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
