import React from 'react';
import './SubmitDetailsPage.css';
import MainLayout from '../layout/NotLoggedInMainLayout';
import SubmitDetails from '../components/submit-details/submitDetails';



export default function SubmitDetailsPage() {
    return (
        <div className="SubmitDetailsPage">
            <MainLayout>
                <SubmitDetails />
            </MainLayout>
        </div>

    );
}
