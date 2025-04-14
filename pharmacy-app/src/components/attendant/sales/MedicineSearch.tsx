import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Autocomplete, 
  Box, 
  InputAdornment,
  IconButton 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

interface Medicine {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
}

interface MedicineSearchProps {
  onMedicineSelect: (medicine: Medicine) => void;
}

const MedicineSearch: React.FC<MedicineSearchProps> = ({ onMedicineSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulated API call - replace with actual API integration
  const searchMedicines = async (query: string) => {
    setLoading(true);
    try {
      // Replace with actual API call
      const response = await fetch(`/api/medicines/search?q=${query}`);
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error('Error searching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const debounceTimer = setTimeout(() => {
        searchMedicines(searchTerm);
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm]);

  const handleBarcodeScanner = async () => {
    try {
      // Implement barcode scanner integration
      const barcode = await window.navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      // Process barcode scan result
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <Autocomplete
        options={medicines}
        getOptionLabel={(option) => `${option.name} (${option.barcode})`}
        loading={loading}
        onChange={(_, value) => value && onMedicineSelect(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Medicine"
            variant="outlined"
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                  <InputAdornment position="end">
                    <IconButton onClick={handleBarcodeScanner}>
                      <QrCodeScannerIcon />
                    </IconButton>
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                </>
              ),
            }}
          />
        )}
      />
    </Box>
  );
};

export default MedicineSearch;