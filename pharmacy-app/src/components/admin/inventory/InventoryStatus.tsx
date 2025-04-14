import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import { FileDownload } from '@mui/icons-material';
import { useInventoryContext } from '../../../context/InventoryContext';
import { exportToCSV } from '../../../utils/exportUtils';

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  category: string;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  supplier: string;
  lastUpdated: string;
}

const InventoryStatus: React.FC = () => {
  const { inventory, fetchInventory } = useInventoryContext();
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    supplier: 'all',
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc',
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const categories = ['Tablets', 'Syrups', 'Injections', 'Topical'];
  const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];
  const suppliers = ['Supplier A', 'Supplier B', 'Supplier C'];

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const filterInventory = (items: InventoryItem[]) => {
    return items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesCategory =
        filters.category === 'all' || item.category === filters.category;
      const matchesStatus =
        filters.status === 'all' || item.status === filters.status;
      const matchesSupplier =
        filters.supplier === 'all' || item.supplier === filters.supplier;

      return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
    });
  };

  const sortInventory = (items: InventoryItem[]) => {
    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleExportCSV = () => {
    const filteredData = filterInventory(inventory);
    exportToCSV(filteredData, 'inventory_status');
  };

  const filteredAndSortedInventory = sortInventory(filterInventory(inventory));

  const getLowStockAlert = () => {
    const lowStockItems = inventory.filter((item) => item.status === 'Low Stock');
    if (lowStockItems.length > 0) {
      return (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {lowStockItems.length} items are running low on stock
        </Alert>
      );
    }
    return null;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {getLowStockAlert()}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Inventory Status</Typography>
                <Button
                  variant="contained"
                  startIcon={<FileDownload />}
                  onClick={handleExportCSV}
                >
                  Export CSV
                </Button>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Search"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={filters.category}
                      label="Category"
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      label="Status"
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <MenuItem value="all">All Statuses</MenuItem>
                      {statuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Supplier</InputLabel>
                    <Select
                      value={filters.supplier}
                      label="Supplier"
                      onChange={(e) => handleFilterChange('supplier', e.target.value)}
                    >
                      <MenuItem value="all">All Suppliers</MenuItem>
                      {suppliers.map((supplier) => (
                        <MenuItem key={supplier} value={supplier}>
                          {supplier}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell onClick={() => handleSort('name')}>
                        Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell onClick={() => handleSort('stock')}>
                        Stock {sortConfig.key === 'stock' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell onClick={() => handleSort('category')}>
                        Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell onClick={() => handleSort('status')}>
                        Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell onClick={() => handleSort('expiryDate')}>
                        Expiry Date {sortConfig.key === 'expiryDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell onClick={() => handleSort('supplier')}>
                        Supplier {sortConfig.key === 'supplier' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell onClick={() => handleSort('lastUpdated')}>
                        Last Updated {sortConfig.key === 'lastUpdated' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAndSortedInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <Typography
                            color={
                              item.status === 'Out of Stock'
                                ? 'error'
                                : item.status === 'Low Stock'
                                ? 'warning.main'
                                : 'success.main'
                            }
                          >
                            {item.status}
                          </Typography>
                        </TableCell>
                        <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryStatus;