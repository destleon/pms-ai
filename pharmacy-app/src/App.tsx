import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from './context/AppContext';

// Layout components
import Layout from './components/shared/Layout';

// Admin components
import MedicineTable from './components/admin/medicine/MedicineTable';
import InventoryStatus from './components/admin/inventory/InventoryStatus';
import SalesAnalytics from './components/admin/analytics/SalesAnalytics';
import UserManagement from './components/admin/users/UserManagement';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Admin routes */}
              <Route path="/admin">
                <Route path="medicines" element={<MedicineTable />} />
                <Route path="inventory" element={<InventoryStatus />} />
                <Route path="analytics" element={<SalesAnalytics />} />
                <Route path="users" element={<UserManagement />} />
              </Route>

              {/* Default redirect */}
              <Route
                path="/"
                element={
                  <div style={{ padding: 20 }}>
                    <h1>Welcome to Pharmacy Management System</h1>
                  </div>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;