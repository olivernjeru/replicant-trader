import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container } from '@mui/material';
import styled from '@emotion/styled';
import './FinancialInstrumentTracker.css';

function createData(equity, bond, fx, commodity) {
  return { equity, bond, fx, commodity };
}

const rows = [
  createData('Ticker', 'REFPRICE', '%CHG', 'TYPE'),
  createData('AMZN', '$ 1392.4', '-0.13%', 'EQUITY'),
  createData('TSLA', '$ 210.39', '-12.5%', 'EQUITY'),
  createData('AAPL', '$ 146.7', '+1.4%', 'EQUITY'),
];

export default function FinancialInstrumentTracker() {
  const StyledTableCell = styled(TableCell)({
    color: 'white', // Set text color to white
  });

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="big" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCell>1. EQUITY</StyledTableCell>
              <StyledTableCell align="center">2. BOND</StyledTableCell>
              <StyledTableCell align="center">3. FX</StyledTableCell>
              <StyledTableCell align="center">4. COMMODITY</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.equity}
                // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <StyledTableCell component="th" scope="row">
                  {row.equity}
                </StyledTableCell>
                <StyledTableCell align="center">{row.bond}</StyledTableCell>
                <StyledTableCell align="center">{row.fx}</StyledTableCell>
                <StyledTableCell align="center">{row.commodity}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
