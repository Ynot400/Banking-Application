import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the user data from localStorage
    localStorage.removeItem('user');
    // Navigate back to the login page
    navigate('/login');
  };

  return (
    <ListItemButton onClick={handleLogout} sx={{ mt: 'auto' }}>
      <ListItemIcon>
        <LogoutIcon style={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="Logout" style={{ color: "white" }} />
    </ListItemButton>
  );
};

export default Logout;
