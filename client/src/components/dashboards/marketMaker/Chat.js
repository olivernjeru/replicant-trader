import * as React from "react";
import { Box, TextField, Button, Typography, Grid, Paper, InputAdornment, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import SearchIcon from '@mui/icons-material/Search';
import { Avatar } from "@mui/material";
import './Chat.css'

const messages = [
  { id: 1, text: "Hi there!", sender: "client" },
  { id: 2, text: "Hello!", sender: "user" },
  { id: 3, text: "How can I assist you today?", sender: "client" },
];

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

export default function Chat() {
  const [input, setInput] = React.useState("");

  const handleSend = () => {
    if (input.trim() !== "") {
      console.log(input);
      setInput("");
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container sx={{ bgcolor: "yellow", display: 'flex' }}>
      <ThemeProvider theme={defaultTheme}>
        <Box>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mb: 3 }}
            value={searchTerm}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="search">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Divider />
        </Box>
        <Box
          sx={{
            height: "40vh",
            display: "flex",
            flexDirection: "column",
            padding: '1%'
            // bgcolor: "grey.200",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar></Avatar>
            <Typography variant="body1" gutterBottom sx={{ paddingLeft: '12%', paddingRight: '12%' }}>JANE DOE</Typography>
            <Typography variant="body1" gutterBottom>543 789 8890</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, p: 2 }}>
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </Box>
          <Divider />
          <Box sx={{ p: 3, backgroundColor: "background.primary" }}>
            <Grid container spacing={1}>
              <Grid item xs={0}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Type a message"
                  variant="outlined"
                  value={input}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSend}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </ThemeProvider>
    </Container>
  );
};

const Message = ({ message }) => {
  const isClient = message.sender === "client";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isClient ? "flex-start" : "flex-end",
        mb: 1,
      }}
    >
      <Paper
        sx={{
          backgroundColor: "transparent",
        }}
      >
        <Typography variant="body1">{message.text}</Typography>
      </Paper>
    </Box>
  );
};
