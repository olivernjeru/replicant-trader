import React, { useRef, useEffect, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Box, IconButton, InputAdornment, TextField, CircularProgress } from '@mui/material';
import Container from "@mui/material/Container";
import SearchIcon from '@mui/icons-material/Search';
import { restClient } from '@polygon.io/client-js';

export default function HistoricalPerformanceTracker() {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [tickerSymbol, setTickerSymbol] = useState('TSLA'); // Initialize with default ticker symbol

    const chartContainerRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const retryTimeoutRef = useRef(null);

    useEffect(() => {
        // Check if there's a stored ticker symbol in local storage
        const storedTickerSymbol = localStorage.getItem('storedTickerSymbol');
        if (storedTickerSymbol) {
            setTickerSymbol(storedTickerSymbol);
        }

        const fetchData = async () => {
            setError(null);
            setIsLoading(true);

            try {
                const key = process.env.REACT_APP_POLYGONIO_CLIENT_HP_KEY;
                const rest = restClient(key);

                const today = new Date();
                const endDate = today.toISOString().split('T')[0];
                const startDate = new Date(today.getTime() - (732 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

                const cacheKey = `fitData-${tickerSymbol}-${startDate}-${endDate}`;
                const cachedData = localStorage.getItem(cacheKey);
                if (cachedData) {
                    setData(JSON.parse(cachedData));
                    setIsLoading(false);
                } else {
                    const response = await rest.stocks.aggregates(tickerSymbol, 1, 'day', startDate, endDate); // Use dynamic ticker symbol
                    const fetchedData = response.results.map(result => ({
                        time: new Date(result.t).toISOString().split('T')[0],
                        value: result.c
                    }));

                    setData(fetchedData); // Set the fetched data
                    setIsLoading(false);

                    // Store data in local storage
                    localStorage.setItem(cacheKey, JSON.stringify(fetchedData));
                }
            } catch (error) {
                console.error('An error occurred while fetching data:', error);
                setError('An error occurred while fetching data. Retrying...');
                setIsLoading(true);

                // Retry after 1 minute
                retryTimeoutRef.current = setTimeout(fetchData, 60000);
            }
        };

        fetchData();

        // Cleanup timeout on unmount
        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
        };
    }, [tickerSymbol]); // Update data fetching whenever the ticker symbol changes

    useEffect(() => {
        if (!data.length) return;

        if (!chartInstanceRef.current) {
            chartInstanceRef.current = createChart(chartContainerRef.current, {
                width: 850,
                height: 300,
                layout: {
                    backgroundColor: '#FFFFFF',
                },
            });
        }

        updateChartData(data);

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.remove();
                chartInstanceRef.current = null;
            }
        };
    }, [data, chartContainerRef]);

    const updateChartData = (data) => {
        if (!chartInstanceRef.current) return;

        if (chartInstanceRef.current.seriesCount && chartInstanceRef.current.seriesCount() > 0) {
            chartInstanceRef.current.removeSeries(0);
        }

        const lineSeries = chartInstanceRef.current.addLineSeries({
            color: '#112240',
            lineWidth: 2,
        });
        lineSeries.setData(data);
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSend = () => {
        if (input.trim() !== "") {
            setTickerSymbol(input.toUpperCase());
            setInput("");

            // Store the searched ticker symbol in local storage
            localStorage.setItem('storedTickerSymbol', input.toUpperCase());
        }
    };

    return (
        <Container>
            <Box>
                <TextField
                    label={tickerSymbol}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            handleSend(event);
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton aria-label="search" onClick={handleSend}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white',
                            },
                            '& input': {
                                color: 'white',
                            }
                        }
                    }}
                    InputLabelProps={{
                        style: {
                            color: 'white',
                        }
                    }}
                />
            </Box>
            {isLoading ? (
                <CircularProgress sx={{mt:10}} />
            ) : (
                <div ref={chartContainerRef} />
            )}
        </Container>
    );
}
