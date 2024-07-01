import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, CircularProgress } from '@mui/material';
import './KenyaEquitiesFinancialInstrumentTracker.css';

export default function KenyaEquitiesFinancialInstrumentTracker() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSorted, setIsSorted] = useState(false);
    const [retryTimeout, setRetryTimeout] = useState(null);

    const url = 'https://nairobi-stock-exchange-nse.p.rapidapi.com/stocks';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_NSE_CLIENT_KEY,
            'X-RapidAPI-Host': 'nairobi-stock-exchange-nse.p.rapidapi.com'
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            setData(result);
            localStorage.setItem('nseData', JSON.stringify(result));
            setIsLoading(false);
            setIsSorted(false);
        } catch (error) {
            setError('An error occurred while fetching data. Retrying...');
            setIsLoading(true);
            setRetryTimeout(setTimeout(fetchData, 60000)); // Retry after 1 minute
        }
    };

    const isMarketOpen = () => {
        const now = new Date();
        const day = now.getDay(); // 0 (Sunday) to 6 (Saturday)
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const openTime = new Date();
        openTime.setHours(9, 15, 0, 0); // 9:15 AM EAT
        const closeTime = new Date();
        closeTime.setHours(15, 30, 0, 0); // 3:30 PM EAT
        const isWeekday = day >= 1 && day <= 5; // Monday to Friday
        return isWeekday && now >= openTime && now <= closeTime;
    };

    useEffect(() => {
        const cachedData = localStorage.getItem('nseData');
        if (cachedData) {
            setData(JSON.parse(cachedData));
            setIsLoading(false);
        } else {
            fetchData();
        }

        if (isMarketOpen()) {
            fetchData(); // Fetch immediately if the market is open
            const interval = setInterval(fetchData, 60000); // Fetch data every minute
            return () => clearInterval(interval);
        } else {
            fetchData(); // Fetch once if the market is closed
        }

        return () => {
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
        };
    }, []);

    useEffect(() => {
        if (!isSorted && data.length > 0) {
            const sortedData = [...data].sort((a, b) => {
                const volumeA = parseInt(a.volume.replace(/,/g, '') || '0', 10);
                const volumeB = parseInt(b.volume.replace(/,/g, '') || '0', 10);
                return volumeB - volumeA;
            });
            setData(sortedData);
            setIsSorted(true);
        }
    }, [data, isSorted]);

    const calculateChangePercentage = (change, price) => {
        return ((change / price) * 100).toFixed(2);
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container>
            <div className="kenya-equities-table-container">
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="Kenya Equities data table">
                        <TableHead>
                            <TableRow>
                                <TableCell>TICKER</TableCell>
                                <TableCell>NAME</TableCell>
                                <TableCell align="center">PRICE</TableCell>
                                <TableCell align="center">VOLUME</TableCell>
                                <TableCell align="center">CHANGE</TableCell>
                                <TableCell align="center">%CHANGE</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.ticker}>
                                    <TableCell component="th" scope="row">
                                        {row.ticker}
                                    </TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell align="center">{row.price || 'N/A'}</TableCell>
                                    <TableCell align="center">{row.volume || 'N/A'}</TableCell>
                                    <TableCell align="center" style={{ color: row.change > 0 ? 'green' : row.change < 0 ? 'red' : 'black' }}>
                                        {row.change || 'N/A'}
                                    </TableCell>
                                    <TableCell align="center" style={{ color: row.change > 0 ? 'green' : row.change < 0 ? 'red' : 'black' }}>
                                        {row.price && row.change ? `${calculateChangePercentage(row.change, row.price)}%` : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Container>
    );
}
