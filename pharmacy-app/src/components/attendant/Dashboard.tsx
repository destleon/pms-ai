import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Container,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MedicineSearch from './sales/MedicineSearch';
import ShoppingCart from './sales/ShoppingCart';
import CustomerForm from './sales/CustomerForm';
import Invoice from './sales/Invoice';
import StockView from './inventory/StockView';
import SalesHistory from './sales/SalesHistory';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const AttendantDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMedicineSelect = (medicine: any) => {
    const existingItem = cartItems.find(item => item.id === medicine.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...medicine, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setShowCustomerForm(true);
  };

  const handleCustomerSubmit = (details: CustomerDetails) => {
    setCustomerDetails(details);
    setShowCustomerForm(false);
    setShowInvoice(true);
  };

  const handleInvoiceClose = () => {
    setShowInvoice(false);
    setCartItems([]);
    setCustomerDetails(null);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
          >
            <Tab label="Sales" />
            <Tab label="Inventory" />
            <Tab label="Sales History" />
          </Tabs>
        </Paper>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h5">New Sale</Typography>
            <MedicineSearch onMedicineSelect={handleMedicineSelect} />
            <ShoppingCart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />
            {showCustomerForm && (
              <CustomerForm
                onSubmit={handleCustomerSubmit}
                onCancel={() => setShowCustomerForm(false)}
              />
            )}
            {showInvoice && customerDetails && (
              <Invoice
                invoiceNumber={`INV-${Date.now()}`}
                date={new Date().toISOString()}
                items={cartItems}
                customerDetails={customerDetails}
                onClose={handleInvoiceClose}
              />
            )}
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <StockView />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <SalesHistory />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default AttendantDashboard;
