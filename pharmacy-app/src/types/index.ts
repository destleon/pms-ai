// Medicine related types
export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  expiryDate: string;
  barcode: string;
  category: string;
  manufacturer: string;
  batches: Batch[];
  createdAt: string;
  updatedAt: string;
}

export interface Batch {
  id: string;
  medicineId: string;
  batchNumber: string;
  quantity: number;
  manufacturingDate: string;
  expiryDate: string;
  cost: number;
  supplier: string;
  createdAt: string;
}

// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'pharmacist' | 'cashier';
export type UserStatus = 'active' | 'inactive';

// Sales related types
export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  discount: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  customerId?: string;
  userId: string;
  status: SaleStatus;
  createdAt: string;
}

export interface SaleItem {
  id: string;
  medicineId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export type PaymentMethod = 'cash' | 'card' | 'insurance';
export type SaleStatus = 'completed' | 'cancelled' | 'refunded';

// Inventory related types
export interface InventoryItem {
  id: string;
  medicineId: string;
  quantity: number;
  batchNumber: string;
  location: string;
  status: InventoryStatus;
  lastChecked: string;
  updatedAt: string;
}

export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

// Analytics related types
export interface SalesAnalytics {
  period: string;
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: {
    medicineId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  salesByDay: {
    date: string;
    sales: number;
    revenue: number;
  }[];
}

export interface InventoryAnalytics {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringItems: number;
  valueByCategory: {
    category: string;
    value: number;
  }[];
  stockMovement: {
    date: string;
    incoming: number;
    outgoing: number;
  }[];
}

// API related types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

// Filter and pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

export interface InventoryFilter extends PaginationParams {
  status?: InventoryStatus;
  category?: string;
  search?: string;
  expiryBefore?: string;
}

export interface SalesFilter extends PaginationParams, DateRangeFilter {
  status?: SaleStatus;
  paymentMethod?: PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  scales?: {
    y?: {
      beginAtZero: boolean;
    };
  };
  plugins?: {
    legend?: {
      position: 'top' | 'bottom' | 'left' | 'right';
    };
    title?: {
      display: boolean;
      text: string;
    };
  };
}