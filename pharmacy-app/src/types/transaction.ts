export interface Transaction {
  id: string;
  medicineId: string;
  quantity: number;
  totalAmount: number;
  customerName?: string;
  customerPhone?: string;
  attendantId: string;
  transactionDate: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}