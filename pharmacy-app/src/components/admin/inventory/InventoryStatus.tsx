import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
  LinearProgress,
  Chip,
} from '@mui/material';
import { API, graphqlOperation } from 'aws-amplify';
import { listMedicines, listInventoryAlerts } from '../../../graphql/queries';
import { Medicine } from '../../../types/medicine';
import { InventoryAlert } from '../../../types/inventory';

const InventoryStatus: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [medicinesResult, alertsResult] = await Promise.all([
        API.graphql(graphqlOperation(listMedicines)),
        API.graphql(graphqlOperation(listInventoryAlerts)),
      ]);

      setMedicines(medicinesResult.data.listMedicines);
      setAlerts(alertsResult.data.listInventoryAlerts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setLoading(false);
    }
  };

  const getStockStatus = (medicine: Medicine) => {
    const percentage = (medicine.quantity / medicine.reorderLevel) * 100;
    if (percentage <= 25) return 'critical';
    if (percentage <= 50) return 'low';
    if (percentage <= 75) return 'moderate';
    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'error';
      case 'low':
        return 'warning';
      case 'moderate':
        return 'info';
      case 'good':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStockPercentage = (medicine: Medicine) => {
    return (medicine.quantity / medicine.reorderLevel) * 100;
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Alerts Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Active Alerts
        </Typography>
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <Alert
              key={alert.id}
              severity={alert.alertType === 'LOW_STOCK' ? 'warning' : 'error'}
              sx={{ mb: 2 }}
            >
              {alert.message}
            </Alert>
          ))
        ) : (
          <Alert severity="success">No active alerts</Alert>
        )}
      </Box>

      {/* Inventory Grid */}
      <Grid container spacing={3}>
        {medicines.map((medicine) => (
          <Grid item xs={12} sm={6} md={4} key={medicine.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">{medicine.name}</Typography>
                  <Chip
                    label={getStockStatus(medicine)}
                    color={getStatusColor(getStockStatus(medicine)) as any}
                    size="small"
                  />
                </Box>

                <Typography color="textSecondary" gutterBottom>
                  Category: {medicine.category}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Stock Level
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(getStockPercentage(medicine), 100)}
                        color={getStatusColor(getStockStatus(medicine)) as any}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="textSecondary">
                        {medicine.quantity}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Reorder Level: {medicine.reorderLevel}
                  </Typography>
                  <Typography variant="body2">
                    Expiry Date: {new Date(medicine.expiryDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InventoryStatus;