import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, CircularProgress } from '@mui/material';
import { restClient } from '@polygon.io/client-js';
import { useState, useEffect, useRef } from 'react';

function createData(equity, bond, fx, commodity) {
  return { equity, bond, fx, commodity };
}

const rows = [
  createData('AMZN', '', ''),
  createData('TSLA', '', ''),
  createData('AAPL', '', ''),
  createData('NVDA', '', ''),
  createData('META', '', ''),
];

const key = process.env.REACT_APP_POLYGONIO_MM_FIT_KEY;

export default function USEquitiesFinancialInstrumentTracker() {
  const [prices, setPrices] = useState({}); // State for all fetched prices
  const [afterHoursPrices, setAfterHoursPrices] = useState({}); // State for after-hours prices
  const [startDate, setStartDate] = useState(''); // State for start date
  const [endDate, setEndDate] = useState(''); // State for end date
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error message
  const intervalRef = useRef(null); // Reference to store the interval ID

  const fetchData = async () => {
    setError(null);

    const rest = restClient(key);
    const tickers = ['TSLA', 'AAPL', 'AMZN', 'NVDA', 'META'];

    try {
      const today = new Date();
      const endDate = today.toISOString().split('T')[0];
      const startDate = new Date(today.getTime() - (1 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

      setStartDate(startDate);
      setEndDate(endDate);

      const allPromises = tickers.map((ticker) =>
        rest.stocks.dailyOpenClose(ticker, startDate)
      );

      const responses = await Promise.all(allPromises);
      console.log(responses);

      const fetchedPrices = {};
      const fetchedAfterHoursPrices = {};
      responses.forEach((response) => {
        if (response.status === "OK") {
          fetchedPrices[response.symbol] = response.close; // Set close price to the corresponding ticker symbol
          fetchedAfterHoursPrices[response.symbol] = response.afterHours; // Set after-hours price to the corresponding ticker symbol
        } else {
          console.error(`Error fetching data for ${response.symbol}: ${response}`);
        }
      });

      setPrices(fetchedPrices);
      setAfterHoursPrices(fetchedAfterHoursPrices);
      console.log(fetchedPrices);

      setIsLoading(false);

      // Store data in local storage
      localStorage.setItem('fitPrices', JSON.stringify(fetchedPrices));
      localStorage.setItem('fitAfterHoursPrices', JSON.stringify(fetchedAfterHoursPrices));

      // Clear the initial interval and set a new one for 1 hour
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(fetchData, 3600000); // 1 Hour
      }
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
      setError('An error occurred while fetching data. Please try again later.');
      setIsLoading(false);

      // If fetching data fails, switch back to 1 minute interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(fetchData, 60000); // 1 Minute
      }
    }
  };

  // Call fetchData on component mount
  useEffect(() => {
    // Check if data exists in local storage
    const cachedPrices = localStorage.getItem('fitPrices');
    const cachedAfterHoursPrices = localStorage.getItem('fitAfterHoursPrices');
    if (cachedPrices && cachedAfterHoursPrices) {
      setPrices(JSON.parse(cachedPrices));
      setAfterHoursPrices(JSON.parse(cachedAfterHoursPrices));
      setIsLoading(false);
    } else {
      fetchData();
    }

    intervalRef.current = setInterval(fetchData, 60000); // 1 Minute
    return () => clearInterval(intervalRef.current); // Clear interval on unmount
  }, []);

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>TICKER</TableCell>
              <TableCell align="center">REFPRICE</TableCell>
              <TableCell align="center">%CHG</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.equity}>
                <TableCell component="th" scope="row">
                  {row.equity}
                </TableCell>
                <TableCell align="center">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {isLoading ? (
                      <CircularProgress size="small" />
                    ) : prices[row.equity] !== undefined ? (
                      <span style={{ color: 'black' }}>{`$${prices[row.equity]}`}</span>
                    ) : (
                      <span style={{ color: '#212121' }}>{row.bond}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell align="center">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {!isLoading && afterHoursPrices[row.equity] !== undefined && prices[row.equity] !== undefined && (
                      <span style={{ color: afterHoursPrices[row.equity] > prices[row.equity] ? 'green' : afterHoursPrices[row.equity] < prices[row.equity] ? 'red' : 'black' }}>
                        {`${afterHoursPrices[row.equity] > prices[row.equity] ? '+' : ''}${((afterHoursPrices[row.equity] - prices[row.equity]) / prices[row.equity] * 100).toFixed(2)}%`}
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
