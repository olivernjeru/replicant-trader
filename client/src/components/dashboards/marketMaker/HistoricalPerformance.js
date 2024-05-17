import React, { useState, useEffect } from 'react';
import AggregateHistoricalPerformanceTracker from './AggregateHistoricalPerformance';
import USTradingViewHistoricalPerformance from './USTradingViewHistoricalPerformance';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ThemeProvider } from '@mui/material/styles';
import defaultTheme from '../../styleUtilities/DefaultTheme'

export default function HistoricalPerformance() {
    const [selectedWidget, setSelectedWidget] = useState('aggregate');

    // Retrieve the selected widget from localStorage when the component mounts
    useEffect(() => {
        const savedWidget = localStorage.getItem('selectedWidget');
        if (savedWidget) {
            setSelectedWidget(savedWidget);
        }
    }, []);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setSelectedWidget(newValue);
        // Save the selected widget to localStorage
        localStorage.setItem('selectedWidget', newValue);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <div>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="select-widget-label">Widget</InputLabel>
                    <Select
                        labelId="select-widget-label"
                        id="select-widget"
                        value={selectedWidget}
                        label="Widget"
                        onChange={handleChange}
                    >
                        <MenuItem value="aggregate">Aggregate Historical Performance</MenuItem>
                        <MenuItem value="tradingview">TradingView Chart</MenuItem>
                    </Select>
                </FormControl>
                {selectedWidget === 'aggregate' ? <AggregateHistoricalPerformanceTracker /> : <USTradingViewHistoricalPerformance />}
            </div>
        </ThemeProvider>
    );
}
