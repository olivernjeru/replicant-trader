import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './FinancialInstrumentTracker.css';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Ticker', 'REFPRICE', '%CHG', 'TYPE'),
  createData('AMZN', '$ 1392.4', '-0.13%', 'EQUITY'),
  createData('TSLA', '$ 210.39', '-12.5%', 'EQUITY'),
  createData('AAPL', '$ 146.7','+1.4%', 'EQUITY'),
];

export default function FinancialInstrumentTracker() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="big" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>1. EQUITY</TableCell>
            <TableCell align="right">2. BOND</TableCell>
            <TableCell align="right">3. FX</TableCell>
            <TableCell align="right">4. COMMODITY</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}