import React from 'react';
import LoggedIn from '../components/navigationBars/loggedIn/LoggedIn';
import './LoggedInMainLayout.css';

export default function LoggedInMainLayout({ children }) {
    return (
        <div className="LoggedInMainLayout">
            <LoggedIn />
            <div className="content">{children}</div>
        </div>
    );
}
