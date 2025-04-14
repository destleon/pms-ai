import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { API, graphqlOperation } from 'aws-amplify';
import { listMedicines } from '../../../graphql/queries';
import { createMedicine, updateMedicine, deleteMedicine } from '../../../graphql/mutations';
import { Medicine } from '../../../types/medicine';

const MedicineTable: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    manufacturer: '',
    category: '',
    reorderLevel: '',
    expiryDate: '',
  });

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    { field: 'manufacturer', headerName: 'Manufacturer', flex: 1 },
    { field: 'category', headerName: 'Category', width: 120 },
    { field: 'expiryDate', headerName: 'Expiry Date', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const result = await API.graphql(graphqlOperation(listMedicines));
      const medicineList = result.data.listMedicines;
      setMedicines(medicineList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMedicine(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      manufacturer: '',
      category: '',
      reorderLevel: '',
      expiryDate: '',
    });
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      description: medicine.description || '',
      price: medicine.price.toString(),
      quantity: medicine.quantity.toString(),
      manufacturer: medicine.manufacturer,
      category: medicine.category,
      reorderLevel: medicine.reorderLevel.toString(),
      expiryDate: medicine.expiryDate,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await API.graphql(
        graphqlOperation(deleteMedicine, {
          input: { id },
        })
      );
      await fetchMedicines();
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const input = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        manufacturer: formData.manufacturer,
        category: formData.category,
        reorderLevel: parseInt(formData.reorderLevel),
        expiryDate: formData.expiryDate,
      };

      if (editingMedicine) {
        await API.graphql(
          graphqlOperation(updateMedicine, {
            input: { id: editingMedicine.id, ...input },
          })
        );
      } else {
        await API.graphql(
          graphqlOperation(createMedicine, {
            input,
          })
        );
      }

      handleCloseDialog();
      await fetchMedicines();
    } catch (error) {
      console.error('Error saving medicine:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Medicines
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Add Medicine
            </Button>
          </Box>
          <DataGrid
            rows={medicines}
            columns={columns}
            loading={loading}
            autoHeight
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
            <TextField
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="quantity"
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="manufacturer"
              label="Manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="category"
              label="Category"
              value={formData.category}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="reorderLevel"
              label="Reorder Level"
              type="number"
              value={formData.reorderLevel}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="expiryDate"
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingMedicine ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default MedicineTable;