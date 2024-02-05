import React from 'react';
import './ResetPasswordPage.css';
import MainLayout from '../layout/MainLayout';
import ResetPassword from '../components/reset-password/ResetPassword';



export default function ResetPasswordPage() {
    return (
        <div className="ResetPasswordPage">
            <MainLayout>
                <ResetPassword />
            </MainLayout>
        </div>

    );
}
