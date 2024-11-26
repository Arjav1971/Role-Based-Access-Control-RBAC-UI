import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getUsers, addUser, deleteUser, updateUser } from '../apis/mockApi';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
const Users = () => {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 15;

    useEffect(() => {
        const fetchUsers = async () => {
            const userData = await getUsers();
            setUsers(userData);
        };
        fetchUsers();
    }, []);

    const roles = ['Admin', 'Editor', 'Viewer'];
    const statusOptions = ['Active', 'Inactive'];
    const sortOptions = ['User', 'Expiration Date', 'Role'];

    const handleSnackbarOpen = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleAddUser = async (values, { resetForm }) => {
        try {
            const newUserWithId = await addUser(values);
            setUsers((prevUsers) => [...prevUsers, newUserWithId]);
            resetForm();
            setIsModalOpen(false);
            handleSnackbarOpen(`User "${newUserWithId.user}" added successfully.`);
        } catch (error) {
            handleSnackbarOpen('Failed to add user. Please try again.', 'error');
        }
    };

    const handleDeleteUser = async (index) => {
        const userId = users[index].id;
        await deleteUser(userId);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        handleSnackbarOpen('User deleted successfully.');
    };

    const filteredAndSortedUsers = [...users]
        .filter(user => user.user.toLowerCase().includes(search.toLowerCase()))
        .filter(user => roleFilter === '' || user.role === roleFilter)
        .sort((a, b) => {
            if (sortBy === 'User') return a.user.localeCompare(b.user);
            if (sortBy === 'Expiration Date') return new Date(a.expiration) - new Date(b.expiration);
            if (sortBy === 'Role') return a.role.localeCompare(b.role);
            return 0;
        });

    const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);

    const paginatedUsers = filteredAndSortedUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Validation schema using Yup
    const validationSchema = Yup.object().shape({
        user: Yup.string().required('User Name is required'),
        projects: Yup.number()
            .typeError('Projects must be a valid number')
            .min(0, 'Projects must be a non-negative number')
            .required('Projects is required'),
        role: Yup.string().required('Role is required'),
        expiration: Yup.date()
            .min(new Date(), 'Expiration Date cannot be in the past')
            .required('Expiration Date is required'),
    });
    const handleRoleChange = async (index, newRole) => {
        const userId = users[index].id;
        const updatedUser = await updateUser(userId, { role: newRole });
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === userId ? updatedUser : user))
        );
        handleSnackbarOpen(`Role updated to "${newRole}" successfully.`);
    };

    const handleExpirationChange = async (index, newDate) => {
        const today = new Date().toISOString().split('T')[0]; 
        if (newDate < today) {
            handleSnackbarOpen("Expiration date cannot be in the past.", "error");
            return;
        }
        const userId = users[index].id;
        const updatedUser = await updateUser(userId, { expiration: newDate });
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === userId ? updatedUser : user))
        );
        handleSnackbarOpen(`Expiration date updated to "${newDate}" successfully.`);
    };
    const handleStatusChange = async (index, newStatus) => {
        const userId = users[index].id;
        const updatedUser = await updateUser(userId, { status: newStatus });
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === userId ? updatedUser : user))
        );
        handleSnackbarOpen(`Status updated to "${newStatus}" successfully.`);
    };

    return (
        <div className="bg-[#F5F4FF] h-screen p-6">
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
            }}>
                <div className="text-4xl font-bold mb-4">Users</div>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', gap: "20px"
                }}>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#907FCF] text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-[#6e5bb7] transition-all duration-300"
                    >
                        Add User
                    </button>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`${isEditing ? 'bg-red-500 hover:bg-red-600' : 'bg-[#907FCF] hover:bg-[#6e5bb7]'
                            } text-white font-semibold px-5 py-2 rounded-lg shadow-md  transition-all duration-300`}
                    >
                        {isEditing ? 'Cancel Edit' : 'Edit Roles'}
                    </button>
                </Box>
            </Box>

            {/* Modal for Adding New User */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
                <Box className="text-2xl text-white font-bold px-5" sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "20px",
                    backgroundColor: "#907FCF",
                }}>
                    Add New User
                </Box>
                <Formik
                    initialValues={{
                        user: '',
                        projects: '',
                        role: '',
                        expiration: '',
                        status: 'Active',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleAddUser}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <DialogContent sx={{ backgroundColor: "#F9FAFB", padding: "20px" }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Field
                                        as={TextField}
                                        label="User Name"
                                        name="user"
                                        fullWidth
                                        error={touched.user && !!errors.user}
                                        helperText={touched.user && errors.user}
                                    />
                                    <Field
                                        as={TextField}
                                        label="Projects"
                                        name="projects"
                                        type="number"
                                        fullWidth
                                        error={touched.projects && !!errors.projects}
                                        helperText={touched.projects && errors.projects}
                                    />
                                    <Field
                                        as={TextField}
                                        label="Role"
                                        name="role"
                                        select
                                        fullWidth
                                        error={touched.role && !!errors.role}
                                        helperText={touched.role && errors.role}
                                    >
                                        {roles.map((role) => (
                                            <MenuItem key={role} value={role}>
                                                {role}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                    <Field
                                        as={TextField}
                                        label="Expiration Date"
                                        name="expiration"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        error={touched.expiration && !!errors.expiration}
                                        helperText={touched.expiration && errors.expiration}
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions sx={{ padding: "10px 20px" }}>
                                <Button
                                    onClick={() => setIsModalOpen(false)}
                                    variant="contained"
                                    sx={{ backgroundColor: '#E0E0E0', color: 'black', '&:hover': { backgroundColor: '#C0C0C0' } }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ backgroundColor: "#907FCF", "&:hover": { backgroundColor: "#6e5bb7" } }}
                                >
                                    Save
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* Table and Other Components */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 3,
                    backgroundColor: '#F9FAFB',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: "10px",
                        backgroundColor: '#F9FAFB',
                    }}
                >
                    {/* Search Box */}
                    <TextField
                        id="search-box"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        sx={{
                            width: "250px",
                            "& .MuiOutlinedInput-root": {
                                height: "40px",
                                borderRadius: "12px",
                                backgroundColor: "#F4F0FF",
                                "&:hover": {
                                    backgroundColor: "rgba(144, 127, 207, 0.2)",
                                },
                                "&.Mui-focused": {
                                    backgroundColor: "rgba(144, 127, 207, 0.3)",
                                    boxShadow: "0 0 4px rgba(144, 127, 207, 0.5)",
                                    borderColor: "transparent",
                                },
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                            "& .MuiInputBase-input": {
                                color: "black",
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon
                                        sx={{
                                            color: "#907FCF",
                                        }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Role Filter */}
                    <TextField
                        label="Roles"
                        variant="outlined"
                        select
                        size="small"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        sx={{
                            minWidth: 150,
                            marginRight: 1,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                backgroundColor: "#F4F0FF",
                                "&:hover": {
                                    backgroundColor: "rgba(144, 127, 207, 0.2)",
                                },
                                "&.Mui-focused": {
                                    backgroundColor: "rgba(144, 127, 207, 0.3)",
                                    boxShadow: "0 0 4px rgba(144, 127, 207, 0.5)",
                                },
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                            "& .MuiInputLabel-root": {
                                color: "#907FCF",
                            },
                            "& .MuiSelect-icon": {
                                color: "#907FCF",
                            },
                            "& .MuiMenuItem-root": {
                                "&:hover": {
                                    backgroundColor: "rgba(144, 127, 207, 0.1)",
                                },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>All Roles</em>
                        </MenuItem>
                        {roles.map((role) => (
                            <MenuItem key={role} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                {/* Sort By */}
                <TextField
                    label="Sort By"
                    variant="outlined"
                    select
                    size="small"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{
                        minWidth: 150,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "#F4F0FF",
                            "&:hover": {
                                backgroundColor: "rgba(144, 127, 207, 0.2)",
                            },
                            "&.Mui-focused": {
                                backgroundColor: "rgba(144, 127, 207, 0.3)",
                                boxShadow: "0 0 4px rgba(144, 127, 207, 0.5)",
                            },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                        "& .MuiInputLabel-root": {
                            color: "#907FCF",
                        },
                        "& .MuiSelect-icon": {
                            color: "#907FCF",
                        },
                        "& .MuiMenuItem-root": {
                            "&:hover": {
                                backgroundColor: "rgba(144, 127, 207, 0.1)",
                            },
                        },
                    }}
                >
                    {sortOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
            {/* Table Header */}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: isEditing
                        ? '1fr 1fr 1fr 1fr 1fr 1fr' // Include Actions column
                        : '1fr 1fr 1fr 1fr 1fr',   // Exclude Actions column
                    paddingX: 3,
                    paddingY: 2,
                    fontWeight: 'bold',
                    backgroundColor: '#FFFFFF',
                    borderTop: '1px solid #E0E0E0',
                    borderBottom: '1px solid #E0E0E0',
                    textAlign: 'center', // Horizontally center text
                    alignItems: 'center', // Vertically center text
                }}
            >
                <div>User</div>
                <div>Projects</div>
                <div>Status</div>
                <div>Role</div>
                <div>Expiration</div>
                {isEditing && <div>Actions</div>}
            </Box>
            {/* Table Rows */}
            <Box sx={{ paddingX: 2, paddingY: 2, backgroundColor: '#FFFFFF' }}>
                {paginatedUsers.map((user, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: isEditing
                                ? '1fr 1fr 1fr 1fr 1fr 1fr' 
                                : '1fr 1fr 1fr 1fr 1fr',   
                            padding: '10px 0',
                            backgroundColor: index % 2 === 0 ? '#F9FAFB' : '#FFFFFF',
                            alignItems: 'center', 
                            textAlign: 'center', 
                        }}
                    >
                        <div>{user.user}</div>
                        <div>{user.projects}</div>
                        <div>
                            {isEditing ? (
                                <TextField
                                    select
                                    size="small"
                                    value={user.status}
                                    onChange={(e) => handleStatusChange(index, e.target.value)}
                                    sx={{
                                        width: "130px",
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: '8px',
                                            backgroundColor: '#F4F0FF',
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: 'none',
                                        },
                                    }}
                                >
                                    {statusOptions.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ) : (
                                user.status
                            )}
                        </div>
                        <div>
                            {isEditing ? (
                                <TextField
                                    select
                                    size="small"
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(index, e.target.value)}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: '8px',
                                            backgroundColor: '#F4F0FF',
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: 'none',
                                        },
                                    }}
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role} value={role}>
                                            {role}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ) : (
                                user.role
                            )}
                        </div>
                        <div>
                            {isEditing ? (
                                <TextField
                                    type="date"
                                    size="small"
                                    value={user.expiration}
                                    onChange={(e) => handleExpirationChange(index, e.target.value)}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: '8px',
                                            backgroundColor: '#F4F0FF',
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: 'none',
                                        },
                                    }}
                                />
                            ) : (
                                user.expiration
                            )}
                        </div>
                        {isEditing && (
                            <div>
                                <IconButton onClick={() => handleDeleteUser(index)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        )}
                    </div>
                ))}
            </Box>
            {/* Pagination */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 2,
                }}
            >
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: '#907FCF',
                        },
                        '& .Mui-selected': {
                            backgroundColor: '#907FCF !important',
                            color: 'white',
                        },
                        '& .MuiPaginationItem-ellipsis': {
                            color: '#907FCF',
                        },
                    }}
                />
            </Box>

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

export default Users;