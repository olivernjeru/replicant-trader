import React from 'react';
import { Box, Container } from '@mui/material';
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
                <div className='top'>
                    <div>
                        <Box sx={{ minHeight: '43vh', mt: 1, padding: 1, width: '49vw', borderRadius: 0 }}>
                            <FinancialInstrumentTracker />
                        </Box>
                    </div>
                    <div>
                        <Box sx={{ minHeight: '43vh', mt: 1, padding: 1, width: '49vw', borderRadius: 0 }}>
                            <HistoricalPerformanceTracker />
                        </Box>
                    </div>
                </div>
                <div className="bottom">
                    <div>
                        <Box sx={{ minHeight: '47.5vh', mt: 1, padding: 1, width: '49vw', borderRadius: 0 }}>
                            <Chat />
                        </Box>
                    </div>
                    <div>
                        <Box sx={{ minHeight: '47.5vh', mt: 1, padding: 1, width: '49vw', borderRadius: 0 }}>
                            <Quote />
                        </Box>
                    </div>
                </div >
            </LoggedInMainLayout >
        </div >
    )
}
