import React, { useEffect, useRef } from 'react';
import Quagga from '@ericblade/quagga2';
import { Box } from '@mui/material';

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected }) => {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scannerRef.current) {
      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: scannerRef.current,
            constraints: {
              facingMode: 'environment', // use the rear camera on mobile devices
            },
          },
          decoder: {
            readers: ['ean_reader', 'ean_8_reader', 'code_128_reader', 'code_39_reader'],
          },
        },
        (err) => {
          if (err) {
            console.error('Failed to initialize Quagga:', err);
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

      return () => {
        Quagga.stop();
      };
    }
  }, [onDetected]);

  return (
    <Box
      ref={scannerRef}
      sx={{
        width: '100%',
        height: '300px',
        position: 'relative',
        '& > video': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        },
      }}
    />
  );
};

export default BarcodeScanner;