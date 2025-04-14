import { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listTransactions } from '../graphql/queries';
import { createTransaction, updateTransaction } from '../graphql/mutations';
import { Transaction } from '../types/transaction';
import { useMedicines } from './useMedicines';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { updateMedicineById } = useMedicines();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const result = await API.graphql(graphqlOperation(listTransactions));
      setTransactions(result.data.listTransactions.items);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createNewTransaction = async (
    transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>
  ) => {
    try {
      // Create the transaction
      const result = await API.graphql(
        graphqlOperation(createTransaction, {
          input: {
            ...transactionData,
            isDeleted: false,
          },
        })
      );
      const newTransaction = result.data.createTransaction;

      // Update medicine quantity
      await updateMedicineById(transactionData.medicineId, {
        quantity: { $sub: ['quantity', transactionData.quantity] },
      });

      setTransactions([...transactions, newTransaction]);
      return newTransaction;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const updateTransactionById = async (
    id: string,
    updates: Partial<Transaction>
  ) => {
    try {
      const result = await API.graphql(
        graphqlOperation(updateTransaction, {
          input: {
            id,
            ...updates,
          },
        })
      );
      const updatedTransaction = result.data.updateTransaction;
      setTransactions(
        transactions.map((trans) =>
          trans.id === id ? updatedTransaction : trans
        )
      );
      return updatedTransaction;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const getTransactionsByDateRange = (startDate: Date, endDate: Date) => {
    return transactions.filter((transaction) => {
      const transDate = new Date(transaction.transactionDate);
      return transDate >= startDate && transDate <= endDate;
    });
  };

  const getTransactionsByMedicine = (medicineId: string) => {
    return transactions.filter(
      (transaction) => transaction.medicineId === medicineId
    );
  };

  const calculateTotalSales = (transactionList: Transaction[]) => {
    return transactionList.reduce(
      (total, transaction) => total + transaction.totalAmount,
      0
    );
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createNewTransaction,
    updateTransactionById,
    getTransactionsByDateRange,
    getTransactionsByMedicine,
    calculateTotalSales,
  };
};