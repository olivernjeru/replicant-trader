import * as React from "react";
import { Box, TextField, Button, Typography, Paper, InputAdornment, IconButton, Badge } from "@mui/material";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import SearchIcon from '@mui/icons-material/Search';
import { Avatar } from "@mui/material";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { auth, firestoredb, storage } from "../../../firebase";
import { addDoc, collection, serverTimestamp, query, orderBy, onSnapshot, doc, getDoc, updateDoc, getDocs, limit } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState, useRef } from "react";
import { ref, getDownloadURL } from 'firebase/storage';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);
  const [marketMakers, setMarketMakers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastMessages, setLastMessages] = useState({});
  const [unreadMessages, setUnreadMessages] = useState({});
  const [marketMakerData, setMarketMakerData] = useState({
    profilePictureUrl: "",
    displayName: "",
    nationalId: "",
  });
  const [selectedMarketMakerId, setSelectedMarketMakerId] = useState(null);
  const [latestMessages, setLatestMessages] = useState({}); // New state for latest messages

  // Memoize function to cache fetched client data
  const marketMakerCache = useRef({});

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      setError("Enter a valid message");
      setTimeout(() => setError(null), 1500);
      return;
    }
    const { uid, email } = auth.currentUser;
    const roomId = [uid, selectedMarketMakerId].sort().join("_");

    try {
      const roomDocRef = doc(collection(firestoredb, 'chats'), roomId);
      const messagesSubCollectionRef = collection(roomDocRef, 'messages');

      await addDoc(messagesSubCollectionRef, {
        text: message,
        email: email,
        createdAt: serverTimestamp(),
        uid,
        read: false,
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
    const fetchMarketMakers = async () => {
      try {
        const marketMakersQuery = query(collection(firestoredb, 'user-details'), orderBy('displayName'));
        const unsubscribe = onSnapshot(marketMakersQuery, (querySnapshot) => {
          const marketMakersData = [];
          querySnapshot.forEach((doc) => {
            const marketMakerData = doc.data();
            if (marketMakerData.tradingNo.startsWith('MM')) {
              marketMakersData.push({ id: doc.id, displayName: marketMakerData.displayName });
            }
          });
          setMarketMakers(marketMakersData);
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching market makers:', error);
      }
    };
    fetchMarketMakers();
  }, []);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const markMessagesAsRead = async (marketMakerId) => {
    const roomId = [auth.currentUser.uid, marketMakerId].sort().join("_");
    const roomDocRef = doc(firestoredb, 'chats', roomId);
    const messagesQuery = query(
      collection(roomDocRef, 'messages'),
      orderBy("createdAt", "asc")
    );

    const querySnapshot = await getDocs(messagesQuery);
    querySnapshot.forEach(async (messageDoc) => {
      if (messageDoc.data().uid !== auth.currentUser.uid && !messageDoc.data().read) {
        await updateDoc(doc(roomDocRef, 'messages', messageDoc.id), { read: true });
      }
    });

    setUnreadMessages((prev) => ({
      ...prev,
      [marketMakerId]: false,
    }));
  };

  useEffect(() => {
    let unsubscribe;
    const fetchMessages = async () => {
      if (selectedMarketMakerId) {
        const roomId = [auth.currentUser.uid, selectedMarketMakerId].sort().join("_");
        const roomDocRef = doc(firestoredb, "chats", roomId);
        const messagesQuery = query(
          collection(roomDocRef, "messages"),
          orderBy("createdAt", "asc"),
          limit(20)
        );

        unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
          const fetchedMessages = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMessages((prevMessages) => [...prevMessages, ...fetchedMessages]);
          markMessagesAsRead(selectedMarketMakerId);
        });
      } else {
        setMessages([]);
      }
    };
    fetchMessages();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedMarketMakerId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const truncateMessage = (message) => {
    const maxLength = 30; // Maximum length of the message to display without truncation

    if (message.length > maxLength) {
      return `${message.slice(0, maxLength)}...`;
    } else {
      return message;
    }
  };

  const handleMarketMakerClick = async (marketMakerId) => {
    setSelectedMarketMakerId(marketMakerId);
    try {
      await markMessagesAsRead(marketMakerId);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  useEffect(() => {
    const unsubscribeList = [];

    marketMakers.forEach((marketMaker) => {
      const roomId = [auth.currentUser.uid, marketMaker.id].sort().join("_");
      const roomDocRef = doc(firestoredb, "chats", roomId);
      const messagesQuery = query(
        collection(roomDocRef, "messages"),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        let latestMessage = null;

        querySnapshot.forEach((doc) => {
          const messageData = doc.data();

          if (!latestMessage || messageData.createdAt.toDate() > latestMessage.createdAt.toDate()) {
            latestMessage = messageData;
          }
        });

        // Update latest message state
        if (latestMessage) {
          setLatestMessages((prev) => ({
            ...prev,
            [marketMaker.id]: latestMessage,
          }));
        }
      });

      unsubscribeList.push(unsubscribe);
    });

    return () => {
      unsubscribeList.forEach((unsubscribe) => unsubscribe());
    };
  }, [marketMakers]);

  useEffect(() => {
    setMarketMakers((prevMarketMakers) =>
      [...prevMarketMakers].sort((a, b) => {
        const timeA = latestMessages[a.id] ? latestMessages[a.id].createdAt.toDate().getTime() : 0;
        const timeB = latestMessages[b.id] ? latestMessages[b.id].createdAt.toDate().getTime() : 0;
        return timeB - timeA;
      })
    );
  }, [latestMessages]);

  useEffect(() => {
    const fetchMarketMakerData = async () => {
      if (selectedMarketMakerId) {
        try {
          if (marketMakerCache.current[selectedMarketMakerId]) {
            setMarketMakerData(marketMakerCache.current[selectedMarketMakerId]);
          } else {
            const marketMakerDocRef = doc(firestoredb, "user-details", selectedMarketMakerId);
            const marketMakerDocSnapshot = await getDoc(marketMakerDocRef);

            if (marketMakerDocSnapshot.exists()) {
              const marketMakerDetails = marketMakerDocSnapshot.data();
              const { displayName, nationalId } = marketMakerDetails;

              const storageRef = ref(storage, `user_details/profile_pictures/${selectedMarketMakerId}`);
              const profilePictureUrl = await getDownloadURL(storageRef);

              const marketMakerData = { profilePictureUrl, displayName, nationalId };
              setMarketMakerData(marketMakerData);

              // Cache the client data
              marketMakerCache.current[selectedMarketMakerId] = marketMakerData;
            } else {
              console.log("No such market maker document!");
            }
          }
        } catch (error) {
          console.error("Error fetching market maker details:", error);
        }
      }
    };

    fetchMarketMakerData();
  }, [selectedMarketMakerId]);

  const filteredMarketMakers = marketMakers.filter((marketMaker) =>
    marketMaker.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const unsubscribeList = [];

    const listenForMessages = (marketMakerId) => {
      const roomId = [auth.currentUser.uid, marketMakerId].sort().join("_");
      const roomDocRef = doc(firestoredb, 'chats', roomId);
      const messagesQuery = query(
        collection(roomDocRef, 'messages'),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        let hasUnreadMessages = false;
        let lastMessageTime = null;

        querySnapshot.forEach((doc) => {
          const messageData = doc.data();
          if (messageData.uid !== auth.currentUser.uid && !messageData.read) {
            hasUnreadMessages = true;
          }
          lastMessageTime = messageData.createdAt?.toDate();
        });

        setUnreadMessages((prev) => ({
          ...prev,
          [marketMakerId]: hasUnreadMessages,
        }));

        setLastMessages((prev) => ({
          ...prev,
          [marketMakerId]: lastMessageTime,
        }));
      });

      return unsubscribe;
    };

    marketMakers.forEach((marketMaker) => {
      const unsubscribe = listenForMessages(marketMaker.id);
      unsubscribeList.push(unsubscribe);
    });

    return () => {
      unsubscribeList.forEach(unsubscribe => unsubscribe());
    };
  }, [marketMakers]);

  return (
    <Container sx={{ display: 'flex', justifyContent: "space-between", backgroundColor: '#112240' }}>
      <Box sx={{ ml: -3, padding: 1, maxHeight: '43vh', overflowY: 'auto', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#D9D9D9', borderRadius: '4px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#112240' } }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mb: 1, mt: 1, }}
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
          {filteredMarketMakers.map((marketMaker) => (
            <ListItem key={marketMaker.id} disablePadding>
              <ListItemButton onClick={() => handleMarketMakerClick(marketMaker.id)}>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="subtitle1" sx={{ color: "white" }}>
                        {marketMaker.displayName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "gray" }}>
                        {latestMessages[marketMaker.id]?.createdAt?.toDate().toLocaleDateString() || ""}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: "lightgray" }}>
                      {latestMessages[marketMaker.id] ? truncateMessage(latestMessages[marketMaker.id].text) : "No messages"}
                    </Typography>
                  }
                />
                <Badge color="primary" variant="dot" invisible={!unreadMessages[marketMaker.id]} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider orientation="vertical" flexItem sx={{ backgroundColor: "white", mr: 2 }} />
      <Box
        sx={{
          height: "43vh",
          width: '50%',
          display: "flex",
          flexDirection: "column",
          padding: '1%',
          mr: 1,
          overflowY: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={marketMakerData.profilePictureUrl} alt="Market Maker" sx={{ width: 50, height: 50, mr: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ color: 'white' }}>
              {marketMakerData.displayName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>
              National ID: {marketMakerData.nationalId}
            </Typography>
          </Box>
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
          {messages.map(({ id, text, email, createdAt, uid }) => (
            <Box key={id} sx={{ textAlign: uid === auth.currentUser.uid ? 'right' : 'left' }}>
              <Typography variant="body2" color="#999999">
                {email} - {createdAt?.toDate().toLocaleString()}
              </Typography>
              <Typography variant="body1">{text}</Typography>
            </Box>
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
        <Paper
          component="form"
          onSubmit={sendMessage}
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "2px 4px",
            mt: 1,
            boxShadow: "none",
            backgroundColor: "transparent",
          }}
        >
          <TextField
            label="Type your message"
            variant="outlined"
            size="small"
            fullWidth
            value={message}
            onChange={handleMessageChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '& input': {
                  color: 'white',
                }
              }
            }}
            InputLabelProps={{
              style: { color: 'white' }
            }}
          />
          <Button type="submit" variant="contained" sx={{ ml: 1 }}>
            Send
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
