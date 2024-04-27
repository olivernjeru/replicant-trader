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

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            setIsLoading(true);

            try {
                const key = process.env.REACT_APP_POLYGONIO_MM_HP_KEY;
                const rest = restClient(key);

                const today = new Date();
                const endDate = today.toISOString().split('T')[0];
                const startDate = new Date(today.getTime() - (1000 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]; // Adjust the duration as needed

                const response = await rest.stocks.aggregates(tickerSymbol, 1, 'day', startDate, endDate); // Use dynamic ticker symbol
                const fetchedData = response.results.map(result => ({
                    time: new Date(result.t).toISOString().split('T')[0],
                    value: result.c
                }));

                // console.log(fetchedData); // Log the fetched data

                setData(fetchedData); // Set the fetched data

                setIsLoading(false);
            } catch (error) {
                console.error('An error occurred while fetching data:', error);
                setError('An error occurred while fetching data. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchData();
    }, [tickerSymbol]); // Update data fetching whenever the ticker symbol changes

    useEffect(() => {
        // console.log("Data length:", data.length);
        // console.log("Chart Container Ref:", chartContainerRef.current);
        // console.log("Chart Instance:", chartInstanceRef.current);

        if (!data.length) return;

        if (!chartInstanceRef.current) {
            // console.log("Creating chart instance...");
            chartInstanceRef.current = createChart(chartContainerRef.current, {
                width: 600,
                height: 230,
                layout: {
                    backgroundColor: '#FFFFFF', // Set a contrasting background color for the chart
                },
            });
        }

        updateChartData(data);

        return () => {
            if (chartInstanceRef.current) {
                // console.log("Removing chart instance...");
                chartInstanceRef.current.remove(); // Cleanup the chart when component unmounts
                chartInstanceRef.current = null;
            }
        };
    }, [data, chartContainerRef]);

    const updateChartData = (data) => {
        if (!chartInstanceRef.current) return;

        // Clear previous data if it exists
        if (chartInstanceRef.current.seriesCount && chartInstanceRef.current.seriesCount() > 0) {
            chartInstanceRef.current.removeSeries(0);
        }

        const lineSeries = chartInstanceRef.current.addLineSeries({
            color: '#112240', // Set line color to black
            lineWidth: 2, // Set line width
        });
        lineSeries.setData(data); // Map the data onto the chart
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSend = () => {
        if (input.trim() !== "") {
            // console.log(input);
            setTickerSymbol(input.toUpperCase()); // Update the ticker symbol based on input
            setInput("");
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
                                borderColor: 'white', // Change outline color
                            },
                            '& input': {
                                color: 'white', // Change input text color
                            }
                        }
                    }}
                    InputLabelProps={{
                        style: {
                            color: 'white', // Change label text color
                        }
                    }}
                />
            </Box>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <div ref={chartContainerRef} />
            )}
        </Container>
    );
}