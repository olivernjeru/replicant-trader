import React from 'react';
import './RegisterPage.css';
import MainLayout from '../layout/NotLoggedInMainLayout';
import Register from '../components/register/Register';



export default function RegisterPage() {
    return (
        <div className="RegisterPage">
            <MainLayout>
                <Register />
            </MainLayout>
        </div>

    );
}
