import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
  Dialog,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Invoice from './Invoice';

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Sale {
  id: string;
  date: string;
  customerName: string;
  items: SaleItem[];
  total: number;
  invoiceNumber: string;
}

const SalesHistory: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Simulated API call - replace with actual API integration
  useEffect(() => {
    const fetchSales = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/sales/history');
        const data = await response.json();
        setSales(data);
        setFilteredSales(data);
      } catch (error) {
        console.error('Error fetching sales history:', error);
      }
    };

    fetchSales();
  }, []);

  useEffect(() => {
    const filtered = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      const matchesDate = (!startDate || saleDate >= startDate) &&
                         (!endDate || saleDate <= endDate);
      const matchesSearch = sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sale.invoiceNumber.includes(searchTerm);
      return matchesDate && matchesSearch;
    });
    setFilteredSales(filtered);
  }, [searchTerm, startDate, endDate, sales]);

  const handleViewInvoice = (sale: Sale) => {
    setSelectedSale(sale);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Sales History</Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{ textField: { size: 'small' } }}
          />
        </LocalizationProvider>
        
        <TextField
          label="Search by Customer/Invoice"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Invoice #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell align="right">Items</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                <TableCell>{sale.invoiceNumber}</TableCell>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell align="right">{sale.items.length}</TableCell>
                <TableCell align="right">${sale.total.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewInvoice(sale)}
                  >
                    View Invoice
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedSale && (
          <Box sx={{ p: 2 }}>
            <Invoice
              invoiceNumber={selectedSale.invoiceNumber}
              date={selectedSale.date}
              items={selectedSale.items}
              customerDetails={{
                name: selectedSale.customerName,
                phone: '', // Add these fields to the Sale interface if needed
                email: '',
                address: ''
              }}
              onClose={() => setSelectedSale(null)}
            />
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default SalesHistory;