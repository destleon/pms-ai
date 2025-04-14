import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Medicine endpoints
export const medicineService = {
  getAllMedicines: () => api.get('/medicines'),
  getMedicineById: (id: string) => api.get(`/medicines/${id}`),
  createMedicine: (data: any) => api.post('/medicines', data),
  updateMedicine: (id: string, data: any) => api.put(`/medicines/${id}`, data),
  deleteMedicine: (id: string) => api.delete(`/medicines/${id}`),
  searchByBarcode: (barcode: string) => api.get(`/medicines/barcode/${barcode}`),
};

// Inventory endpoints
export const inventoryService = {
  getInventoryStatus: () => api.get('/inventory/status'),
  getLowStockItems: () => api.get('/inventory/low-stock'),
  updateStock: (medicineId: string, quantity: number) => 
    api.put(`/inventory/${medicineId}`, { quantity }),
  getInventoryHistory: (filters: any) => 
    api.get('/inventory/history', { params: filters }),
};

// Sales endpoints
export const salesService = {
  getSalesData: (period: string) => api.get(`/sales/analytics/${period}`),
  createSale: (data: any) => api.post('/sales', data),
  getSaleById: (id: string) => api.get(`/sales/${id}`),
  getSalesReport: (filters: any) => 
    api.get('/sales/report', { params: filters }),
};

// User management endpoints
export const userService = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id: string) => api.get(`/users/${id}`),
  createUser: (data: any) => api.post('/users', data),
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  updateUserRole: (id: string, role: string) => 
    api.put(`/users/${id}/role`, { role }),
};

// Authentication endpoints
export const authService = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  updatePassword: (data: { oldPassword: string; newPassword: string }) => 
    api.put('/auth/password', data),
};

// Error handler utility
export const handleApiError = (error: any) => {
  const defaultError = {
    message: 'An unexpected error occurred',
    status: 500,
  };

  if (error.response) {
    const { status, data } = error.response;
    return {
      message: data.message || defaultError.message,
      status: status,
      data: data,
    };
  }

  if (error.request) {
    return {
      message: 'Network error - no response received',
      status: 0,
    };
  }

  return defaultError;
};

export default api;