import React from 'react';
import LoggedIn from '../components/navigation/loggedIn/LoggedIn';

export default function LoggedInMainLayout({children}) {
    return (
        <div className="LoggedInMainLayout">
            <LoggedIn />
            <div>{children}</div>
        </div>
    );
}
