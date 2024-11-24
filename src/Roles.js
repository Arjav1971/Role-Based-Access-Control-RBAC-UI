import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import { List, ListItem, ListItemIcon, ListItemText, Snackbar, Alert, useMediaQuery } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';
import CodeIcon from '@mui/icons-material/Code';
import ViewListIcon from '@mui/icons-material/ViewList';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

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
    const [newRole, setNewRole] = useState({ role: '', permissions: [] });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });


    // Responsive breakpoint for small screens
       const isSmallScreen = useMediaQuery('(max-width:600px)');

    // Snackbar handlers
    const handleSnackbarOpen = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Modal open/close handlers
    const handleOpenManageModal = (role) => {
        setSelectedRole(role);
        setIsManageModalOpen(true);
    };

    const handleCloseManageModal = () => {
        setSelectedRole(null);
        setIsManageModalOpen(false);
    };

    const handleOpenNewRoleModal = () => {
        setNewRole({ role: '', permissions: [] });
        setIsNewRoleModalOpen(true);
    };

    const handleCloseNewRoleModal = () => {
        setNewRole({ role: '', permissions: [] });
        setIsNewRoleModalOpen(false);
    };

    // Permission change handler
    const handlePermissionChange = (permission, role = selectedRole) => {
        const updatedPermissions = role.permissions.includes(permission)
            ? role.permissions.filter((perm) => perm !== permission)
            : [...role.permissions, permission];

        if (role === selectedRole) {
            setSelectedRole({ ...role, permissions: updatedPermissions });
        } else {
            setNewRole({ ...role, permissions: updatedPermissions });
        }
    };

    // Save permissions for existing roles
    const handleSavePermissions = () => {
        setRoles((prevRoles) =>
            prevRoles.map((role) =>
                role.id === selectedRole.id ? { ...role, permissions: selectedRole.permissions } : role
            )
        );
        handleSnackbarOpen(`Role "${selectedRole.role}" updated successfully.`);
        handleCloseManageModal();
    };

    // Save new role
    const handleSaveNewRole = () => {
        if (!newRole.role.trim()) {
            alert('Role name is required.');
            return;
        }

        if (roles.some((role) => role.role.toLowerCase() === newRole.role.toLowerCase())) {
            alert('Role name must be unique.');
            return;
        }

        setRoles([...roles, { id: roles.length + 1, ...newRole }]);
        handleSnackbarOpen(`Role "${newRole.role}" created successfully.`);
        handleCloseNewRoleModal();
    };

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
                        display: "flex",
                        alignItems: "center",
                        padding: "20px",
                        backgroundColor: "#907FCF",
                    }}
                >
                    Manage Permissions for {selectedRole?.role}
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
                                        onChange={() => handlePermissionChange(name)}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                </DialogContent>
                <DialogActions>
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
                <Box
                    className="text-2xl text-white font-bold px-5 "
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "20px",
                        backgroundColor: "#907FCF",
                    }}
                >
                    Create New Role
                </Box>
                <DialogContent>
                    <TextField
                        label="Role Name"
                        value={newRole.role}
                        onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
                        fullWidth
                        sx={{
                            marginBottom: 3,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#F4F0FF',
                                borderRadius: 2,
                            },
                        }}
                    />
                    <Typography variant="h6" sx={{ marginBottom: 2, color: '#907FCF' }}>
                        Assign Permissions
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
                                    checked={newRole.permissions.includes(name)}
                                    onChange={() => handlePermissionChange(name, newRole)}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
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
                        onClick={handleSaveNewRole}
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

            {/* Snackbar Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default PermissionsPage;