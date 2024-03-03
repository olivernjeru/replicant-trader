import React from 'react';
import LogIn from "../components/logIn/LogIn";
import MainLayout from '../layout/NotLoggedInMainLayout';
import './LogInPage.css';

function LogInPage() {
    return (
        <div className="LogIn">
            <MainLayout>
                <LogIn className="LogIn" />
            </MainLayout>
        </div>
    )
}

export default LogInPage;
