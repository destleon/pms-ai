import { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listInventoryAlerts } from '../graphql/queries';
import { createInventoryAlert, resolveInventoryAlert } from '../graphql/mutations';
import { InventoryAlert } from '../types/inventory';
import { Medicine } from '../types/medicine';

export const useInventoryAlerts = () => {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const result = await API.graphql(graphqlOperation(listInventoryAlerts));
      setAlerts(result.data.listInventoryAlerts.items);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndCreateAlerts = async (medicine: Medicine) => {
    try {
      // Check for low stock
      if (medicine.quantity <= medicine.reorderLevel) {
        await API.graphql(
          graphqlOperation(createInventoryAlert, {
            input: {
              medicineId: medicine.id,
              alertType: 'LOW_STOCK',
              message: `Low stock alert for ${medicine.name}. Current quantity: ${medicine.quantity}`,
              status: 'PENDING',
            },
          })
        );
      }

      // Check for expiring medicines (30 days warning)
      const expiryDate = new Date(medicine.expiryDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      if (expiryDate <= thirtyDaysFromNow) {
        await API.graphql(
          graphqlOperation(createInventoryAlert, {
            input: {
              medicineId: medicine.id,
              alertType: 'EXPIRING_SOON',
              message: `${medicine.name} is expiring on ${medicine.expiryDate}`,
              status: 'PENDING',
            },
          })
        );
      }

      await fetchAlerts();
    } catch (err) {
      setError(err as Error);
    }
  };

  const resolveAlert = async (alertId: string, resolvedBy: string) => {
    try {
      await API.graphql(
        graphqlOperation(resolveInventoryAlert, {
          input: {
            id: alertId,
            status: 'RESOLVED',
            resolvedBy,
            resolvedAt: new Date().toISOString(),
          },
        })
      );
      await fetchAlerts();
    } catch (err) {
      setError(err as Error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return {
    alerts,
    loading,
    error,
    fetchAlerts,
    checkAndCreateAlerts,
    resolveAlert,
  };
};