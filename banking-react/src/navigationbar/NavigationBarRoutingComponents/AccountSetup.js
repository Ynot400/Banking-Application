import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Container, Typography, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { ThemeProvider, useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

// This component is the form for creating a new account

export default function AccountForm() {
  
  const theme = useTheme();

  const userJson = localStorage.getItem('user'); // Retrieve the JSON string
  const userObj = JSON.parse(userJson); // Parse the JSON string to an object
  const username = userObj.username; // Extract the 'username' property

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    AccountName: '',
    AccountType: '',
    Balance: '',
    Currency: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/api/account/${username}`, formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, bgcolor: theme.palette.white.main }}>
        <Typography component="h1" variant="h5" align="center">
          Account Setup
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Account Type"
                name="AccountType"
                value={formData.AccountType}
                onChange={handleChange}
                required
                InputProps={{
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.lightBlue.main, // Replace 'desiredColor' with your color
                      },
                    },
                  },
                }}
              >
                <MenuItem value="Checking">Checking</MenuItem>
                <MenuItem value="Savings">Savings</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Account Holder Name"
                name="AccountName"
                value={formData.AccountName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Current Balance"
                name="Balance"
                value={formData.Balance}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Currency"
                name="Currency"
                value={formData.Currency}
                onChange={handleChange}
                required
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
                <MenuItem value="JPY">JPY</MenuItem>
                <MenuItem value="CAD">CAD</MenuItem>
                <MenuItem value="AUD">AUD</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" sx={{bgcolor: theme.palette.black.main }}>
                Create Account
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
    </ThemeProvider>
  );
}
