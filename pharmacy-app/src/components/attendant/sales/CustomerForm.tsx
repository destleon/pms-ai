import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography
} from '@mui/material';

interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface CustomerFormProps {
  onSubmit: (customerDetails: CustomerDetails) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CustomerDetails>({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Customer Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={2}
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Continue to Payment
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CustomerForm;