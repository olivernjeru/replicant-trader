import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth, firestoredb } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function PrivateRoutes({ allowedRole }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(firestoredb, 'user-details', user.uid));
                setUser({ ...user, role: userDoc.data().tradingNo });
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

    if (!user) {
        return <Navigate to="login" />;
    }

    // Check if the user has the correct role
    if (user.role.startsWith('MM') && allowedRole === 'client') {
        return <Navigate to="/mm-dashboard" />;
    } else if (user.role.startsWith('C') && allowedRole === 'market-maker') {
        return <Navigate to="/client" />;
    }

    return <Outlet />;
}
