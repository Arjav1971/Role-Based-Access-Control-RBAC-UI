import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  Typography,
  Card,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  useMediaQuery,
  DialogContent,
  DialogActions,
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';
import CodeIcon from '@mui/icons-material/Code';
import ViewListIcon from '@mui/icons-material/ViewList';

import { useFormik } from 'formik';
import * as Yup from 'yup';

const PermissionsPage = () => {
  const [roles, setRoles] = useState([
    { id: 1, role: 'Admin', permissions: ['Read', 'Write', 'Delete', 'Manage Users'] },
    { id: 2, role: 'Editor', permissions: ['Read', 'Write'] },
    { id: 3, role: 'Viewer', permissions: ['Read'] },
  ]);

  const [availablePermissions] = useState([
    { name: 'Read', icon: <VisibilityIcon /> },
    { name: 'Write', icon: <EditIcon /> },
    { name: 'Delete', icon: <DeleteIcon /> },
    { name: 'Execute', icon: <CodeIcon /> },
    { name: 'Manage Users', icon: <VerifiedUserIcon /> },
    { name: 'Configure Settings', icon: <SettingsIcon /> },
    { name: 'View Logs', icon: <ViewListIcon /> },
    { name: 'Export Data', icon: <DownloadIcon /> },
  ]);

  const [selectedRole, setSelectedRole] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const handleSnackbarOpen = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenManageModal = (role) => {
    setSelectedRole(role);
    setIsManageModalOpen(true);
  };

  const handleCloseManageModal = () => {
    setSelectedRole(null);
    setIsManageModalOpen(false);
  };

  const handleOpenNewRoleModal = () => {
    setIsNewRoleModalOpen(true);
  };

  const handleCloseNewRoleModal = () => {
    setIsNewRoleModalOpen(false);
  };

  const handlePermissionChange = (permission, role) => {
    const updatedPermissions = role.permissions.includes(permission)
      ? role.permissions.filter((perm) => perm !== permission)
      : [...role.permissions, permission];

    if (role === selectedRole) {
      setSelectedRole({ ...role, permissions: updatedPermissions });
    }
  };

  const handleSavePermissions = () => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === selectedRole.id ? { ...role, permissions: selectedRole.permissions } : role
      )
    );
    handleSnackbarOpen(`Role "${selectedRole.role}" updated successfully.`);
    handleCloseManageModal();
  };

  const handleDeleteRole = () => {
    setRoles((prevRoles) => prevRoles.filter((role) => role.id !== selectedRole.id));
    handleSnackbarOpen(`Role "${selectedRole.role}" deleted successfully.`);
    handleCloseManageModal();
  };

  const validationSchema = Yup.object().shape({
    role: Yup.string()
      .required('Role name is required')
      .test('unique', 'Role name must be unique', (value) =>
        !roles.some((role) => role.role.toLowerCase() === value?.toLowerCase())
      ),
    permissions: Yup.array().min(1, 'Select at least one permission').required(),
  });

  const formik = useFormik({
    initialValues: {
      role: '',
      permissions: [],
    },
    validationSchema,
    onSubmit: (values) => {
      const newRole = {
        id: roles.length + 1,
        ...values,
      };
      setRoles([...roles, newRole]);
      handleSnackbarOpen(`Role "${values.role}" created successfully.`);
      handleCloseNewRoleModal();
    },
  });

  return (
    <div className="bg-[#F5F4FF] h-screen p-6">
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
        Role Permissions Management
      </Typography>

      {/* Roles List */}
      <Box sx={{ display: 'grid', gap: 2, backgroundColor: '#FFFFFF', p: 3, borderRadius: 2 }}>
        {roles.map((role) => (
          <Box
            key={role.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              backgroundColor: '#F9FAFB',
              borderRadius: 2,
              border: '1px solid #E0E0E0',
            }}
          >
            <Typography variant="h6">{role.role}</Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#907FCF',
                '&:hover': { backgroundColor: '#6e5bb7' },
              }}
              onClick={() => handleOpenManageModal(role)}
            >
              {isSmallScreen ? 'Manage' : 'Manage Permissions'}
            </Button>
          </Box>
        ))}
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#907FCF',
            '&:hover': { backgroundColor: '#6e5bb7' },
            mt: 2,
          }}
          onClick={handleOpenNewRoleModal}
        >
          Add New Role
        </Button>
      </Box>

      {/* Manage Permissions Modal */}
      <Dialog open={isManageModalOpen} onClose={handleCloseManageModal} fullWidth maxWidth="sm">
        <Box
          className="text-2xl text-white font-bold px-5 "
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            backgroundColor: '#907FCF',
          }}
        >
          <Typography variant="h6">
            Manage Permissions for {selectedRole?.role}
          </Typography>

        </Box>
        <DialogContent>
          <Card
            sx={{
              backgroundColor: '#F5F4FF',
              borderRadius: 2,
              padding: 2,
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2, color: '#907FCF' }}>
              Available Permissions
            </Typography>
            <List>
              {availablePermissions.map(({ name, icon }) => (
                <ListItem key={name}>
                  <ListItemIcon sx={{ color: '#907FCF' }}>{icon}</ListItemIcon>
                  <ListItemText primary={name} />
                  <Checkbox
                    sx={{
                      color: '#907FCF',
                      '&.Mui-checked': {
                        color: '#907FCF',
                      },
                    }}
                    checked={selectedRole?.permissions.includes(name)}
                    onChange={() => handlePermissionChange(name, selectedRole)}
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteRole}
            sx={{
              '&:hover': { backgroundColor: '#b71c1c' },
            }}
          >
            Delete Role
          </Button>
          <Button
            onClick={handleCloseManageModal}
            variant="contained"
            sx={{
              backgroundColor: '#E0E0E0',
              color: 'black',
              '&:hover': { backgroundColor: '#C0C0C0' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSavePermissions}
            variant="contained"
            sx={{
              backgroundColor: '#907FCF',
              '&:hover': { backgroundColor: '#6e5bb7' },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Role Modal */}
      <Dialog open={isNewRoleModalOpen} onClose={handleCloseNewRoleModal} fullWidth maxWidth="sm">
        <Box sx={{ padding: '20px', backgroundColor: '#907FCF', color: 'white' }}>
          Create New Role
        </Box>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Role Name"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
              fullWidth
              sx={{ marginBottom: 3 }}
            />
            <Typography variant="h6" sx={{ color: '#907FCF', marginBottom: 2 }}>
              Assign Permissions
            </Typography>
            <List>
              {availablePermissions.map(({ name, icon }) => (
                <ListItem key={name}>
                  <ListItemIcon sx={{ color: '#907FCF' }}>{icon}</ListItemIcon>
                  <ListItemText primary={name} />
                  <Checkbox
                    checked={formik.values.permissions.includes(name)}
                    onChange={() => {
                      const updatedPermissions = formik.values.permissions.includes(name)
                        ? formik.values.permissions.filter((perm) => perm !== name)
                        : [...formik.values.permissions, name];
                      formik.setFieldValue('permissions', updatedPermissions);
                    }}
                  />
                </ListItem>
              ))}
            </List>
            {formik.touched.permissions && formik.errors.permissions && (
              <Typography color="error">{formik.errors.permissions}</Typography>
            )}
            <DialogActions>
              <Button
                onClick={handleCloseNewRoleModal}
                variant="contained"
                sx={{
                  backgroundColor: '#E0E0E0',
                  color: 'black',
                  '&:hover': { backgroundColor: '#C0C0C0' },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#907FCF',
                  '&:hover': { backgroundColor: '#6e5bb7' },
                }}
              >
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PermissionsPage;