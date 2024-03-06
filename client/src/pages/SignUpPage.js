import React from 'react';
import './SignUpPage.css';
import MainLayout from '../layout/NotLoggedInMainLayout';
import Register from '../components/sign-up/SignUp';



export default function SignUpPage() {
    return (
        <div className="SignUpPage">
            <MainLayout>
                <Register />
            </MainLayout>
        </div>

    );
}
