import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Authenticator } from '@aws-amplify/ui-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import Layout from './components/shared/Layout';
import AdminDashboard from './components/admin/Dashboard';
import AttendantDashboard from './components/attendant/Dashboard';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated, userRole, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Authenticator>
            {({ signOut }) => (
              <Layout>
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      isAuthenticated ? (
                        userRole === 'admin' ? (
                          <AdminDashboard />
                        ) : (
                          <AttendantDashboard />
                        )
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    } 
                  />
                  {/* Add more routes as needed */}
                </Routes>
              </Layout>
            )}
          </Authenticator>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;