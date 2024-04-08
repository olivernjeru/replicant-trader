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
import { useState } from 'react';

function createData(equity, bond, fx, commodity) {
  return { equity, bond, fx, commodity };
}

const rows = [
  createData('Ticker', 'REFPRICE', '%CHG', 'TYPE'),
  createData('AMZN', '', '-0.13%', 'EQUITY'),
  createData('TSLA', '', '-12.5%', 'EQUITY'),
  createData('AAPL', '', '+1.4%', 'EQUITY'),
];

const key = 'kyRSBvqT4I22HyjEz9sRp6Q9bHc6LAZH';

export default function FinancialInstrumentTracker() {
  const [teslaPrice, setTeslaPrice] = useState(''); // State for closing price
  const [applePrice, setApplePrice] = useState(''); // State for closing price
  const [amazonPrice, setAmazonPrice] = useState(''); // State for closing price

  const fetchData = async () => {
    const rest = restClient(key);

    try {
      const teslaData = await rest.stocks.aggregates("TSLA", 1, "day", "2024-04-01", "2024-04-08");
      setTeslaPrice(teslaData.results[0].c); // Update state with closing price
      const appleData = await rest.stocks.aggregates("AAPL", 1, "day", "2024-04-01", "2024-04-08");
      setApplePrice(appleData.results[0].c); // Update state with closing price
      const amazonData = await rest.stocks.aggregates("AMZN", 1, "day", "2024-04-01", "2024-04-08");
      setAmazonPrice(amazonData.results[0].c); // Update state with closing price
    }
    // .then((data) => {
    //   const { ticker, results } = data;
    //   console.log(`Ticker: ${ticker}`);

    //   results.forEach((day) => {
    //     console.log(`Date: ${new Date(day.t * 1000).toLocaleDateString()}`);
    //     console.log(`Open: ${day.o}`);
    //     console.log(`High: ${day.h}`);
    //     console.log(`Low: ${day.l}`);
    //     console.log(`Close: ${day.c}`);
    //     console.log("---");
    //   });
    // })
    // .
    catch (error) {
      console.error('An error happened:', error);
    };
  };

  // Call fetchData every 10 seconds (adjust the interval as needed)
  setInterval(fetchData, 10000);

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
              <TableRow
                key={row.equity}
              // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.equity}
                </TableCell>
                <TableCell align="center">{row.equity === 'TSLA'
                  ? `$${teslaPrice}`
                  : row.equity === 'AAPL'
                    ? `$${applePrice}`
                    : row.equity === 'AMZN'
                      ? `$${amazonPrice}`
                      : row.bond}</TableCell>
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