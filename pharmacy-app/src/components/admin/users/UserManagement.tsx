import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { Edit, Delete, Add, FileDownload } from '@mui/icons-material';
import { useUserContext } from '../../../context/UserContext';
import { exportToCSV } from '../../../utils/exportUtils';
import * as Yup from 'yup';
import { useFormik } from 'formik';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  role: Yup.string().required('Role is required'),
  status: Yup.string().required('Status is required'),
});

const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useUserContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      role: '',
      status: 'active',
    },
    validationSchema,
    onSubmit: (values) => {
      if (selectedUser) {
        updateUser({
          ...selectedUser,
          ...values,
        });
      } else {
        addUser({
          ...values,
          id: Math.random().toString(36).substr(2, 9),
          lastLogin: new Date().toISOString(),
        });
      }
      handleCloseDialog();
    },
  });

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      formik.setValues({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status,
      });
    } else {
      setSelectedUser(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    formik.resetForm();
  };

  const handleExportCSV = () => {
    const filteredUsers = filterUsers(users);
    exportToCSV(filteredUsers, 'user_management');
  };

  const filterUsers = (userList: User[]) => {
    return userList.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">User Management</Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<FileDownload />}
                onClick={handleExportCSV}
                sx={{ mr: 2 }}
              >
                Export CSV
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
              >
                Add User
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Search users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="Role"
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="pharmacist">Pharmacist</MenuItem>
                  <MenuItem value="cashier">Cashier</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterUsers(users).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Typography
                        color={user.status === 'active' ? 'success.main' : 'error'}
                      >
                        {user.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(user)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => deleteUser(user.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {selectedUser ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formik.values.role}
                    label="Role"
                    onChange={formik.handleChange}
                    error={formik.touched.role && Boolean(formik.errors.role)}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="pharmacist">Pharmacist</MenuItem>
                    <MenuItem value="cashier">Cashier</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formik.values.status}
                    label="Status"
                    onChange={formik.handleChange}
                    error={formik.touched.status && Boolean(formik.errors.status)}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedUser ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserManagement;