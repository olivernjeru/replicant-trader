import * as React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { firestoredb, storage } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from 'firebase/storage';

export default function ClientContext({ selectedClientId }) {
  const [clientData, setClientData] = React.useState({ profilePictureUrl: "", displayName: "", nationalId: "" });

  React.useEffect(() => {
    const fetchClientData = async () => {
      if (selectedClientId) {
        try {
          const clientDocRef = doc(firestoredb, 'user-details', selectedClientId);
          const clientDocSnapshot = await getDoc(clientDocRef);

          if (clientDocSnapshot.exists()) {
            const clientDetails = clientDocSnapshot.data();
            const { displayName, nationalId } = clientDetails;

            const storageRef = ref(storage, `user_details/profile_pictures/${selectedClientId}`);
            const profilePictureUrl = await getDownloadURL(storageRef);

            setClientData({ profilePictureUrl, displayName, nationalId });
          } else {
            console.log('No such client document!');
          }
        } catch (error) {
          console.error('Error fetching client details:', error);
        }
      }
    };

    fetchClientData();
  }, [selectedClientId]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Avatar src={clientData.profilePictureUrl} alt="Client" sx={{ width: 50, height: 50, mr: 2 }} />
      <Box>
        <Typography variant="subtitle1" sx={{ color: 'white' }}>
          {clientData.displayName}
        </Typography>
        <Typography variant="body2" sx={{ color: 'gray' }}>
          National ID: {clientData.nationalId}
        </Typography>
      </Box>
    </Box>
  );
}
