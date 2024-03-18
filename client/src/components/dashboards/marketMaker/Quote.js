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
import FloatingActionButtonZoom from './quoteTable';

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
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box component="form" onSubmit={handleSubmit} noValidate >
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
                            sx={{ mt: 0, mb: 1 }}
                        >
                            SEND QUOTE
                        </Button>
                    </Box>
                    <FloatingActionButtonZoom />
                </Box>
            </Container>
        </ThemeProvider>
    );
}