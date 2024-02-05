import React from 'react';
import NotLoggedIn from '../components/navigation/notLoggedIn/NotLoggedIn';;

export default function MainLayout({children}) {
    return (
        <div className="MainLayout">
            <NotLoggedIn />
            <div>{children}</div>
        </div>
    );
}
