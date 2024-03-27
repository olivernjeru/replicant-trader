import * as React from 'react';
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

function a11yProps(index) {
    return {
        id: `action-tab-${index}`,
        'aria-controls': `action-tabpanel-${index}`,
    };
}

const fabStyle = {
    position: 'absolute',
    bottom: 16,
    right: 16,
};

function createData(client, security, volume, bid, offer, valid_for) {
    return { client, security, volume, bid, offer, valid_for };
}

const rows = [
    createData('Jane Doe', 'TSLA', 4000, 211.20, 209.20, 120)
];

export default function QuotesTable() {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const StyledTableCell = styled(TableCell)({
        color: 'white', // Set text color to white
    });

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
                    <Tab label="Live Quotes" {...a11yProps(0)} />
                    <Tab label="Old Quotes" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <TableContainer component={Paper}>
                        <Table sx={{ maxWidth: 250 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>CLIENT</StyledTableCell>
                                    <StyledTableCell align="left">SECURITY</StyledTableCell>
                                    <StyledTableCell align="left">VOLUME</StyledTableCell>
                                    <StyledTableCell align="left">BID</StyledTableCell>
                                    <StyledTableCell align="left">OFFER</StyledTableCell>
                                    <StyledTableCell align="left">VALID FOR</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.client}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <StyledTableCell component="th" scope="row">
                                            {row.client}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{row.security}</StyledTableCell>
                                        <StyledTableCell align="left">{row.volume}</StyledTableCell>
                                        <StyledTableCell align="left">{row.bid}</StyledTableCell>
                                        <StyledTableCell align="left">{row.offer}</StyledTableCell>
                                        <StyledTableCell align="left">{row.valid_for}</StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <TableContainer component={Paper}>
                        <Table sx={{ maxWidth: 250 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>CLIENT</StyledTableCell>
                                    <StyledTableCell align="left">SECURITY</StyledTableCell>
                                    <StyledTableCell align="left">VOLUME</StyledTableCell>
                                    <StyledTableCell align="left">BID</StyledTableCell>
                                    <StyledTableCell align="left">OFFER</StyledTableCell>
                                    <StyledTableCell align="left">VALID FOR</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.client}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <StyledTableCell component="th" scope="row">
                                            {row.client}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{row.security}</StyledTableCell>
                                        <StyledTableCell align="left">{row.volume}</StyledTableCell>
                                        <StyledTableCell align="left">{row.bid}</StyledTableCell>
                                        <StyledTableCell align="left">{row.offer}</StyledTableCell>
                                        <StyledTableCell align="left">{row.valid_for}</StyledTableCell>
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
