import { useState, useEffect, useCallback } from 'react';
import { pharmacyService } from '../services/pharmacyService';

interface Medicine {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  minStock: number;
}

interface UsePharmacyReturn {
  // Medicine-related
  searchMedicines: (query: string) => Promise<Medicine[]>;
  checkStock: (medicineId: string) => Promise<number>;
  isStockAvailable: (medicineId: string, quantity: number) => Promise<boolean>;
  
  // Sales-related
  createSale: (saleData: any) => Promise<any>;
  getSalesHistory: (startDate?: Date, endDate?: Date) => Promise<any[]>;
  
  // Status indicators
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  
  // Error handling
  error: Error | null;
  clearError: () => void;
}

export const usePharmacy = (): UsePharmacyReturn => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real-time stock checking
  const checkStock = useCallback(async (medicineId: string): Promise<number> => {
    try {
      const medicines = await pharmacyService.getStockLevels();
      const medicine = medicines.find(m => m.id === medicineId);
      return medicine?.stock ?? 0;
    } catch (err) {
      setError(err as Error);
      return 0;
    }
  }, []);

  const isStockAvailable = useCallback(async (medicineId: string, quantity: number): Promise<boolean> => {
    const currentStock = await checkStock(medicineId);
    return currentStock >= quantity;
  }, [checkStock]);

  // Medicine search with caching
  const searchMedicines = useCallback(async (query: string): Promise<Medicine[]> => {
    try {
      const results = await pharmacyService.searchMedicines(query);
      
      // Cache results for offline use
      if (isOnline) {
        localStorage.setItem(`medicine_search_${query}`, JSON.stringify(results));
      }
      
      return results;
    } catch (err) {
      // Try to get cached results if offline
      if (!isOnline) {
        const cached = localStorage.getItem(`medicine_search_${query}`);
        if (cached) {
          return JSON.parse(cached);
        }
      }
      setError(err as Error);
      return [];
    }
  }, [isOnline]);

  // Sales operations
  const createSale = useCallback(async (saleData: any) => {
    try {
      // Check stock availability for all items
      const stockChecks = await Promise.all(
        saleData.items.map(async (item: any) => ({
          id: item.id,
          available: await isStockAvailable(item.id, item.quantity)
        }))
      );

      const unavailableItems = stockChecks.filter(check => !check.available);
      if (unavailableItems.length > 0) {
        throw new Error('Some items are out of stock');
      }

      return await pharmacyService.createSale(saleData);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [isStockAvailable]);

  const getSalesHistory = useCallback(async (startDate?: Date, endDate?: Date) => {
    try {
      return await pharmacyService.getSalesHistory(startDate, endDate);
    } catch (err) {
      setError(err as Error);
      return [];
    }
  }, []);

  // Error handling
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Return the hook interface
  return {
    searchMedicines,
    checkStock,
    isStockAvailable,
    createSale,
    getSalesHistory,
    isOnline,
    isSyncing,
    lastSyncTime,
    error,
    clearError
  };
};

export default usePharmacy;