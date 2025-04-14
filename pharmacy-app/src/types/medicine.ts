export interface Batch {
  batchNumber: string;
  quantity: number;
  manufacturingDate: string;
  expiryDate: string;
}

export interface Medicine {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  expiryDate: string;
  barcode: string;
  batches: Batch[];
}