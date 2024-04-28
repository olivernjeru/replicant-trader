import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth, firestoredb } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ReversePrivateRoutes() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(firestoredb, 'user-details', user.uid));
                setUser(userDoc.data());
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while checking authentication state
    }

    // If user is not logged in, render the protected routes
    if (!user) {
        return <Outlet />;
    }

    // If user is logged in, check their trading number
    if (user.tradingNo.startsWith('MM')) {
        return <Navigate to="/mm-dashboard" />;
    } else if (user.tradingNo.startsWith('C')) {
        return <Navigate to="/client" />;
    }

    // If trading number doesn't match, navigate to default route
    return <Navigate to="/" />;
}
