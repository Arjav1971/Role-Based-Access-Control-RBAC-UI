import * as React from 'react';
import { Link, Outlet, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import GroupIcon from "@mui/icons-material/Group";
import Logo from "./assests/ImageAssets/logo.jpg";
import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AvatarImg from "./assests/ImageAssets/Avatar.png";
import HelpIcon from '@mui/icons-material/Help';
import TextField from '@mui/material/TextField';
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardIcon from '@mui/icons-material/Dashboard';

const drawerWidth = 250;

function ResponsiveDrawer(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    // Get current location from react-router-dom
    const location = useLocation();

    const menuItems = [
        { text: "Users", link: "/users", icon: <GroupIcon /> },
        { text: "Roles", link: "/roles", icon: <AdminPanelSettingsIcon /> },
    ];

    const drawer = (
        <div style={{ backgroundColor: "white", height: "100%" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                }}
            >
                <img
                    src={Logo}
                    alt="Logo"
                    style={{ maxWidth: "200%", height: "70px", marginLeft: "50px" }}
                />
                <span
                    style={{
                        maxWidth: "100%",
                        height: "auto",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        background: "#907FCF",
                        color: 'white',
                        borderRadius: "40px",
                    }}
                >
                    admin
                </span>
            </Box>

            <Divider />
            <List>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.link; // Check if the route matches the current item

                    return (
                        <ListItem key={item.text}>
                            <ListItemButton
                                component={Link}
                                to={item.link}
                                sx={{
                                    borderRadius: "20px", // Rounded corners
                                    backgroundColor: isActive ? "#907FCF" : "transparent", // Highlight active item
                                    color: isActive ? "white" : "inherit", // Change text color if active
                                    "&:hover": {
                                        color: "white",
                                        backgroundColor: "#907FCF",
                                        transform: "scale(1.01)",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                        transition: "all 0.3s ease",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? "white" : "inherit", // Change icon color if active
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        letterSpacing: "1px",
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex'}}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    padding: "14px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        justifyContent: "space-between",
                    }}
                >
                    <IconButton
                        background="#907FCF"
                        color="#907FCF"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        mr: 2,
                        display: { xs: "none", sm: "flex" },
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "20px",
                    }}
                >
                    <TextField
                        id="search-box"
                        variant="outlined"
                        size="small"
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
                    <HelpIcon sx={{ color: "#907FCF" }} />
                    <NotificationsIcon sx={{ color: "#907FCF" }} />
                    <Avatar alt="Cindy Baker" src={AvatarImg} />
                </Box>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, backgroundColor: "#F5F4FF", height: "100%" }}
            >
                <Toolbar />
                <div className="mt-10 md:mt-2 mx-4 ">
                    <Outlet />
                </div>
            </Box>
        </Box>
    );
}

ResponsiveDrawer.propTypes = {
    window: PropTypes.func,
};

export default ResponsiveDrawer;