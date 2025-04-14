import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMedicine } from '../../../context/MedicineContext';
import { Medicine, Batch } from '../../../types/medicine';
import BarcodeScanner from '../../shared/BarcodeScanner';

interface MedicineFormProps {
  medicine?: Medicine | null;
  onClose: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive'),
  stock: Yup.number()
    .required('Stock is required')
    .integer('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),
  expiryDate: Yup.date()
    .required('Expiry date is required')
    .min(new Date(), 'Expiry date must be in the future'),
  barcode: Yup.string().required('Barcode is required'),
  batches: Yup.array().of(
    Yup.object({
      batchNumber: Yup.string().required('Batch number is required'),
      quantity: Yup.number()
        .required('Quantity is required')
        .integer('Quantity must be an integer')
        .min(0, 'Quantity cannot be negative'),
      manufacturingDate: Yup.date().required('Manufacturing date is required'),
      expiryDate: Yup.date()
        .required('Expiry date is required')
        .min(Yup.ref('manufacturingDate'), 'Expiry date must be after manufacturing date'),
    })
  ),
});

const MedicineForm: React.FC<MedicineFormProps> = ({ medicine, onClose }) => {
  const { addMedicine, updateMedicine } = useMedicineContext();
  const [showScanner, setShowScanner] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: medicine?.name || '',
      description: medicine?.description || '',
      price: medicine?.price || '',
      stock: medicine?.stock || 0,
      expiryDate: medicine?.expiryDate || '',
      barcode: medicine?.barcode || '',
      batches: medicine?.batches || [
        {
          batchNumber: '',
          quantity: 0,
          manufacturingDate: '',
          expiryDate: '',
        },
      ],
    },
    validationSchema,
    onSubmit: (values) => {
      if (medicine) {
        updateMedicine({ ...medicine, ...values });
      } else {
        addMedicine(values);
      }
      onClose();
    },
  });

  const handleBarcodeDetected = (barcode: string) => {
    formik.setFieldValue('barcode', barcode);
    setShowScanner(false);
  };

  const addBatch = () => {
    const batches = [...formik.values.batches];
    batches.push({
      batchNumber: '',
      quantity: 0,
      manufacturingDate: '',
      expiryDate: '',
    });
    formik.setFieldValue('batches', batches);
  };

  const removeBatch = (index: number) => {
    const batches = [...formik.values.batches];
    batches.splice(index, 1);
    formik.setFieldValue('batches', batches);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="name"
            label="Medicine Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="description"
            label="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="price"
            label="Price"
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="stock"
            label="Stock"
            type="number"
            value={formik.values.stock}
            onChange={formik.handleChange}
            error={formik.touched.stock && Boolean(formik.errors.stock)}
            helperText={formik.touched.stock && formik.errors.stock}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="expiryDate"
            label="Expiry Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formik.values.expiryDate}
            onChange={formik.handleChange}
            error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
            helperText={formik.touched.expiryDate && formik.errors.expiryDate}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="barcode"
            label="Barcode"
            value={formik.values.barcode}
            onChange={formik.handleChange}
            error={formik.touched.barcode && Boolean(formik.errors.barcode)}
            helperText={formik.touched.barcode && formik.errors.barcode}
          />
          <Button
            variant="outlined"
            onClick={() => setShowScanner(true)}
            style={{ marginTop: '8px' }}
          >
            Scan Barcode
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Batches</Typography>
          {formik.values.batches.map((batch, index) => (
            <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name={`batches.${index}.batchNumber`}
                    label="Batch Number"
                    value={batch.batchNumber}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.batches?.[index]?.batchNumber &&
                      Boolean(formik.errors.batches?.[index]?.batchNumber)
                    }
                    helperText={
                      formik.touched.batches?.[index]?.batchNumber &&
                      formik.errors.batches?.[index]?.batchNumber
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name={`batches.${index}.quantity`}
                    label="Quantity"
                    type="number"
                    value={batch.quantity}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.batches?.[index]?.quantity &&
                      Boolean(formik.errors.batches?.[index]?.quantity)
                    }
                    helperText={
                      formik.touched.batches?.[index]?.quantity &&
                      formik.errors.batches?.[index]?.quantity
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name={`batches.${index}.manufacturingDate`}
                    label="Manufacturing Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={batch.manufacturingDate}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.batches?.[index]?.manufacturingDate &&
                      Boolean(formik.errors.batches?.[index]?.manufacturingDate)
                    }
                    helperText={
                      formik.touched.batches?.[index]?.manufacturingDate &&
                      formik.errors.batches?.[index]?.manufacturingDate
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name={`batches.${index}.expiryDate`}
                    label="Expiry Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={batch.expiryDate}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.batches?.[index]?.expiryDate &&
                      Boolean(formik.errors.batches?.[index]?.expiryDate)
                    }
                    helperText={
                      formik.touched.batches?.[index]?.expiryDate &&
                      formik.errors.batches?.[index]?.expiryDate
                    }
                  />
                </Grid>
              </Grid>
              <Button
                variant="outlined"
                color="error"
                onClick={() => removeBatch(index)}
                sx={{ mt: 1 }}
              >
                Remove Batch
              </Button>
            </Box>
          ))}
          <Button variant="outlined" onClick={addBatch} sx={{ mt: 2 }}>
            Add Batch
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" type="submit">
          {medicine ? 'Update' : 'Save'}
        </Button>
      </Box>

      {showScanner && (
        <Dialog open={showScanner} onClose={() => setShowScanner(false)}>
          <DialogTitle>Scan Barcode</DialogTitle>
          <DialogContent>
            <BarcodeScanner onDetected={handleBarcodeDetected} />
          </DialogContent>
        </Dialog>
      )}
    </form>
  );
};

export default MedicineForm;
