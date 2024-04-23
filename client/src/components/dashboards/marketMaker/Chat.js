import * as React from "react";
import { Box, TextField, Button, Typography, Paper, InputAdornment, IconButton } from "@mui/material";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import SearchIcon from '@mui/icons-material/Search';
import { Avatar } from "@mui/material";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";

const messages = [
  { id: 1, text: "Hi there!", sender: "client" },
  { id: 2, text: "Hello!", sender: "user" },
];

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
    <Container sx={{ display: 'flex', justifyContent: "space-between", backgroundColor: '#112240', ml: 3 }}>
      <Box sx={{ ml: -3, padding: 0}}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mb: 1, mt: 1 }}
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
            sx: {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white', // Change outline color
              },
              '& input': {
                color: 'white', // Change input text color
              }
            }
          }}
          InputLabelProps={{
            style: {
              color: 'white', // Change label text color
            }
          }}
        />
        <Divider sx={{ backgroundColor: 'white' }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Jane Doe" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Box
        sx={{
          height: "40vh",
          width: '350px',
          display: "flex",
          flexDirection: "column",
          padding: '1%',
          mr: -3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, mt: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }} />
          <Typography> JANE DOE </Typography>
          <Typography> 543 789 8890 </Typography>
        </Box>
        <Divider sx={{ backgroundColor: 'white' }}/>
        <Box sx={{ flexGrow: 1 }}>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </Box>
        <TextField
          label="Type a message"
          fullWidth
          size="small"
          variant="outlined"
          value={input}
          onChange={handleInputChange}
          sx={{ mb: 1 }}
          InputProps={{
            sx: {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white', // Change outline color
              },
              '& input': {
                color: 'white', // Change input text color
              }
            }
          }}
          InputLabelProps={{
            style: {
              color: 'white', // Change label text color
            }
          }}
        />
        <Button
          fullWidth
          color="primary"
          variant="contained"
          onClick={handleSend}
        >
          SEND MESSAGE
        </Button>
      </Box>
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
        paddingTop: 0,
      }}
    >
      <Paper
        sx={{
          backgroundColor: "transparent",
          padding: 0,
          boxShadow: "none", // Remove the shadow
        }}
      >
        <Typography>{message.text}</Typography>
      </Paper>
    </Box>
  );
};
