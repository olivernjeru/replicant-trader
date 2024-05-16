import React from 'react';
import { Box } from '@mui/material';
import LoggedInMainLayout from '../layout/LoggedInMainLayout';
import './ClientDashboardPage.css';
import FinancialInstrumentTracker from '../components/dashboards/client/FinancialInstrumentTracker';
import HistoricalPerformanceTracker from '../components/dashboards/client/HistoricalPerformance';
import Chat from '../components/dashboards/client/Chat';
import Quote from '../components/dashboards/client/Quote';

export default function ClientDashboardPage() {
    return (
        <div className="ClientDashboard">
            <LoggedInMainLayout>
                <div className="ClientTop">
                    <div>
                        <Box sx={{ minHeight: '41vh', mt: 1, padding: 1, width: '48vw', borderRadius: 0 }}>
                            <FinancialInstrumentTracker />
                        </Box>
                    </div>
                    <div>
                        <Box sx={{ minHeight: '41vh', mt: 1, padding: 1, width: '48vw', borderRadius: 0 }}>
                            <HistoricalPerformanceTracker />
                        </Box>
                    </div>
                </div>
                <div className="ClientBottom">
                    <div>
                        <Box sx={{ minHeight: '45vh', mt: 1, padding: 1, width: '48vw', borderRadius: 0 }}>
                            <Chat />
                        </Box>
                    </div>
                    <div>
                        <Box sx={{ minHeight: '45vh', mt: 1, padding: 1, width: '48vw', borderRadius: 0 }}>
                            <Quote />
                        </Box>
                    </div>
                </div>
            </LoggedInMainLayout>
        </div>
    )
}
