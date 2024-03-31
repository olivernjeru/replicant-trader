import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid, Paper, InputAdornment, IconButton, Divider, Container, Avatar, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from '@mui/icons-material/Search';

const messages = [
  { id: 1, text: "Hi there!", sender: "client" },
  { id: 2, text: "Hello!", sender: "user" },
  { id: 3, text: "How can I assist you today?", sender: "client" },
];

export default function Chat() {
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSend = () => {
    if (input.trim() !== "") {
      console.log(input);
      setInput("");
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container sx={{ display: 'flex' }}>
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
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="George B" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Box
        sx={{
          height: "40vh",
          display: "flex",
          flexDirection: "column",
          padding: '1%'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar></Avatar>
          <Typography variant="body1" gutterBottom sx={{ paddingLeft: '12%', paddingRight: '12%' }}>George B</Typography>
          <Typography variant="body1" gutterBottom>321 789 8890</Typography>
        </Box>
        <Box sx={{ flexGrow: 1, p: 2 }}>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </Box>
        <Divider />
        <Box sx={{ p: 3 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={9}>
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
    </Container>
  );
}

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
