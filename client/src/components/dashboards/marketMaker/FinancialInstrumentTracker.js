import React, { useState, useEffect } from 'react';
import USEquitiesFinancialInstrumentTracker from './USEquitiesFinancialInstrumentTracker';
import KenyaEquitiesFinancialInstrumentTracker from './KenyaEquitiesFinancialInstrumentTracker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ThemeProvider } from '@mui/material/styles';
import defaultTheme from '../../styleUtilities/DefaultTheme';

export default function FinancialInstrumentTracker() {
  const [selectedOption, setSelectedOption] = useState('us');

  // Retrieve the selected country from localStorage when the component mounts
  useEffect(() => {
    const savedOption = localStorage.getItem('selectedCountry');
    if (savedOption) {
      setSelectedOption(savedOption);
    }
  }, []);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedOption(newValue);
    // Save the selected country to localStorage
    localStorage.setItem('selectedCountry', newValue);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <div>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="select-country-label">Country</InputLabel>
          <Select
            labelId="select-country-label"
            id="select-country"
            value={selectedOption}
            label="Country"
            onChange={handleChange}
          >
            <MenuItem value="us">US Mag 5 Equities</MenuItem>
            <MenuItem value="kenya">Kenya Equities</MenuItem>
          </Select>
        </FormControl>
        {selectedOption === 'us' ? <USEquitiesFinancialInstrumentTracker /> : <KenyaEquitiesFinancialInstrumentTracker />}
      </div>
    </ThemeProvider>
  );
}
