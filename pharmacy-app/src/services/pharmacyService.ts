// Service layer for handling API calls and offline functionality
interface Medicine {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
  expiryDate: string;
}

interface Sale {
  id: string;
  date: string;
  customerName: string;
  items: SaleItem[];
  total: number;
  invoiceNumber: string;
}

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
}

class PharmacyService {
  private static instance: PharmacyService;
  private offlineStore: { [key: string]: any[] } = {};
  private isOnline: boolean = navigator.onLine;

  private constructor() {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    this.loadOfflineStore();
  }

  public static getInstance(): PharmacyService {
    if (!PharmacyService.instance) {
      PharmacyService.instance = new PharmacyService();
    }
    return PharmacyService.instance;
  }

  private async handleOnline() {
    this.isOnline = true;
    await this.syncOfflineData();
  }

  private handleOffline() {
    this.isOnline = false;
  }

  private loadOfflineStore() {
    const stored = localStorage.getItem('pharmacy_offline_store');
    if (stored) {
      this.offlineStore = JSON.parse(stored);
    }
  }

  private saveOfflineStore() {
    localStorage.setItem('pharmacy_offline_store', JSON.stringify(this.offlineStore));
  }

  private async syncOfflineData() {
    for (const [endpoint, data] of Object.entries(this.offlineStore)) {
      for (const item of data) {
        try {
          await this.makeRequest(endpoint, 'POST', item);
        } catch (error) {
          console.error('Error syncing offline data:', error);
        }
      }
    }
    this.offlineStore = {};
    this.saveOfflineStore();
  }

  private async makeRequest(endpoint: string, method: string, data?: any) {
    if (!this.isOnline) {
      if (method === 'GET') {
        return this.getOfflineData(endpoint);
      } else {
        this.storeOfflineData(endpoint, data);
        return { success: true, offline: true };
      }
    }

    try {
      const response = await fetch(`/api${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return await response.json();
    } catch (error) {
      if (!this.isOnline) {
        if (method === 'GET') {
          return this.getOfflineData(endpoint);
        } else {
          this.storeOfflineData(endpoint, data);
          return { success: true, offline: true };
        }
      }
      throw error;
    }
  }

  private getOfflineData(endpoint: string): any {
    const cachedData = localStorage.getItem(`cache_${endpoint}`);
    return cachedData ? JSON.parse(cachedData) : null;
  }

  private storeOfflineData(endpoint: string, data: any) {
    if (!this.offlineStore[endpoint]) {
      this.offlineStore[endpoint] = [];
    }
    this.offlineStore[endpoint].push(data);
    this.saveOfflineStore();
  }

  // Medicine-related methods
  async searchMedicines(query: string): Promise<Medicine[]> {
    return this.makeRequest(`/medicines/search?q=${query}`, 'GET');
  }

  async getMedicineByBarcode(barcode: string): Promise<Medicine | null> {
    return this.makeRequest(`/medicines/barcode/${barcode}`, 'GET');
  }

  async getStockLevels(): Promise<Medicine[]> {
    return this.makeRequest('/medicines/stock', 'GET');
  }

  async updateStock(medicineId: string, quantity: number): Promise<void> {
    return this.makeRequest(`/medicines/${medicineId}/stock`, 'PUT', { quantity });
  }

  // Sales-related methods
  async createSale(saleData: {
    items: SaleItem[];
    customerDetails: CustomerDetails;
  }): Promise<Sale> {
    return this.makeRequest('/sales', 'POST', saleData);
  }

  async getSalesHistory(startDate?: Date, endDate?: Date): Promise<Sale[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    return this.makeRequest(`/sales/history?${params}`, 'GET');
  }

  async getPersonalSalesReport(
    attendantId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Sale[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    return this.makeRequest(`/sales/attendant/${attendantId}?${params}`, 'GET');
  }

  // Print-related methods
  async printReceipt(sale: Sale): Promise<boolean> {
    try {
      const receiptWindow = window.open('', '_blank');
      if (!receiptWindow) return false;

      const receiptContent = this.generateReceiptHTML(sale);
      receiptWindow.document.write(receiptContent);
      receiptWindow.document.close();
      receiptWindow.print();
      return true;
    } catch (error) {
      console.error('Error printing receipt:', error);
      return false;
    }
  }

  private generateReceiptHTML(sale: Sale): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${sale.invoiceNumber}</title>
          <style>
            body { font-family: monospace; }
            .receipt { width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .items { margin: 20px 0; }
            .total { text-align: right; margin-top: 20px; }
            @media print {
              body { width: 58mm; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>Sales Receipt</h2>
              <p>Invoice #: ${sale.invoiceNumber}</p>
              <p>Date: ${new Date(sale.date).toLocaleString()}</p>
            </div>
            <div class="items">
              ${sale.items.map(item => `
                <div>
                  <p>${item.name}</p>
                  <p>${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}</p>
                </div>
              `).join('')}
            </div>
            <div class="total">
              <h3>Total: $${sale.total.toFixed(2)}</h3>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export const pharmacyService = PharmacyService.getInstance();