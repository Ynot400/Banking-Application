import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { styled, useTheme, ThemeProvider } from '@mui/material/styles';
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
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import Logout from '../authenticationPages/logout';
import { mainListItems } from './listItems';
import Transactions from './NavigationBarRoutingComponents/Transactions';
import CreditCardHub from './NavigationBarRoutingComponents/CreditCardHub';
import AccountForm from './NavigationBarRoutingComponents/AccountSetup';
import BankingDashboard from './NavigationBarRoutingComponents/Dashboard';


// This component is the navigational bar that connects throughout all the dashboard components
// The component was taken and refined from a free MUI template

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.palette.white.main,
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
      backgroundColor: theme.palette.black.main,
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

export default function Dashboard() {
  const userJson = localStorage.getItem('user'); // Retrieve the JSON string
  const userObj = JSON.parse(userJson); // Parse the JSON string to an object
  const username = userObj.username; // Extract the 'username' property 
  const name = userObj.name; // Extract the 'name' property
  const [isNewUser, setIsNewUser] = useState(false);
  const [accountData, setAccountData] = useState(null);

  const fetchAccountData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/account/${username}`);
      if (response.status === 200) {
        console.log('Account Data:', response.data);
        setAccountData(response.data);
      } else if (response.status === 204) {
        setIsNewUser(true);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error during account data fetch:', error.response.data);
      } else if (error.request) {
        console.error('Error during account data fetch: No response received', error.request);
      } else {
        console.error('Error during account data fetch:', error.message);
      }
    }
  };

  useEffect(() => {
    if (username) fetchAccountData();
  }, [username]);

  const defaultTheme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: '24px' }}>
            <IconButton
              edge="start"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                color: defaultTheme.palette.white.main,
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon sx={{ color: defaultTheme.palette.black.main }} />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              noWrap
              sx={{
                flexGrow: 1,
                color: defaultTheme.palette.black.main,
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fontSize: '24px',
              }}
            >
              <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                Banking System
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1], }}>
            <IconButton onClick={toggleDrawer} sx={{ color: defaultTheme.palette.white.main }}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
          </List>
          <Logout />
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
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* If the user is new, display a welcome message and a button to start the account setup process */}
            {isNewUser ? (
              <Grid container spacing={3}>
                <h1>Welcome {name}! Please Click this Button to get started on setting up your account.</h1>
                <button onClick={() => navigate('/accountSetup')}>Account Setup</button>
              </Grid>
            ) : (
              <Routes>
                <Route path="" element={<BankingDashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="creditcards" element={<CreditCardHub />} />
                <Route path="accountSetup" element={<AccountForm />} />
              </Routes>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
