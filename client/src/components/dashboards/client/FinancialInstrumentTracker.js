import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container } from '@mui/material';
import { restClient } from '@polygon.io/client-js';
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';

function createData(equity, bond, fx, commodity) {
  return { equity, bond, fx, commodity };
}

const rows = [
  createData('Ticker', 'REFPRICE', '%CHG', 'TYPE'),
  createData('AMZN', '', '-0.13%', 'EQUITY'),
  createData('TSLA', '', '-12.5%', 'EQUITY'),
  createData('AAPL', '', '+1.4%', 'EQUITY'),
];

const CACHE_DURATION = 30000; // 30 seconds
const key = process.env.REACT_APP_POLYGONIO_CLIENT_KEY;

export default function FinancialInstrumentTracker() {
  const [prices, setPrices] = useState({}); // State for all fetched prices
  const [startDate, setStartDate] = useState(''); // State for start date
  const [endDate, setEndDate] = useState(''); // State for end date
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [lastFetched, setLastFetched] = useState(null); // State to track last fetch time
  const [error, setError] = useState(null); // State for error message

  const fetchData = async () => {
    setIsLoading(true); // Set loading indicator to true
    setError(null); // Clear any previous error
    const rest = restClient(key);
    const tickers = ['TSLA', 'AAPL', 'AMZN']; // Array of tickers

    try {
      // Calculate dates (assuming today is stored in a variable)
      const today = new Date();
      const endDate = today.toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
      const startDate = new Date(today.getTime() - (1 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

      setStartDate(startDate);
      setEndDate(endDate);

      // Check if data is cached and within expiration time
      const isCached = lastFetched && (Date.now() - lastFetched) < CACHE_DURATION;
      if (isCached) return; // Use cached data if available

      // Concurrent API calls using Promise.all
      const allPromises = tickers.map((ticker) =>
        rest.stocks.aggregates(ticker, 1, 'day', startDate, endDate)
      );

      const responses = await Promise.all(allPromises);

      // Update state with all fetched prices
      const fetchedPrices = {};
      responses.forEach((response) => {
        fetchedPrices[response.ticker] = response.results[0].c;
      });
      setPrices(fetchedPrices);
    } catch (error) {
      console.error('An error happened:', error);
      setError('An error occurred fetching data. Please try again later.');
    } finally {
      setIsLoading(false); // Set loading indicator to false (always run)
    }
  };

  // Call fetchData on component mount
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 6000);
    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="big" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>1. EQUITY</TableCell>
              <TableCell align="center">2. BOND</TableCell>
              <TableCell align="center">3. FX</TableCell>
              <TableCell align="center">4. COMMODITY</TableCell>
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
                      <CircularProgress size="small" sx={{ color: 'red' }} />
                    ) : prices[row.equity] ? (
                      <span style={{ color: 'black' }}>{`$${prices[row.equity]}`}</span>
                    ) : (
                      <span style={{ color: '#212121' }}>{row.bond}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell align="center">{row.fx}</TableCell>
                <TableCell align="center">{row.commodity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Container>
  );
}