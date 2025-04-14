import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';
import { Box, Button, Typography } from '@mui/material';

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected }) => {
  const [error, setError] = useState<string>('');
  const scannerRef = useRef<HTMLDivElement>(null);
  const [isHardwareScanner, setIsHardwareScanner] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');

  useEffect(() => {
    // Hardware scanner detection
    let barcode = '';
    let lastKeyTime = Date.now();

    const handleKeyPress = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      
      if (currentTime - lastKeyTime > 100) {
        barcode = '';
      }
      
      lastKeyTime = currentTime;
      barcode += e.key;

      if (e.key === 'Enter') {
        if (barcode.length > 5) { // Minimum barcode length check
          setIsHardwareScanner(true);
          onDetected(barcode.slice(0, -1)); // Remove the Enter key
        }
        barcode = '';
      }
    };

    document.addEventListener('keypress', handleKeyPress);

    // Camera scanner initialization
    if (!isHardwareScanner && scannerRef.current) {
      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: scannerRef.current,
            constraints: {
              facingMode: 'environment',
            },
          },
          decoder: {
            readers: [
              'ean_reader',
              'ean_8_reader',
              'code_128_reader',
              'code_39_reader',
              'upc_reader',
            ],
          },
        },
        (err) => {
          if (err) {
            setError('Failed to initialize camera scanner');
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((result) => {
        if (result.codeResult.code) {
          onDetected(result.codeResult.code);
        }
      });
    }

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      Quagga.stop();
    };
  }, [onDetected, isHardwareScanner]);

  const handleManualInput = (e: React.FormEvent) => {
    e.preventDefault();
    onDetected(barcodeInput);
  };

  return (
    <Box>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      
      {!isHardwareScanner && (
        <>
          <div
            ref={scannerRef}
            style={{
              width: '100%',
              height: '300px',
              overflow: 'hidden',
              marginBottom: '20px',
            }}
          />
          
          <form onSubmit={handleManualInput}>
            <Typography variant="body2" gutterBottom>
              If scanning doesn't work, enter the barcode manually:
            </Typography>
            <Box display="flex" gap={1}>
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button type="submit" variant="contained" size="small">
                Submit
              </Button>
            </Box>
          </form>
        </>
      )}
    </Box>
  );
};

export default BarcodeScanner;