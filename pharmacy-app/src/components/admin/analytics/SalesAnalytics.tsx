import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { API, graphqlOperation } from 'aws-amplify';
import { listTransactions } from '../../../graphql/queries';
import { Transaction } from '../../../types/transaction';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SalesAnalytics: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [totalSales, setTotalSales] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [averageTransactionValue, setAverageTransactionValue] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const result = await API.graphql(graphqlOperation(listTransactions));
      const transactionList = result.data.listTransactions;
      setTransactions(transactionList);
      calculateMetrics(transactionList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const calculateMetrics = (transactionList: Transaction[]) => {
    const total = transactionList.reduce(
      (sum, transaction) => sum + transaction.totalAmount,
      0
    );
    setTotalSales(total);
    setTotalTransactions(transactionList.length);
    setAverageTransactionValue(total / transactionList.length || 0);
  };

  const getFilteredData = () => {
    const now = new Date();
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      switch (timeRange) {
        case 'week':
          return now.getTime() - transactionDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return now.getTime() - transactionDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
        case 'year':
          return now.getTime() - transactionDate.getTime() <= 365 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });
    return filtered;
  };

  const getSalesData = () => {
    const filtered = getFilteredData();
    const data = new Map();

    filtered.forEach((transaction) => {
      const date = new Date(transaction.transactionDate).toLocaleDateString();
      data.set(date, (data.get(date) || 0) + transaction.totalAmount);
    });

    return {
      labels: Array.from(data.keys()),
      datasets: [
        {
          label: 'Sales',
          data: Array.from(data.values()),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  };

  const getPaymentMethodData = () => {
    const filtered = getFilteredData();
    const data = new Map();

    filtered.forEach((transaction) => {
      data.set(
        transaction.paymentMethod,
        (data.get(transaction.paymentMethod) || 0) + transaction.totalAmount
      );
    });

    return {
      labels: Array.from(data.keys()),
      datasets: [
        {
          data: Array.from(data.values()),
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
        },
      ],
    };
  };

  const getTopProducts = () => {
    const filtered = getFilteredData();
    const data = new Map();

    filtered.forEach((transaction) => {
      data.set(
        transaction.medicineId,
        (data.get(transaction.medicineId) || 0) + transaction.quantity
      );
    });

    const sortedData = new Map(
      [...data.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
    );

    return {
      labels: Array.from(sortedData.keys()),
      datasets: [
        {
          label: 'Units Sold',
          data: Array.from(sortedData.values()),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
      ],
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">Sales Analytics</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Sales
              </Typography>
              <Typography variant="h4">${totalSales.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Transactions
              </Typography>
              <Typography variant="h4">{totalTransactions}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Transaction Value
              </Typography>
              <Typography variant="h4">${averageTransactionValue.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Trend
              </Typography>
              <Line data={getSalesData()} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Methods
              </Typography>
              <Pie data={getPaymentMethodData()} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Selling Products
              </Typography>
              <Bar data={getTopProducts()} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesAnalytics;