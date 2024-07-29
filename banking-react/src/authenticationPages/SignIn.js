import React, { useState } from 'react';
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
import { Alert } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@emotion/react';

// The SignIn component is a form that allows users to sign in to the application
// It is displayed when the user is at http://localhost:3000/signin
// If successful, the user is redirected to the dashboard



  export default function SignIn() {
    // useNavigate hook is used to navigate to different pages
    const navigate = useNavigate();

    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });

    // The useTheme hook is used to access the theme object defined in index.js
    const theme = useTheme();

    // handleChange function updates the state variables when the user types in the form fields
    const handleChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      
      try {
        const response = await axios.post('http://localhost:8080/api/v1/registration/login', formData);
        if (response.status === 200) {
         
          // Directly store the response data in localStorage
          // localStorage is used to store the user data in the browser
          // this is a workaround from using java web tokens
          localStorage.setItem('user', JSON.stringify(response.data));
        
          // Navigate to the dashboard
          navigate('/dashboard');
    
        }
        else {
          setError('An error occurred. Please try again.');
        }
      } catch (error) {
        // Check if error.response exists and contains data
        if (error.response && error.response.data) {
          setError(error.response.data);
        } else {
          setError('An error occurred. Please try again.');
        }
      }
    };

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
            Sign in!
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: theme.palette.black.main}}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2" color='inherit'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
