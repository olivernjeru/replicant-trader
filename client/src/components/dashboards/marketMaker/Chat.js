import * as React from "react";
import { Box, TextField, Button, Typography, Paper, InputAdornment, IconButton, Divider, Container, Avatar, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { auth, firestoredb, storage } from "../../../firebase";
import { addDoc, collection, serverTimestamp, query, orderBy, onSnapshot, getDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, getDownloadURL } from 'firebase/storage';
import { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);
  const [clients, setClients] = useState([]);
  const [clientData, setClientData] = useState({ profilePictureUrl: "", displayName: "", nationalId: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(null);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      setError("Enter valid message");
      setTimeout(() => setError(null), 1500);
      return;
    }
    const { uid, email } = auth.currentUser;
    const roomId = [uid, selectedClientId].sort().join("_");

    try {
      const roomDocRef = doc(collection(firestoredb, 'rooms'), roomId);
      const messagesSubCollectionRef = collection(roomDocRef, 'messages');

      await addDoc(messagesSubCollectionRef, {
        text: message,
        name: email,
        createdAt: serverTimestamp(),
        uid,
      });

      setMessage("");
    } catch (error) {
      setError("Failed to send message");
      setTimeout(() => setError(null), 1500);
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

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    let unsubscribe;
    const fetchMessages = async () => {
      if (selectedClientId) {
        const roomId = [auth.currentUser.uid, selectedClientId].sort().join("_");
        const roomDocRef = doc(firestoredb, 'rooms', roomId);
        const messagesQuery = query(
          collection(roomDocRef, 'messages'),
          orderBy("createdAt", "asc")
        );
        unsubscribe = onSnapshot(messagesQuery, (QuerySnapshot) => {
          const fetchedMessages = [];
          QuerySnapshot.forEach((doc) => {
            fetchedMessages.push({ ...doc.data(), id: doc.id });
          });
          setMessages(fetchedMessages);

          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
              chatContainerRef.current.scrollHeight;
          }
        });
      } else {
        setMessages([]);
      }
    };
    fetchMessages();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedClientId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClientClick = async (clientId) => {
    setSelectedClientId(clientId);
    try {
      const clientDocRef = doc(firestoredb, 'user-details', clientId);
      const clientDocSnapshot = await getDoc(clientDocRef);

      if (clientDocSnapshot.exists()) {
        const clientData = clientDocSnapshot.data();
        const { displayName, nationalId } = clientData;

        const storageRef = ref(storage, `user_details/profile_pictures/${clientId}`);
        const profilePictureUrl = await getDownloadURL(storageRef);

        setClientData({ profilePictureUrl, displayName, nationalId });
      } else {
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
                borderColor: 'white',
              },
              '& input': {
                color: 'white',
              }
            }
          }}
          InputLabelProps={{
            style: {
              color: 'white',
            }
          }}
        />
        <Divider sx={{ backgroundColor: 'white' }} />
        <List>
          {clients.filter(client => client.displayName.toLowerCase().includes(searchTerm.toLowerCase())).map((client) => (
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
          overflowY: 'auto'
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
              transition: 'opacity 0.5s',
              opacity: 1,
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
                borderColor: 'white',
              },
              '& input': {
                color: 'white',
              }
            }
          }}
          InputLabelProps={{
            style: {
              color: 'white',
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
