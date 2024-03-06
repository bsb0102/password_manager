import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems, secondaryListItems, footerListItem } from '../Sidebar/Sidebar';
import PasswordManager from "../PasswordManager/PasswordManager"
import Settings from "../Settings/Settings"
import SecretNodeCreator from "../Secret Nodes/SecretNodeCreator"
import axiosInstance from '../../api/api.js';
import Cookies from 'js-cookie';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();


function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const defaultSelectedItem = 'Dashboard';
  const [selectedItem, setSelectedItem] = React.useState(defaultSelectedItem);
  const navigate = useNavigate();


  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    // Define a function to handle logout
    const logout = () => {
      // Remove the token from cookies
      Cookies.remove('token'); // This removes the token stored in the cookies
      
      // Clear the Authorization header from the axios instance
      if (axiosInstance.defaults.headers.common['Authorization']) {
        delete axiosInstance.defaults.headers.common['Authorization'];
      }
      
      // Remove the token and any other related data from localStorage
      localStorage.removeItem('token');
      
      // Check if there's a temporary token stored in localStorage
      const tempToken = localStorage.getItem('tempToken');
      if (tempToken) {
        // Remove the temporary token from localStorage
        localStorage.removeItem('tempToken');
        
        // Also remove the temporary token from cookies if it exists
        Cookies.remove('tempToken');
      }
      
      // Navigate to the login page or another appropriate page
      navigate('/login'); // Assuming 'navigate' is obtained from useNavigate() hook.
      
      console.log("Successfully logged out");
    };
  
    // Display confirmation prompt
    const confirmed = window.confirm("Are you sure you want to logout?");
    
    // If user confirms, proceed with logout
    if (confirmed) {
      logout(); // Call logout function
    } else {
      // If user cancels, do nothing
      console.log("Logout canceled");
    }
  };
  
  
  
  

  const handleSidebarItemClick = (text) => {
    setSelectedItem(text || "");
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 'Dashboard':
        return <div>Dashboard Content</div>;
      case 'Passwords':
        return <PasswordManager />;
      case 'Secret Nodes':
        return <SecretNodeCreator />;
      case 'Settings':
        return <Settings />;

      case 'Logout':
        handleLogout();
        return <div>Successfully logged out</div>;
      
      default:
        return <div>No content available</div>;
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px',
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav" style={{ position: 'relative', minHeight: '100vh' }}>
            {mainListItems({ onItemClick: handleSidebarItemClick })}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems({ onItemClick: handleSidebarItemClick })}
            {footerListItem({ onItemClick: handleSidebarItemClick })}
          </List>

        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            // overflow: 'auto',
          }}
        >
          <Toolbar />
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
