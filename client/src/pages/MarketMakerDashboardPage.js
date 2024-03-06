import React from 'react';
import LoggedInMainLayout from '../layout/LoggedInMainLayout';
import './MarketMakerDashboardPage.css';
import FinancialInstrumentTracker from '../components/dashboards/marketMaker/FinancialInstrumentTracker';
import HistoricalPerformanceTracker from '../components/dashboards/marketMaker/HistoricalPerformance';
import Chat from '../components/dashboards/marketMaker/Chat';
import Quote from '../components/dashboards/marketMaker/Quote';

export default function MarketMakerDashboardPage() {
    return (
        <div className="MarketMakerDashboard">
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
