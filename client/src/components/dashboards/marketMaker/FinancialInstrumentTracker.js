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
  createData('AMZN', '', '', 'EQUITY'),
  createData('TSLA', '', '', 'EQUITY'),
  createData('AAPL', '', '', 'EQUITY'),
];

const CACHE_DURATION = 30000; // 30 seconds
const key = process.env.REACT_APP_POLYGONIO_MM_FIT_KEY;

export default function FinancialInstrumentTracker() {
  const [prices, setPrices] = useState({}); // State for all fetched prices
  const [afterHoursPrices, setAfterHoursPrices] = useState({}); // State for after-hours prices
  const [startDate, setStartDate] = useState(''); // State for start date
  const [endDate, setEndDate] = useState(''); // State for end date
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const [lastFetched, setLastFetched] = useState(null); // State to track last fetch time
  const [error, setError] = useState(null); // State for error message

  const fetchData = async () => {
    setError(null);

    const rest = restClient(key);
    const tickers = ['TSLA', 'AAPL', 'AMZN'];

    try {
      const today = new Date();
      const endDate = today.toISOString().split('T')[0];
      const startDate = new Date(today.getTime() - (1 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

      setStartDate(startDate);
      setEndDate(endDate);

      const isCached = lastFetched && (Date.now() - lastFetched) < CACHE_DURATION;
      if (isCached) return;

      const allPromises = tickers.map((ticker) =>
        rest.stocks.dailyOpenClose(ticker, startDate)
      );

      const responses = await Promise.all(allPromises);
      console.log(responses);

      const fetchedPrices = {};
      const fetchedAfterHoursPrices = {};
      responses.forEach((response) => {
        fetchedPrices[response.symbol] = response.close; // Set close price to the corresponding ticker symbol
        fetchedAfterHoursPrices[response.symbol] = response.afterHours; // Set after-hours price to the corresponding ticker symbol
      });
      setPrices(fetchedPrices);
      setAfterHoursPrices(fetchedAfterHoursPrices);

      setIsLoading(false);
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
      setError('An error occurred while fetching data. Please try again later.');
      setIsLoading(false);
    }
  };

  // Call fetchData on component mount
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000);
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
            {rows.map((row, index) => (
              <TableRow key={row.equity}>
                <TableCell component="th" scope="row">
                  {row.equity}
                </TableCell>
                <TableCell align="center">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {isLoading ? (
                      <CircularProgress size="small" />
                    ) : prices[row.equity] ? (
                      <span style={{ color: 'black' }}>{`$${prices[row.equity]}`}</span>
                    ) : (
                      <span style={{ color: '#212121' }}>{row.bond}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell align="center">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {index !== 0 && !isLoading && afterHoursPrices[row.equity] && prices[row.equity] && (
                      <span style={{ color: afterHoursPrices[row.equity] > prices[row.equity] ? 'green' : afterHoursPrices[row.equity] < prices[row.equity] ? 'red' : 'black' }}>
                        {`${afterHoursPrices[row.equity] > prices[row.equity] ? '+' : ''}${((afterHoursPrices[row.equity] - prices[row.equity]) / prices[row.equity] * 100).toFixed(2)}%`}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell align="center">
                  {row.commodity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </Container>
  );
}
