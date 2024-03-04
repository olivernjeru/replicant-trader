import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material/';

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

export default function Quote() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            username: data.get('username'),
            password: data.get('password'),
        });
    };

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
                </Box>
            </Container>
        </ThemeProvider>
    );
}