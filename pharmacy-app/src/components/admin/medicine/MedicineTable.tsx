import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { API, graphqlOperation } from 'aws-amplify';
import { listMedicines } from '../../../graphql/queries';
import { createMedicine, updateMedicine, deleteMedicine } from '../../../graphql/mutations';

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

const MedicineTable: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState<Partial<Medicine>>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response: any = await API.graphql(graphqlOperation(listMedicines));
      setMedicines(response.data.listMedicines.items);
      setError(null);
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setError('Failed to fetch medicines. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (medicine?: Medicine) => {
    if (medicine) {
      setSelectedMedicine(medicine);
      setFormData(medicine);
    } else {
      setSelectedMedicine(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMedicine(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      quantity: 0,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (selectedMedicine) {
        await API.graphql(
          graphqlOperation(updateMedicine, {
            input: {
              id: selectedMedicine.id,
              ...formData,
            },
          })
        );
      } else {
        await API.graphql(
          graphqlOperation(createMedicine, {
            input: formData,
          })
        );
      }
      await fetchMedicines();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving medicine:', err);
      setError('Failed to save medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) {
      return;
    }

    try {
      setLoading(true);
      await API.graphql(
        graphqlOperation(deleteMedicine, {
          input: { id },
        })
      );
      await fetchMedicines();
    } catch (err) {
      console.error('Error deleting medicine:', err);
      setError('Failed to delete medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && medicines.length === 0) {
    return <CircularProgress />;
  }

  return (
    <div>
      {error && <Alert severity="error">{error}</Alert>}
      
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '1rem' }}
      >
        Add New Medicine
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicines.map((medicine) => (
              <TableRow key={medicine.id}>
                <TableCell>{medicine.name}</TableCell>
                <TableCell>{medicine.description}</TableCell>
                <TableCell>${medicine.price.toFixed(2)}</TableCell>
                <TableCell>{medicine.quantity}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => handleOpenDialog(medicine)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(medicine.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedMedicine ? 'Edit Medicine' : 'Add New Medicine'}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            name="price"
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="quantity"
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MedicineTable;