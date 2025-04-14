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
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useSalesContext } from '../../../context/SalesContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SalesAnalytics: React.FC = () => {
  const { salesData, fetchSalesData } = useSalesContext();
  const [timeRange, setTimeRange] = useState('week');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    fetchSalesData(timeRange);
  }, [timeRange]);

  const aggregateSalesData = () => {
    // This would normally process real data from the context
    // For demo purposes, using sample data
    return [
      { date: '2023-01', sales: 4000, profit: 2400, items: 24 },
      { date: '2023-02', sales: 3000, profit: 1398, items: 22 },
      { date: '2023-03', sales: 2000, profit: 9800, items: 18 },
      { date: '2023-04', sales: 2780, profit: 3908, items: 20 },
      { date: '2023-05', sales: 1890, profit: 4800, items: 15 },
      { date: '2023-06', sales: 2390, profit: 3800, items: 19 },
      { date: '2023-07', sales: 3490, profit: 4300, items: 25 },
    ];
  };

  const topSellingProducts = [
    { name: 'Product A', value: 400 },
    { name: 'Product B', value: 300 },
    { name: 'Product C', value: 300 },
    { name: 'Product D', value: 200 },
  ];

  const renderChart = () => {
    const data = aggregateSalesData();

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
              <Bar dataKey="profit" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={topSellingProducts}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {topSellingProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl size="small">
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
            <FormControl size="small">
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={chartType}
                label="Chart Type"
                onChange={(e) => setChartType(e.target.value)}
              >
                <MenuItem value="line">Line Chart</MenuItem>
                <MenuItem value="bar">Bar Chart</MenuItem>
                <MenuItem value="pie">Pie Chart</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Overview
              </Typography>
              {renderChart()}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Sales
                  </Typography>
                  <Typography variant="h4">$24,500</Typography>
                  <Typography variant="body2" color="text.secondary">
                    +15% from last period
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h4">156</Typography>
                  <Typography variant="body2" color="text.secondary">
                    +8% from last period
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Average Order Value
                  </Typography>
                  <Typography variant="h4">$157.05</Typography>
                  <Typography variant="body2" color="text.secondary">
                    +5% from last period
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesAnalytics;