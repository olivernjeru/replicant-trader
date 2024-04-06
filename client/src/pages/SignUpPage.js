import React from 'react';
import './SignUpPage.css';
import MainLayout from '../layout/NotLoggedInMainLayout';
import SignUp from '../components/authentication/sign-up/SignUp';



export default function SignUpPage() {
    return (
        <div className="SignUpPage">
            <MainLayout>
                <SignUp />
            </MainLayout>
        </div>

    );
}
