import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, CircularProgress, Box } from '@mui/material';
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

const key = process.env.REACT_APP_POLYGONIO_CLIENT_FIT_KEY;

export default function USEquitiesFinancialInstrumentTracker() {
    const [prices, setPrices] = useState({}); // State for all fetched prices
    const [afterHoursPrices, setAfterHoursPrices] = useState({}); // State for after-hours prices
    const [volumes, setVolumes] = useState({}); // State for volumes
    const [startDate, setStartDate] = useState(''); // State for start date
    const [endDate, setEndDate] = useState(''); // State for end date
    const [isLoading, setIsLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(null); // State for error message
    const retryTimeoutRef = useRef(null); // Reference to store the retry timeout

    const fetchData = async () => {
        setError(null);
        setIsLoading(true);

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

            const fetchedPrices = {};
            const fetchedAfterHoursPrices = {};
            const fetchedVolumes = {};
            responses.forEach((response) => {
                if (response.status === "OK") {
                    fetchedPrices[response.symbol] = response.close; // Set close price to the corresponding ticker symbol
                    fetchedAfterHoursPrices[response.symbol] = response.afterHours; // Set after-hours price to the corresponding ticker symbol
                    fetchedVolumes[response.symbol] = response.volume; // Set volume to the corresponding ticker symbol
                } else {
                    console.error(`Error fetching data for ${response.symbol}: ${response}`);
                }
            });

            setPrices(fetchedPrices);
            setAfterHoursPrices(fetchedAfterHoursPrices);
            setVolumes(fetchedVolumes);
            setIsLoading(false);

            // Store data in local storage
            localStorage.setItem('fitPrices', JSON.stringify(fetchedPrices));
            localStorage.setItem('fitAfterHoursPrices', JSON.stringify(fetchedAfterHoursPrices));
            localStorage.setItem('fitVolumes', JSON.stringify(fetchedVolumes));
        } catch (error) {
            console.error('An error occurred while fetching data:', error);
            setError('An error occurred while fetching data. Retrying...');
            setIsLoading(true);

            // Retry after 1 minute
            retryTimeoutRef.current = setTimeout(fetchData, 60000); // 1 Minute
        }
    };

    // Call fetchData on component mount
    useEffect(() => {
        // Check if data exists in local storage
        const cachedPrices = localStorage.getItem('fitPrices');
        const cachedAfterHoursPrices = localStorage.getItem('fitAfterHoursPrices');
        const cachedVolumes = localStorage.getItem('fitVolumes');
        if (cachedPrices && cachedAfterHoursPrices) {
            setPrices(JSON.parse(cachedPrices));
            setAfterHoursPrices(JSON.parse(cachedAfterHoursPrices));
            setVolumes(JSON.parse(cachedVolumes));
            setIsLoading(false);
        } else {
            fetchData();
        }

        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
        };
    }, []);

    return (
        <Container sx={{ width: '50%', ml: '-2%' }}>
            {isLoading ? (
                <CircularProgress sx={{ ml: 30, mt: 10 }} />
            ) : (
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>TICKER</TableCell>
                                <TableCell align="center">REFPRICE</TableCell>
                                <TableCell align="center">VOLUME</TableCell>
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
                                            {prices[row.equity] !== undefined ? (
                                                <span style={{ color: 'black' }}>{`$${prices[row.equity]}`}</span>
                                            ) : (
                                                <span style={{ color: '#212121' }}>{row.bond}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        {volumes[row.equity] !== undefined ? (
                                            <span style={{ color: 'black' }}>{volumes[row.equity].toLocaleString()}</span>
                                        ) : (
                                            <span style={{ color: '#212121' }}>N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {afterHoursPrices[row.equity] !== undefined && prices[row.equity] !== undefined && (
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
            )}
        </Container>
    );
}
