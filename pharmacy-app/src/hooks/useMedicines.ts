import { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import {
  listMedicines,
  getMedicine,
  searchMedicines,
} from '../graphql/queries';
import {
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from '../graphql/mutations';
import { Medicine } from '../types/medicine';
import { useInventoryAlerts } from './useInventoryAlerts';

export const useMedicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { checkAndCreateAlerts } = useInventoryAlerts();

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const result = await API.graphql(graphqlOperation(listMedicines));
      setMedicines(result.data.listMedicines.items);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const getMedicineById = async (id: string) => {
    try {
      const result = await API.graphql(
        graphqlOperation(getMedicine, { id })
      );
      return result.data.getMedicine;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const searchMedicinesByName = async (searchTerm: string) => {
    try {
      const result = await API.graphql(
        graphqlOperation(searchMedicines, {
          filter: {
            name: {
              match: searchTerm,
            },
          },
        })
      );
      return result.data.searchMedicines.items;
    } catch (err) {
      setError(err as Error);
      return [];
    }
  };

  const addMedicine = async (medicineData: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await API.graphql(
        graphqlOperation(createMedicine, {
          input: {
            ...medicineData,
            isDeleted: false,
          },
        })
      );
      const newMedicine = result.data.createMedicine;
      setMedicines([...medicines, newMedicine]);
      await checkAndCreateAlerts(newMedicine);
      return newMedicine;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const updateMedicineById = async (
    id: string,
    updates: Partial<Medicine>
  ) => {
    try {
      const result = await API.graphql(
        graphqlOperation(updateMedicine, {
          input: {
            id,
            ...updates,
          },
        })
      );
      const updatedMedicine = result.data.updateMedicine;
      setMedicines(
        medicines.map((med) =>
          med.id === id ? updatedMedicine : med
        )
      );
      await checkAndCreateAlerts(updatedMedicine);
      return updatedMedicine;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const deleteMedicineById = async (id: string) => {
    try {
      await API.graphql(
        graphqlOperation(deleteMedicine, {
          input: { id },
        })
      );
      setMedicines(medicines.filter((med) => med.id !== id));
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return {
    medicines,
    loading,
    error,
    fetchMedicines,
    getMedicineById,
    searchMedicinesByName,
    addMedicine,
    updateMedicineById,
    deleteMedicineById,
  };
};