import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../../../firebase';

export default function PrivateRoutes() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        // Clean up function to unsubscribe when component unmounts
        return unsubscribe;
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while checking authentication state
    }

    // If user is not logged in, redirect to login page
    if (!user) {
        return <Navigate to="login" />;
    }

    // If user is logged in, render the protected routes
    return <Outlet />;
}
