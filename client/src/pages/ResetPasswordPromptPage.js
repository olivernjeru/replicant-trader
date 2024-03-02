import React from 'react';
import './ResetPasswordPromptPage.css';
import MainLayout from '../layout/NotLoggedInMainLayout';
import ResetPasswordPrompt from '../components/reset-password/ResetPasswordPrompt';



export default function ResetPasswordPromptPage() {
    return (
        <div className="ResetPasswordPromptPage">
            <MainLayout>
                <ResetPasswordPrompt />
            </MainLayout>
        </div>

    );
}
