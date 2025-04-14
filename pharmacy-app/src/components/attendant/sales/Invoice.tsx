import React, { useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface InvoiceProps {
  invoiceNumber: string;
  date: string;
  items: InvoiceItem[];
  customerDetails: CustomerDetails;
  onClose: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({
  invoiceNumber,
  date,
  items,
  customerDetails,
  onClose
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <Box>
      <Paper sx={{ p: 4, mb: 2 }} ref={invoiceRef}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>INVOICE</Typography>
          <Typography variant="body1">Invoice #: {invoiceNumber}</Typography>
          <Typography variant="body1">Date: {date}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Customer Details */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Bill To:</Typography>
          <Typography>{customerDetails.name}</Typography>
          <Typography>{customerDetails.address}</Typography>
          <Typography>Phone: {customerDetails.phone}</Typography>
          {customerDetails.email && <Typography>Email: {customerDetails.email}</Typography>}
        </Box>

        {/* Items Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    ${(item.quantity * item.price).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totals */}
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Typography>Subtotal: ${calculateSubtotal().toFixed(2)}</Typography>
          <Typography>Tax (10%): ${calculateTax().toFixed(2)}</Typography>
          <Typography variant="h6">
            Total: ${calculateTotal().toFixed(2)}
          </Typography>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" align="center">
            Thank you for your business!
          </Typography>
        </Box>
      </Paper>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button variant="contained" onClick={handlePrint}>
          Print Invoice
        </Button>
      </Box>
    </Box>
  );
};

export default Invoice;