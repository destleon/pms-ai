import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Medicine {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  barcode?: string;
}

interface MedicineContextType {
  medicines: Medicine[];
  addMedicine: (medicine: Medicine) => void;
  updateMedicine: (medicine: Medicine) => void;
  deleteMedicine: (id: string) => void;
  getMedicine: (id: string) => Medicine | undefined;
}

const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

export const MedicineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const addMedicine = (medicine: Medicine) => {
    setMedicines([...medicines, medicine]);
  };

  const updateMedicine = (medicine: Medicine) => {
    setMedicines(medicines.map(m => m.id === medicine.id ? medicine : m));
  };

  const deleteMedicine = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const getMedicine = (id: string) => {
    return medicines.find(m => m.id === id);
  };

  return (
    <MedicineContext.Provider value={{
      medicines,
      addMedicine,
      updateMedicine,
      deleteMedicine,
      getMedicine
    }}>
      {children}
    </MedicineContext.Provider>
  );
};

export const useMedicine = () => {
  const context = useContext(MedicineContext);
  if (context === undefined) {
    throw new Error('useMedicine must be used within a MedicineProvider');
  }
  return context;
};