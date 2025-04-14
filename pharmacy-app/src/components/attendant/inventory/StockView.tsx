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
  TextField,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';

interface Medicine {
  id: string;
  name: string;
  barcode: string;
  stock: number;
  minStock: number;
  category: string;
  expiryDate: string;
  price: number;
}

const StockView: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Simulated API call - replace with actual API integration
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/medicines');
        const data = await response.json();
        setMedicines(data);
        setFilteredMedicines(data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    fetchMedicines();
  }, []);

  useEffect(() => {
    const filtered = medicines.filter((medicine) => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          medicine.barcode.includes(searchTerm);
      const matchesCategory = filterCategory === 'all' || medicine.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredMedicines(filtered);
  }, [searchTerm, filterCategory, medicines]);

  const getStockLevelColor = (stock: number, minStock: number) => {
    if (stock <= 0) return 'error';
    if (stock <= minStock) return 'warning';
    return 'success';
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setFilterCategory(event.target.value);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Inventory Stock Levels</Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Search Medicine"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            label="Category"
            onChange={handleCategoryChange}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="tablets">Tablets</MenuItem>
            <MenuItem value="syrups">Syrups</MenuItem>
            <MenuItem value="injections">Injections</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Barcode</TableCell>
              <TableCell align="right">Stock Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMedicines.map((medicine) => (
              <TableRow key={medicine.id}>
                <TableCell>{medicine.name}</TableCell>
                <TableCell>{medicine.barcode}</TableCell>
                <TableCell align="right">{medicine.stock}</TableCell>
                <TableCell>
                  <Chip
                    label={medicine.stock <= 0 ? 'Out of Stock' : 
                           medicine.stock <= medicine.minStock ? 'Low Stock' : 'In Stock'}
                    color={getStockLevelColor(medicine.stock, medicine.minStock)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{medicine.category}</TableCell>
                <TableCell>{medicine.expiryDate}</TableCell>
                <TableCell align="right">${medicine.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StockView;