import * as React from "react";
import { Box, TextField, Button, Typography, Paper, InputAdornment, IconButton } from "@mui/material";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import SearchIcon from '@mui/icons-material/Search';
import { Avatar } from "@mui/material";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { auth, firestoredb, storage } from "../../../firebase";
import { addDoc, collection, serverTimestamp, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { ref, getDownloadURL } from 'firebase/storage';

export default function Chat() {
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const chatContainerRef = React.useRef(null);
  const [error, setError] = React.useState(null);
  const [user] = useAuthState(auth);
  const [clients, setClients] = useState([]);
  const [clientData, setClientData] = useState({ profilePictureUrl: "", displayName: "", nationalId: "" });

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

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsQuery = query(collection(firestoredb, 'user-details'), orderBy('displayName'));
        const unsubscribe = onSnapshot(clientsQuery, (querySnapshot) => {
          const clientsData = [];
          querySnapshot.forEach((doc) => {
            const clientData = doc.data();
            if (clientData.tradingNo.startsWith('C')) {
              clientsData.push({ id: doc.id, displayName: clientData.displayName });
            }
          });
          setClients(clientsData);
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchClients();
  }, []);

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  React.useEffect(() => {
    const fetchMessages = async () => {
      const messagesQuery = query(
        collection(firestoredb, "messages"),
        orderBy("createdAt", "desc"),
        // limit(250)
      );
      const unsubscribe = onSnapshot(messagesQuery, (QuerySnapshot) => {
        const fetchedMessages = [];
        QuerySnapshot.forEach((doc) => {
          fetchedMessages.push({ ...doc.data(), id: doc.id });
        });
        const sortedMessages = fetchedMessages.sort(
          (a, b) => a.createdAt - b.createdAt
        );
        setMessages(sortedMessages);

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

  const handleClientClick = async (clientId) => {
    try {
      const clientDocRef = doc(firestoredb, 'user-details', clientId);
      const clientDocSnapshot = await getDoc(clientDocRef);

      if (clientDocSnapshot.exists()) {
        const clientData = clientDocSnapshot.data();
        const { displayName, nationalId } = clientData;

        // Fetch the profile picture URL from Firebase Storage
        const storageRef = ref(storage, `user_details/profile_pictures/${clientId}`); // Adjust the path as per your storage structure
        const profilePictureUrl = await getDownloadURL(storageRef);

        // Update the state with the client's data
        setClientData({ profilePictureUrl, displayName, nationalId });
      } else {
        // If client does not exist, display blank
        setClientData({ profilePictureUrl: "", displayName: "", nationalId: "" });
      }
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

  return (
    <Container sx={{ display: 'flex', justifyContent: "space-between", backgroundColor: '#112240' }}>
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
          {clients.map((client) => (
            <ListItem key={client.id} disablePadding>
              <ListItemButton onClick={() => handleClientClick(client.id)}>
                <ListItemText primary={client.displayName} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box
        sx={{
          height: "45vh",
          width: '50%',
          display: "flex",
          flexDirection: "column",
          padding: '1%',
          mr: 1,
          overflowY: 'auto' // Enable vertical scrolling
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, mt: 1 }}>
          <Avatar src={clientData.profilePictureUrl} sx={{ width: 32, height: 32 }} />
          <Typography>{clientData.displayName}</Typography>
          <Typography>{clientData.nationalId}</Typography>
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
            <Message key={message.id} message={message} currentUser={user} />
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

const Message = ({ message, currentUser }) => {
  const isCurrentUserMessage = message.uid === currentUser.uid;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isCurrentUserMessage ? "flex-end" : "flex-start",
        mb: 1,
        paddingTop: 0,
      }}
    >
      <Paper
        sx={{
          backgroundColor: "transparent",
          padding: 0,
          boxShadow: "none",
        }}
      >
        <Typography>{isCurrentUserMessage ? "You: " : message.name + ": "}{message.text}</Typography>
      </Paper>
    </Box>
  );
};
