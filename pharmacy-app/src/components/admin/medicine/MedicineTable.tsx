import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit, Delete, Add, FileDownload } from '@mui/icons-material';
import { useMedicineContext } from '../../../context/MedicineContext';
import { Medicine } from '../../../types/medicine';
import MedicineForm from './MedicineForm';
import { exportToCSV } from '../../../utils/exportUtils';

const MedicineTable: React.FC = () => {
  const { medicines, deleteMedicine } = useMedicineContext();
  const [open, setOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setOpen(true);
  };

  const handleAdd = () => {
    setSelectedMedicine(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMedicine(null);
  };

  const handleExportCSV = () => {
    exportToCSV(medicines, 'medicines_inventory');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <TextField
          label="Search Medicines"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <Button
            variant="contained"
            startIcon={<FileDownload />}
            onClick={handleExportCSV}
            style={{ marginRight: '1rem' }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            Add Medicine
          </Button>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMedicines.map((medicine) => (
              <TableRow key={medicine.id}>
                <TableCell>{medicine.name}</TableCell>
                <TableCell>{medicine.description}</TableCell>
                <TableCell>${medicine.price}</TableCell>
                <TableCell>{medicine.stock}</TableCell>
                <TableCell>{new Date(medicine.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(medicine)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => deleteMedicine(medicine.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedMedicine ? 'Edit Medicine' : 'Add New Medicine'}
        </DialogTitle>
        <DialogContent>
          <MedicineForm
            medicine={selectedMedicine}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicineTable;