export interface InventoryAlert {
  id: string;
  medicineId: string;
  alertType: 'LOW_STOCK' | 'EXPIRING_SOON';
  message: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  isDeleted: boolean;
}