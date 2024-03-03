import React from 'react';
import NotLoggedIn from '../components/navigation/notLoggedIn/NotLoggedIn';;

export default function NotLoggedInMainLayout({children}) {
    return (
        <div className="NotLoggedInMainLayout">
            <NotLoggedIn />
            <div>{children}</div>
        </div>
    );
}
