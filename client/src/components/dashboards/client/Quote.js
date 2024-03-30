import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material/';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styled from '@emotion/styled';
import './Quote.css';

function createData(market_maker, security, volume, bid, offer, valid_for) {
    return { market_maker, security, volume, bid, offer, valid_for };
}

const rows = [
    createData('George B', 'TSLA', 4000, 211.20, 209.20, 120)
];

export default function Quote() {
    const StyledTableCell = styled(TableCell)({
        color: 'white', // Set text color to white
    });

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <ButtonGroup
                    disableElevation
                    fullWidth
                    variant="contained"
                    aria-label="Disabled button group"
                >
                    <Button>Live Quotes</Button>
                    <Button>Old Quotes</Button>
                </ButtonGroup>
                <TableContainer component={Paper}>
                    <Table sx={{ maxWidth: 250 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>MARKET MAKER</StyledTableCell>
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
                                        {row.market_maker}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{row.security}</StyledTableCell>
                                    <StyledTableCell align="left">{row.volume}</StyledTableCell>
                                    <StyledTableCell align="left"><Button>Sell{row.bid}</Button></StyledTableCell>
                                    <StyledTableCell align="left"><Button>Buy{row.offer}</Button></StyledTableCell>
                                    <StyledTableCell align="left">{row.valid_for}</StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}