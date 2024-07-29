import React, { useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@emotion/react';

// The SignUp component is a form that allows users to sign up for the application
// It is displayed when the user is at http://localhost:3000


export default function SignUp() {

  // useTheme hook is used to access the theme object defined in index.js
  const theme = useTheme();

  // useState hook is used to create state variables in functional components
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState(''); 

 // handleChange function updates the state variables when the user types in the form fields
  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
  };
  // handleSubmit function sends a POST request to the backend when the user submits the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8080/api/v1/registration/register', formData);
        if (response.status === 200) {
             // Registration successful, update state to show confirmation message
             setConfirmationMessage(response.data);
        }
      } catch (error) {
          console.error('Error during registration:', error); 
          if (error.response && error.response.data) {
              setError(error.response.data); // Display backend error message
          } else {
              setError('An error occurred. Please try again.'); // Generic error message
          }
      }
  };

  // the confirmationMessage will be received from the backend if the registration is successful
  // An email will be sent to the user with a confirmation link to activate their account
  if (confirmationMessage) {
    // If confirmationMessage is set, display it and nothing else
    return (
      <ThemeProvider theme={theme}>
        <Typography variant="h5" align="center" style={{ marginTop: '20px' }}>
          {confirmationMessage}
        </Typography>
      </ThemeProvider>
    );
  }
  else {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
        {error && <Alert severity="error">{error}</Alert>}
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: theme.palette.black.main }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up for my Banking App!
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="username"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label="username"
                    autoFocus
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: theme.palette.black.main, color: theme.palette.white.main }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2" color='inherit'>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}