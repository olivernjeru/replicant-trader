import React from 'react';
import LoggedInMainLayout from '../layout/LoggedInMainLayout';
import './ClientDashboardPage.css';
import FinancialInstrumentTracker from '../components/dashboards/client/FinancialInstrumentTracker';
import HistoricalPerformanceTracker from '../components/dashboards/marketMaker/HistoricalPerformance';
import Chat from '../components/dashboards/client/Chat';
import Quote from '../components/dashboards/client/Quote';

export default function ClientDashboardPage() {
    return (
        <div className="ClientDashboard">
            <LoggedInMainLayout>
                    <div className="top">
                        <div className="fit">
                            <FinancialInstrumentTracker />
                        </div>
                        <div className="hp">
                            <HistoricalPerformanceTracker />
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="chat">
                            <Chat />
                        </div>
                        <div className="quote">
                            <Quote />
                        </div>
                    </div>


            </LoggedInMainLayout>
        </div>
    )
}
