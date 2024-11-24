import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from '@mui/material/Pagination';
import { getUsers, addUser, deleteUser, updateUser } from './mockApi';

const Users = () => {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        account: '',
        projects: '',
        role: '',
        expiration: '',
        status: 'Active', // Default status
    });
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 15;

    const statusOptions = ['Active', 'Inactive']; // Status options
    const roles = ['Admin', 'Editor', 'Viewer'];
    const sortOptions = ['Account', 'Date Added', 'Role'];

    useEffect(() => {
        const fetchUsers = async () => {
            const userData = await getUsers();
            setUsers(userData);
        };
        fetchUsers();
    }, []);

    const handleRoleChange = async (index, newRole) => {
        const userId = users[index].id;
        const updatedUser = await updateUser(userId, { role: newRole });
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === userId ? updatedUser : user))
        );
    };

    const handleExpirationChange = async (index, newDate) => {
        const userId = users[index].id;
        const updatedUser = await updateUser(userId, { expiration: newDate });
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === userId ? updatedUser : user))
        );
    };

    const handleStatusChange = async (index, newStatus) => {
        const userId = users[index].id;
        const updatedUser = await updateUser(userId, { status: newStatus });
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === userId ? updatedUser : user))
        );
    };

    const handleAddUser = async () => {
        if (!newUser.account || !newUser.role) {
            alert("Please fill all required fields.");
            return;
        }

        const newUserWithId = await addUser(newUser);
        setUsers((prevUsers) => [...prevUsers, newUserWithId]);
        setNewUser({ account: '', projects: '', accessExpires: '', role: '', expiration: '' });
        setIsModalOpen(false);
    };

    const handleDeleteUser = async (index) => {
        const userId = users[index].id;
        await deleteUser(userId);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    };

    const filteredAndSortedUsers = [...users]
        .filter(user => user.account.toLowerCase().includes(search.toLowerCase())) // Search filter
        .filter(user => roleFilter === '' || user.role === roleFilter) // Role filter
        .sort((a, b) => {
            if (sortBy === 'Account') {
                return a.account.localeCompare(b.account);
            } else if (sortBy === 'Date Added') {
                return new Date(a.expiration) - new Date(b.expiration);
            } else if (sortBy === 'Role') {
                return a.role.localeCompare(b.role);
            }
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

    return (
        <div className="bg-[#F5F4FF] h-screen">
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

            {/* Filter/Search/Sort Area */}
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

                    <TextField
                        label="Roles"
                        variant="outlined"
                        select
                        size="small"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
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
                    textAlign: 'center',
                    alignItems: 'center',
                }}
            >
                <div>Account</div>
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
                        <div>{user.account}</div>
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
        </div>
    );
};

export default Users;