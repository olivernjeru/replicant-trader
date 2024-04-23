import * as React from "react";
import { Box, TextField, Button, Typography, Paper, InputAdornment, IconButton } from "@mui/material";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import SearchIcon from '@mui/icons-material/Search';
import { Avatar } from "@mui/material";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { auth, firestoredb } from "../../../firebase";
import { addDoc, collection, serverTimestamp, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";

export default function Chat() {
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const chatContainerRef = React.useRef(null);
  const [error, setError] = React.useState(null);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      setError("Enter valid message");
      setTimeout(() => setError(null), 1500); // Remove error after 3 seconds
      return;
    }
    const { uid, email } = auth.currentUser;
    try {
      await addDoc(collection(firestoredb, "messages"), {
        text: message,
        name: email,
        createdAt: serverTimestamp(),
        uid,
      });
      setMessage("");
    } catch (error) {
      setError("Failed to send message"); // Handle any errors from Firestore
      setTimeout(() => setError(null), 1500); // Remove error after 3 seconds
    }
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  React.useEffect(() => {
    const fetchMessages = async () => {
      const messagesQuery = query(
        collection(firestoredb, "messages"),
        orderBy("createdAt")
      );
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const fetchedMessages = [];
        snapshot.forEach((doc) => {
          fetchedMessages.push({ id: doc.id, ...doc.data() });
        });
        setMessages(fetchedMessages);

        // Scroll to the bottom of the chat area if chatContainerRef.current exists
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      });
      return unsubscribe;
    };
    fetchMessages();
  }, []);

  // Scroll to the bottom of the chat container when messages are updated
  React.useEffect(() => {
    // Scroll to the bottom of the chat area if chatContainerRef.current exists
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Container sx={{ display: 'flex', justifyContent: "space-between", backgroundColor: '#112240', ml: 3 }}>
      <Box sx={{ ml: -3, padding: 0 }}>
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
          mr: -3,
          overflowY: 'auto' // Enable vertical scrolling
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, mt: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }} />
          <Typography> JANE DOE </Typography>
          <Typography> 543 789 8890 </Typography>
        </Box>
        <Divider sx={{ backgroundColor: 'white' }} />
        <Box
          ref={chatContainerRef}
          sx={{
            flexGrow: 1,
            overflowY: 'scroll',
            paddingRight: 2,
            maxHeight: 'calc(40vh - 110px)',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#D9D9D9',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#112240',
            },
          }}
        >
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </Box>
        {error && (
          <Paper
            sx={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#f44336',
              color: '#fff',
              padding: '10px',
              borderRadius: '8px',
              zIndex: '999',
              transition: 'opacity 0.5s', // Add transition for smooth appearance
              opacity: 1, // Initially set to visible
            }}
          >
            {error}
          </Paper>
        )}

        <TextField
          label="Type a message"
          fullWidth
          size="small"
          variant="outlined"
          value={message}
          onChange={handleMessageChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              sendMessage(event);
            }
          }}
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
          onClick={sendMessage}
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
