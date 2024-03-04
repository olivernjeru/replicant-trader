import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

function createData( client, security, volume, bid, offer, valid_for ) {
    return { client, security, volume, bid, offer, valid_for };
}

const rows = [
    createData('Jane Doe', 'TSLA', 4000, 211.20, 209.20, 120)
];

export default function Quote() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            username: data.get('username'),
            password: data.get('password'),
        });
    };

    const StyledTableCell = styled(TableCell)({
        color: 'white', // Set text color to white
      });

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={{
                        padding: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex' }}>
                            <TextField
                                margin="normal"
                                required
                                id="stock-ticker-input"
                                label="TSLA"
                                name="stock-ticker-input"
                                autoComplete="stock-ticker-input"
                                sx={{ margin: 1 }}
                            />
                            <TextField
                                margin="normal"
                                required
                                id="bid"
                                label="Bid"
                                name="bid"
                                autoComplete="bid"
                                sx={{ margin: 1 }}
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
                            />
                            <TextField
                                margin="normal"
                                required
                                id="volume"
                                label="Vol"
                                name="volime"
                                autoComplete="volume"
                                sx={{ margin: 1 }}
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
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            SEND QUOTE
                        </Button>
                    </Box>
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
                </Box>
            </Container>
        </ThemeProvider>
    );
}