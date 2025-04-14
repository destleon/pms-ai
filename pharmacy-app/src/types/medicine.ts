export interface Medicine {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  expiryDate: string;
  manufacturer: string;
  category: string;
  reorderLevel: number;
  lastUpdated: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}