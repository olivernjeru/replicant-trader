# REPLICANT TRADER

## A trade faciliating platform

### HOW TO INSTALL AND RUN CLIENT
Create your Firebase Project. Intialize Google Firebase Authentication, Firestore and Storage. Import your keys from your firebaseConfig Object in your Project Settings into a .env.local file stored in the client's root folder. Sign up for a PolygonIO account and create three Keys, FIT Key, HP Key and Client Key. Import these keys as well.

You can have them like so:
REACT_APP_FIREBASE_API_KEY=key
REACT_APP_FIREBASE_AUTH_DOMAIN=domain
REACT_APP_FIREBASE_DATABASE_URL=url
REACT_APP_FIREBASE_PROJECT_ID=proejctID
REACT_APP_FIREBASE_STORAGE_BUCKET=storageBucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=senderID
REACT_APP_FIREBASE_APP_ID=APPID
REACT_APP_POLYGONIO_MM_FIT_KEY=key
REACT_APP_POLYGONIO_MM_HP_KEY=key
REACT_APP_POLYGONIO_CLIENT_KEY=key


In the terminal, cd into client and type `npm start` command to run the client application