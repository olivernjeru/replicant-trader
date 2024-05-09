import React from 'react';
import LoggedInMainLayout from '../layout/LoggedInMainLayout';
import Settings from '../components/settings/Settings';
// import './AccountSettingsPage.css';

export default function AccountSettingsPage() {
    return (
        <div className="AccountSettings">
            <LoggedInMainLayout>
                <Settings />
            </LoggedInMainLayout>
        </div>
    );
}
